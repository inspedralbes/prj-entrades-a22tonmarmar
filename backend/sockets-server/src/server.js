require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// Endpoint per rebre notificacions del backend Laravel i emetre a la room de l'event
app.post('/events/:id/room-updated', (req, res) => {
  const eventId = req.params.id;
  const payload = req.body;

  console.log('[HTTP] /events/%s/room-updated payload:', eventId, JSON.stringify(payload));

   console.log('[FLOW][sockets] Emitting room_updated', {
    eventId,
    hasRoom: !!(payload && payload.room),
  });

  // Emetem a la room especifica de l'event
  io.to(`event:${eventId}`).emit('room_updated', payload);

  res.status(204).send();
});

//Sockets
io.on('connection', (socket) => {
  console.log('[WS] Client conectat:', socket.id);

  socket.on('join_event', ({ eventId }) => {
    if (!eventId) return;
    console.log('[WS] Socket %s joining room event:%s', socket.id, eventId);
    socket.join(`event:${eventId}`);
  });

  socket.on('leave_event', ({ eventId }) => {
    if (!eventId) return;
    console.log('[WS] Socket %s leaving room event:%s', socket.id, eventId);
    socket.leave(`event:${eventId}`);
  });

  // Canals globals
  console.log('[WS] Socket %s joining global room', socket.id);
  socket.join('global');

  socket.on('disconnect', (reason) => {
    console.log('[WS] Client disconnected:', socket.id, 'reason:', reason);
  });
});

server.listen(PORT, () => {
  console.log(`Sockets server listening on port ${PORT}`);
});
