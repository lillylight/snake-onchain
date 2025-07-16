# Checkers Game - Base MiniKit Mini App

A classic checkers game built as a Base MiniKit mini app with AI opponents, multiplayer support, and Web3 integration.

## Features

- 🎮 Play against AI with multiple difficulty levels
- 👥 Local and online multiplayer modes
- 🛒 In-game store with power-ups and customizations
- 🔗 Base blockchain integration via MiniKit
- 📱 Optimized for Farcaster frames

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the environment variables in `.env`:
   - `VITE_CDP_API_KEY`: Your Coinbase Developer Platform API key
   - `VITE_APP_URL`: Your deployed application URL (must be HTTPS)
   - Update other variables as needed

### 3. Get Coinbase Developer Platform API Key

1. Visit [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
2. Create a new project
3. Generate an API key
4. Add the API key to your `.env` file

### 4. Deploy Your App

Deploy to Vercel, Netlify, or your preferred hosting platform:

```bash
npm run build
```

Make sure your deployment URL is HTTPS and update `VITE_APP_URL` in your environment variables.

### 5. Generate Farcaster Manifest

After deployment, generate the account association credentials:

```bash
npx create-onchain --manifest
```

**Important**: Use your Farcaster custody wallet (found in Farcaster Settings → Advanced → Recovery phrase)

This will generate:
- `FARCASTER_HEADER`
- `FARCASTER_PAYLOAD` 
- `FARCASTER_SIGNATURE`

Add these to your deployment environment variables.

### 6. Update Farcaster Manifest

Update `public/.well-known/farcaster.json` with your actual deployment URLs and generated credentials.

### 7. Test Your Mini App

1. Visit `https://yourdomain.com/.well-known/farcaster.json` to verify the manifest
2. Test the app in a browser
3. Share in Farcaster to test frame functionality

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## MiniKit Integration

This app uses the following MiniKit features:

- **Frame Context**: Access to user FID and launch location
- **Frame Ready**: Proper initialization and splash screen handling
- **Base Chain**: Integration with Base blockchain
- **Responsive Design**: Optimized for frame environments

## File Structure

```
src/
├── components/          # Game components
├── hooks/              # Custom React hooks
├── providers/          # MiniKit provider setup
├── types/              # TypeScript definitions
├── utils/              # Game logic and utilities
└── data/               # Game data and configurations

public/
├── .well-known/        # Farcaster manifest
├── icon.svg           # App icon
├── splash.svg         # Splash screen image
├── hero.svg           # Hero image for frames
└── og-image.svg       # Open Graph image
```

## Troubleshooting

### Common Issues

1. **Frame not loading**: Check that all image URLs are HTTPS and accessible
2. **Manifest errors**: Verify `.well-known/farcaster.json` returns valid JSON
3. **Environment variables**: Ensure all required variables are set in deployment
4. **API key issues**: Verify your Coinbase Developer Platform API key is valid

### Debugging

- Check browser console for errors
- Verify network requests in developer tools
- Test manifest endpoint directly
- Validate environment variable configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details