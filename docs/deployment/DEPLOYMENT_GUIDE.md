# Deployment Guide

## Overview

This guide covers deploying MAMIE to various platforms and environments.

## Prerequisites

- Node.js 20+
- npm or yarn
- Git
- Deployment platform account (Vercel, Netlify, AWS, etc.)

## Build Process

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Tests
```bash
npm run test
```

### 3. Build Application
```bash
npm run build
```

Build output will be in `dist/` directory.

### 4. Preview Build
```bash
npm run preview
```

## Deployment Platforms

### Vercel (Recommended)

#### Automatic Deployment
1. Connect your GitHub repository to Vercel
2. Vercel will auto-detect Vite configuration
3. Deploy on every push to main

#### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### Environment Variables
Set in Vercel dashboard:
- `VITE_FRED_API_KEY`
- `VITE_OPENAI_API_KEY`
- Other environment variables from `.env.example`

### Netlify

#### Automatic Deployment
1. Connect repository to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

#### Manual Deployment
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

### AWS S3 + CloudFront

#### Build
```bash
npm run build
```

#### Upload to S3
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

#### Invalidate CloudFront
```bash
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Docker

#### Build Image
```bash
docker build -t mamie:latest .
```

#### Run Container
```bash
docker run -p 80:80 mamie:latest
```

#### Docker Compose
```yaml
version: '3.8'
services:
  mamie:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_FRED_API_KEY=${FRED_API_KEY}
```

## CI/CD Pipeline

### GitHub Actions

Workflow is configured in `.github/workflows/ci.yml`:

1. **Test Job**: Runs tests and linting
2. **Build Job**: Builds application
3. **Security Job**: Runs security audit
4. **Deploy Preview**: Deploys PR previews
5. **Deploy Production**: Deploys to production on main branch

### Pipeline Flow
```
Push/PR → Test → Build → Security → Deploy
```

## Environment Configuration

### Development
```bash
cp .env.example .env
# Edit .env with your values
npm run dev
```

### Staging
```bash
# Use .env.staging
npm run build -- --mode staging
```

### Production
```bash
# Use .env.production
npm run build -- --mode production
```

## Monitoring

### Error Tracking
Configure Sentry in `.env`:
```bash
VITE_SENTRY_DSN=your_sentry_dsn
```

### Analytics
Configure Google Analytics in `.env`:
```bash
VITE_GA_ID=your_ga_id
```

### Performance Monitoring
- Use Lighthouse CI for performance audits
- Monitor Core Web Vitals
- Track bundle size

## Security Checklist

- [ ] Environment variables are not committed
- [ ] API keys are stored securely
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Security headers are set
- [ ] Dependencies are up to date
- [ ] Security audit passes

## Performance Optimization

### Bundle Analysis
```bash
npm run build
npx vite-bundle-visualizer
```

### Optimization Tips
1. **Code Splitting**: Already implemented with React.lazy()
2. **Tree Shaking**: Vite handles automatically
3. **Image Optimization**: Use WebP format
4. **Caching**: Configure CDN cache headers
5. **Compression**: Enable gzip/brotli

## Rollback Strategy

### Vercel
1. Go to Deployments tab
2. Find previous successful deployment
3. Click "Promote to Production"

### Netlify
1. Go to Deploys tab
2. Find previous deploy
3. Click "Publish deploy"

### Manual Rollback
```bash
# Revert to previous commit
git revert HEAD

# Redeploy
npm run build
# Deploy build
```

## Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### Environment Variables Not Loading
1. Check file naming (`.env` not `env`)
2. Restart development server
3. Verify variable names start with `VITE_`

### Deployment Fails
1. Check build logs
2. Verify environment variables
3. Check platform-specific configuration

## Post-Deployment

### Verification Checklist
- [ ] Application loads correctly
- [ ] All pages are accessible
- [ ] API calls work
- [ ] Environment variables are set
- [ ] Monitoring is active
- [ ] Error tracking is working

### Smoke Tests
1. Load homepage
2. Navigate to each major section
3. Test search functionality
4. Test export functionality
5. Verify notifications work

## Maintenance

### Regular Tasks
- **Weekly**: Check error logs
- **Monthly**: Update dependencies
- **Quarterly**: Security audit
- **Bi-annually**: Performance review

### Dependency Updates
```bash
# Check for updates
npm outdated

# Update packages
npm update

# Update major versions carefully
npm install package@latest
```

## Support

For deployment issues:
1. Check deployment logs
2. Review environment configuration
3. Check platform status page
4. Contact support team

## Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [AWS S3 Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
