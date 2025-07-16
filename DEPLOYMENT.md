# Production Deployment Guide

This guide covers deploying the MiniKit Checkers game with production-ready multiplayer functionality to Vercel.

## Overview

The application now includes:
- **Real-time multiplayer** using Socket.IO
- **Serverless WebSocket support** via Vercel functions
- **Voice chat** with WebRTC peer-to-peer connections
- **Auto-reconnection** and error handling
- **Production-optimized** Socket.IO configuration

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Coinbase API Key**: Get from [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)

## Deployment Steps

### 1. Environment Configuration

Create a `.env.local` file with your production values:

```bash
# Copy from .env.example and update
cp .env.example .env.local
```

Update the following variables:
- `VITE_CDP_API_KEY`: Your Coinbase API key
- `VITE_APP_URL`: Your Vercel deployment URL
- `VITE_APP_ICON`: Full URL to your app icon
- `VITE_APP_SPLASH_IMAGE`: Full URL to your splash image
- `VITE_APP_OG_IMAGE`: Full URL to your OG image

### 2. Deploy to Vercel

#### Option A: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: GitHub Integration

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables in Vercel dashboard
5. Deploy

### 3. Configure Environment Variables in Vercel

In your Vercel project dashboard, add these environment variables:

```
VITE_CDP_API_KEY=your_coinbase_api_key
VITE_PROJECT_NAME=Checkers Game
VITE_APP_URL=https://your-app.vercel.app
VITE_APP_SUBTITLE=Play Checkers on Base
VITE_APP_DESCRIPTION=A classic checkers game with AI and multiplayer support
VITE_APP_ICON=https://your-app.vercel.app/icon.png
VITE_APP_SPLASH_IMAGE=https://your-app.vercel.app/splash.png
VITE_SPLASH_BACKGROUND_COLOR=#1e293b
VITE_APP_PRIMARY_CATEGORY=games
VITE_APP_HERO_IMAGE=https://your-app.vercel.app/hero.png
VITE_APP_TAGLINE=Strategic fun on Base
VITE_APP_OG_TITLE=Checkers Game - Base MiniKit
VITE_APP_OG_DESCRIPTION=Play classic checkers with AI and friends on Base blockchain
VITE_APP_OG_IMAGE=https://your-app.vercel.app/og-image.png
NODE_ENV=production
```

### 4. Update URLs After Deployment

After your first deployment:

1. Note your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Update all URL references in environment variables
3. Redeploy to apply changes

## Multiplayer Architecture

### Socket.IO Serverless Function

The multiplayer functionality uses a Vercel serverless function at `/api/socket.js` that:

- **Manages WebSocket connections** using Socket.IO
- **Handles room creation and joining**
- **Broadcasts game moves** in real-time
- **Manages voice chat signaling** for WebRTC
- **Auto-cleans up** old rooms and disconnected players

### Client-Side Features

- **Auto-reconnection** on connection loss
- **Error handling** with user-friendly messages
- **Voice chat** with microphone permissions
- **Real-time game state sync**
- **Player presence** indicators

## Production Considerations

### Scaling

- **In-memory storage**: Current implementation uses in-memory room storage
- **For high traffic**: Consider Redis or database for room persistence
- **Multiple regions**: Vercel automatically handles global distribution

### Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Function logs**: Available in Vercel dashboard
- **Error tracking**: Consider adding Sentry or similar

### Security

- **CORS configuration**: Properly configured for your domain
- **Rate limiting**: Consider adding for production
- **Input validation**: Implemented for room IDs and game moves

## Testing Multiplayer

### Local Testing

```bash
# Start development server
npm run dev

# Test in multiple browser tabs/windows
# Create room in one tab, join with room ID in another
```

### Production Testing

1. **Create a room** on your deployed app
2. **Share room ID** with another user
3. **Test game moves** and voice chat
4. **Verify reconnection** by refreshing browser

## Troubleshooting

### Common Issues

1. **Socket connection fails**
   - Check CORS configuration in `/api/socket.js`
   - Verify environment variables are set
   - Check Vercel function logs

2. **Voice chat not working**
   - Ensure HTTPS (required for microphone access)
   - Check browser permissions
   - Verify STUN server connectivity

3. **Room not found errors**
   - Rooms are stored in memory and reset on function restart
   - Consider implementing persistent storage for production

### Debug Mode

Enable Socket.IO debug logs:

```javascript
// In browser console
localStorage.debug = 'socket.io-client:socket';
```

## Performance Optimization

### Vercel Function Optimization

- **Cold starts**: Minimized with proper configuration
- **Memory usage**: Optimized for serverless environment
- **Connection pooling**: Handled automatically by Socket.IO

### Client Optimization

- **Bundle size**: Socket.IO client is tree-shakeable
- **Connection management**: Automatic reconnection with exponential backoff
- **Memory leaks**: Proper cleanup on component unmount

## Next Steps

For production at scale, consider:

1. **Redis integration** for persistent room storage
2. **Database** for game history and user profiles
3. **Authentication** for user accounts
4. **Matchmaking** system for random opponents
5. **Spectator mode** for watching games
6. **Tournament system** for competitive play

## Support

For issues or questions:
- Check Vercel function logs in dashboard
- Review browser console for client-side errors
- Test Socket.IO connection with debug mode enabled