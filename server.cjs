const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const server = createServer(app);

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Coinbase Commerce charge creation endpoint
app.post('/api/createCharge', async (req, res) => {
  try {
    const { amount, currency = 'USDC', itemName, itemId } = req.body;
    
    if (!amount || !itemName || !itemId) {
      return res.status(400).json({ 
        error: 'Missing required fields: amount, itemName, itemId' 
      });
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CC-Api-Key': process.env.COINBASE_COMMERCE_API_KEY || 'your_api_key_here'
      },
      body: JSON.stringify({
        local_price: { 
          amount: amount.toString(), 
          currency: currency 
        },
        pricing_type: 'fixed_price',
        name: itemName,
        description: `Purchase of ${itemName} from Checkers Store`,
        metadata: { 
          itemId: itemId,
          itemName: itemName,
          source: 'checkers_game_store'
        }
      })
    };

    const response = await fetch('https://api.commerce.coinbase.com/charges', options);
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Coinbase Commerce API Error:', data);
      return res.status(response.status).json({ 
        error: 'Failed to create charge',
        details: data 
      });
    }

    res.json(data);
  } catch (error) {
    console.error('Error creating charge:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
  },
  path: '/api/socket'
});

// In-memory storage for rooms
const rooms = new Map();

// Clean up old rooms every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [roomId, room] of rooms.entries()) {
    if (now - room.lastActivity > 30 * 60 * 1000) {
      rooms.delete(roomId);
      console.log(`Cleaned up inactive room: ${roomId}`);
    }
  }
}, 30 * 60 * 1000);

function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function updateRoomActivity(roomId) {
  const room = rooms.get(roomId);
  if (room) {
    room.lastActivity = Date.now();
  }
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create_room', (callback) => {
    const roomId = generateRoomId();
    const room = {
      id: roomId,
      players: [{
        id: socket.id,
        playerNumber: 1
      }],
      gameState: null,
      lastActivity: Date.now()
    };
    
    rooms.set(roomId, room);
    socket.join(roomId);
    
    console.log(`Room created: ${roomId} by ${socket.id}`);
    
    callback({
      success: true,
      roomId,
      playerId: socket.id,
      playerNumber: 1
    });
  });

  socket.on('join_room', ({ roomId }, callback) => {
    const room = rooms.get(roomId);
    
    if (!room) {
      callback({ success: false, error: 'Room not found' });
      return;
    }
    
    if (room.players.length >= 2) {
      callback({ success: false, error: 'Room is full' });
      return;
    }
    
    const playerNumber = room.players.length + 1;
    room.players.push({
      id: socket.id,
      playerNumber
    });
    
    updateRoomActivity(roomId);
    socket.join(roomId);
    
    console.log(`Player ${socket.id} joined room ${roomId} as player ${playerNumber}`);
    
    // Notify other players
    socket.to(roomId).emit('player_joined', {
      playerId: socket.id,
      playerNumber,
      playerCount: room.players.length
    });
    
    callback({
      success: true,
      roomId,
      playerId: socket.id,
      playerNumber
    });
    
    // Start game if room is full
    if (room.players.length === 2) {
      io.to(roomId).emit('game_start', {
        players: room.players,
        gameState: room.gameState
      });
    }
  });

  socket.on('send_move', ({ roomId, move, gameState }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    
    updateRoomActivity(roomId);
    room.gameState = gameState;
    
    socket.to(roomId).emit('move_received', {
      move,
      gameState,
      playerId: socket.id
    });
    
    console.log(`Move sent in room ${roomId}:`, move);
  });

  socket.on('sync_game_state', ({ roomId, gameState }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    
    updateRoomActivity(roomId);
    room.gameState = gameState;
    
    socket.to(roomId).emit('game_state_synced', {
      gameState,
      playerId: socket.id
    });
  });

  // Voice chat signaling
  socket.on('voice_offer', ({ roomId, offer }) => {
    socket.to(roomId).emit('voice_offer', { offer, playerId: socket.id });
  });

  socket.on('voice_answer', ({ roomId, answer }) => {
    socket.to(roomId).emit('voice_answer', { answer, playerId: socket.id });
  });

  socket.on('voice_ice_candidate', ({ roomId, candidate }) => {
    socket.to(roomId).emit('voice_ice_candidate', { candidate, playerId: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove player from all rooms
    for (const [roomId, room] of rooms.entries()) {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        const player = room.players[playerIndex];
        room.players.splice(playerIndex, 1);
        
        // Notify other players
        socket.to(roomId).emit('player_left', {
          playerId: socket.id,
          playerNumber: player.playerNumber,
          playerCount: room.players.length
        });
        
        // Remove room if empty
        if (room.players.length === 0) {
          rooms.delete(roomId);
          console.log(`Room ${roomId} deleted - no players remaining`);
        }
        
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
  console.log(`Socket.IO path: /api/socket`);
});