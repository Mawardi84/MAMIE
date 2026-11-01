import { useRef } from 'react';
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useMonitoring } from './MonitoringProvider';

interface WebSocketContextType {
  isConnected: boolean;
  lastMessage: any;
  subscribe: (channel: string, callback: (data: any) => void) => () => void;
  send: (message: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
  url?: string;
}

/**
 * WebSocket Provider
 * Provides real-time data streaming capabilities
 */
export function WebSocketProvider({ children, url }: WebSocketProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [subscribers, setSubscribers] = useState<Map<string, Set<(data: any) => void>>>(new Map());
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<number>();
  const { trackEvent, trackError } = useMonitoring();

  const wsUrl = url || import.meta.env.VITE_WEBSOCKET_URL || 'wss://stream.binance.com:9443/ws';

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        setIsConnected(true);
        trackEvent('websocket_connected', { url: wsUrl });
        console.log('[WebSocket] Connected');

        // Clear reconnect timeout if exists
        if (reconnectTimeout.current) {
          clearTimeout(reconnectTimeout.current);
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);

          // Notify subscribers
          const channel = data.stream || data.e || 'default';
          const channelSubscribers = subscribers.get(channel);
          if (channelSubscribers) {
            channelSubscribers.forEach((callback) => callback(data));
          }

          // Also notify 'all' subscribers
          const allSubscribers = subscribers.get('all');
          if (allSubscribers) {
            allSubscribers.forEach((callback) => callback(data));
          }
        } catch (error) {
          console.error('[WebSocket] Parse error:', error);
          trackError(error as Error, { message: event.data });
        }
      };

      ws.current.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
        trackError(new Error('WebSocket error'), { url: wsUrl });
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        trackEvent('websocket_disconnected', { url: wsUrl });
        console.log('[WebSocket] Disconnected');

        // Reconnect after 5 seconds
        reconnectTimeout.current = setTimeout(() => {
          console.log('[WebSocket] Attempting to reconnect...');
          connect();
        }, 5000);
      };
    } catch (error) {
      console.error('[WebSocket] Connection error:', error);
      trackError(error as Error, { url: wsUrl });
    }
  }, [wsUrl, subscribers, trackEvent, trackError]);

  const disconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  }, []);

  const subscribe = useCallback(
    (channel: string, callback: (data: any) => void) => {
      if (!subscribers.has(channel)) {
        subscribers.set(channel, new Set());
      }
      subscribers.get(channel)!.add(callback);

      // Return unsubscribe function
      return () => {
        const channelSubs = subscribers.get(channel);
        if (channelSubs) {
          channelSubs.delete(callback);
          if (channelSubs.size === 0) {
            subscribers.delete(channel);
          }
        }
      };
    },
    [subscribers]
  );

  const send = useCallback((message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn('[WebSocket] Not connected, message not sent');
    }
  }, []);

  useEffect(() => {
    if (import.meta.env.VITE_ENABLE_WEBSOCKET === 'true') {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        lastMessage,
        subscribe,
        send,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

/**
 * Hook to access WebSocket functionality
 */
export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
}

/**
 * Hook to subscribe to a specific channel
 */
export function useWebSocketSubscription(channel: string, callback: (data: any) => void) {
  const { subscribe } = useWebSocket();

  useEffect(() => {
    const unsubscribe = subscribe(channel, callback);
    return unsubscribe;
  }, [channel, callback, subscribe]);
}
