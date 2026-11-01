# Environment Configuration

## Overview

MAMIE menggunakan environment variables untuk configuration. File ini menjelaskan semua environment variables yang digunakan.

## Environment Files

### `.env` (Local Development)
```bash
# API Keys (Optional - for enhanced features)
VITE_FRED_API_KEY=your_fred_api_key_here
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Feature Flags
VITE_ENABLE_WEBSOCKET=false
VITE_ENABLE_AI_INSIGHTS=false
VITE_ENABLE_REAL_TIME_DATA=false

# API Endpoints
VITE_API_BASE_URL=http://localhost:3001
VITE_DATA_SOURCE=yahoo

# Environment
VITE_ENVIRONMENT=development
VITE_DEBUG=true
```

### `.env.staging` (Staging Environment)
```bash
VITE_FRED_API_KEY=staging_fred_key
VITE_OPENAI_API_KEY=staging_openai_key

VITE_ENABLE_WEBSOCKET=true
VITE_ENABLE_AI_INSIGHTS=true
VITE_ENABLE_REAL_TIME_DATA=true

VITE_API_BASE_URL=https://api-staging.mamie.app
VITE_DATA_SOURCE=yahoo

VITE_ENVIRONMENT=staging
VITE_DEBUG=false
```

### `.env.production` (Production Environment)
```bash
VITE_FRED_API_KEY=production_fred_key
VITE_OPENAI_API_KEY=production_openai_key

VITE_ENABLE_WEBSOCKET=true
VITE_ENABLE_AI_INSIGHTS=true
VITE_ENABLE_REAL_TIME_DATA=true

VITE_API_BASE_URL=https://api.mamie.app
VITE_DATA_SOURCE=yahoo

VITE_ENVIRONMENT=production
VITE_DEBUG=false
```

## Environment Variables Reference

### API Keys

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_FRED_API_KEY` | FRED API key for economic data | No | `DEMO_KEY` |
| `VITE_OPENAI_API_KEY` | OpenAI API key for AI features | No | None |

### Feature Flags

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_ENABLE_WEBSOCKET` | Enable WebSocket for real-time data | `false` |
| `VITE_ENABLE_AI_INSIGHTS` | Enable AI-powered insights | `false` |
| `VITE_ENABLE_REAL_TIME_DATA` | Enable real-time data updates | `false` |

### API Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3001` |
| `VITE_DATA_SOURCE` | Primary data source | `yahoo` |

### Environment

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_ENVIRONMENT` | Current environment | `development` |
| `VITE_DEBUG` | Enable debug mode | `true` |

## Usage in Code

```typescript
// Access environment variables
const apiKey = import.meta.env.VITE_FRED_API_KEY;
const isDebug = import.meta.env.VITE_DEBUG === 'true';

// Feature flags
if (import.meta.env.VITE_ENABLE_WEBSOCKET === 'true') {
  // Initialize WebSocket connection
}

// Environment-specific logic
if (import.meta.env.VITE_ENVIRONMENT === 'production') {
  // Production-only code
}
```

## Security Best Practices

### 1. Never Commit Secrets
```bash
# Add to .gitignore
.env
.env.local
.env.*.local
```

### 2. Use Environment-Specific Files
```bash
.env                # Local development (gitignored)
.env.example        # Template for developers (committed)
.env.staging        # Staging environment
.env.production     # Production environment
```

### 3. Validate Environment Variables
```typescript
// src/utils/env.ts
export function validateEnv() {
  const required = ['VITE_API_BASE_URL'];
  
  required.forEach((key) => {
    if (!import.meta.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });
}
```

## Deployment

### Vercel
```bash
# Set environment variables in Vercel dashboard
vercel env add VITE_FRED_API_KEY
vercel env add VITE_OPENAI_API_KEY
```

### Netlify
```bash
# Set in netlify.toml or dashboard
[build.environment]
  VITE_FRED_API_KEY = "your_key"
```

### Docker
```dockerfile
# Pass as build args
docker build --build-arg VITE_FRED_API_KEY=$FRED_KEY .
```

## Troubleshooting

### Variables not loading
1. Check file naming (`.env` not `env`)
2. Restart development server
3. Check for typos in variable names

### Variables undefined in production
1. Ensure variables are prefixed with `VITE_`
2. Check deployment platform configuration
3. Verify build process includes env variables

### Security warnings
1. Never expose sensitive keys in client-side code
2. Use backend proxy for sensitive operations
3. Rotate keys regularly

## Future Enhancements

- [ ] Add environment validation on startup
- [ ] Implement secret management (AWS Secrets Manager)
- [ ] Add environment-specific feature toggles
- [ ] Implement configuration management system
