# Development Setup for Multiplayer Functionality

This guide explains how to run the MiniKit Checkers game with full multiplayer support in your local development environment.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git
- Coinbase Commerce account (for crypto payments)

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file and add your Coinbase Commerce API key:
   ```
   COINBASE_COMMERCE_API_KEY=your_actual_api_key_here
   ```
   
   To get a Coinbase Commerce API key:
   - Sign up at [Coinbase Commerce](https://commerce.coinbase.com/)
   - Go to Settings → Security
   - Create a new API Key
   - Copy the API key to your `.env` file

## Running the Development Environment

### Option 1: Run Both Servers Simultaneously (Recommended)

```bash
npm run dev:full
```

This command starts both:
- Socket.IO server on port 3001
- Vite development server on port 5174

### Option 2: Run Servers Separately

In two separate terminals:

**Terminal 1 - Socket.IO Server:**
```bash
npm run dev:server
```

**Terminal 2 - Vite Dev Server:**
```bash
npm run dev
```

## Accessing the Application

- **Frontend:** http://localhost:5174
- **Socket.IO Server:** http://localhost:3001

## Testing Multiplayer Functionality

1. Open the application in two browser windows/tabs
2. In the first window:
   - Click "Create Multiplayer Game"
   - Note the room code displayed
3. In the second window:
   - Click "Join Multiplayer Game"
   - Enter the room code from step 2
   - Click "Join Game"
4. Both players should now be connected and able to play against each other

## Testing the Crypto Checkout Functionality

1. **Open the game** at `http://localhost:5174`
2. **Access the store**:
   - Click "Store" from the main menu
   - Browse through different categories (Boards, Pieces, Abilities)
3. **Test crypto payment**:
   - Find an item you want to purchase
   - Click the "Crypto" button (blue button with credit card icon)
   - The crypto checkout modal will open
   - Click "Pay with Coinbase" to initiate the payment flow
   - Follow the Coinbase Commerce payment process
4. **Verify purchase**:
   - After successful payment, the item should be automatically unlocked
   - Check that the item appears in your inventory
   - Verify auto-equipping works for first items of each type

## Features Available in Development

- ✅ Real-time multiplayer gameplay
- ✅ Room creation and joining
- ✅ WebRTC voice chat
- ✅ Game state synchronization
- ✅ Player connection management
- ✅ Auto-reconnection on disconnect
- ✅ Crypto payments via Coinbase Commerce
- ✅ OnchainKit integration for Web3 payments

## Troubleshooting

### Connection Issues

If you see WebSocket connection errors:

1. Ensure both servers are running
2. Check that ports 3001 and 5174 are not blocked
3. Verify the Socket.IO server is accessible at http://localhost:3001

### Port Conflicts

If port 3001 or 5174 is already in use:

1. **For Socket.IO server:** Edit `server.js` and change the PORT variable
2. **For Vite server:** It will automatically use the next available port
3. Update the socket URL in `src/hooks/useMultiplayer.ts` if you change the Socket.IO port

### Voice Chat Issues

- Ensure microphone permissions are granted in your browser
- Voice chat uses WebRTC and may require HTTPS in some browsers (use localhost for development)

### Crypto Payment Issues

- **Charge creation failed:** Verify your Coinbase Commerce API key is correct
- **Payment not processing:** Check the browser console for error messages
- **API key errors:** Ensure the API key is set in your `.env` file
- **CORS issues:** Make sure the backend server is running on port 3001

## Development vs Production

- **Development:** Uses local Socket.IO server on port 3001
- **Production:** Uses Vercel serverless functions (see DEPLOYMENT.md)

The application automatically detects the environment and connects to the appropriate server.