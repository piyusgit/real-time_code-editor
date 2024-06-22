const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const ACTIONS = require("./src/Actions");
const connectDB = require("./mongo");
const User = require("./models/User");

const server = http.createServer(app);
const io = new Server(server);

connectDB(); // Connect to MongoDB

const userSocketMap = {};

function addUserToMap(username, socketId) {
  if (!userSocketMap[username]) {
    userSocketMap[username] = [];
  }
  userSocketMap[username].push(socketId);
}

function removeUserFromMap(username, socketId) {
  if (userSocketMap[username]) {
    userSocketMap[username] = userSocketMap[username].filter(
      (id) => id !== socketId
    );
    if (userSocketMap[username].length === 0) {
      delete userSocketMap[username];
    }
  }
}

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: getUsernameFromSocketId(socketId),
      };
    }
  );
}

function getUsernameFromSocketId(socketId) {
  for (const username in userSocketMap) {
    if (userSocketMap[username].includes(socketId)) {
      return username;
    }
  }
  return null;
}

io.on("connection", (socket) => {
  console.log("Socket connected", socket.id);

  socket.on(ACTIONS.JOIN, async ({ roomId, username }) => {
    addUserToMap(username, socket.id);

    // Save user to DB
    const user = new User({ username, socketId: socket.id, roomId });
    await user.save();

    socket.join(roomId);

    const clients = getAllConnectedClients(roomId);
    console.log(clients);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username: getUsernameFromSocketId(socketId),
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on("disconnecting", async () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: getUsernameFromSocketId(socket.id),
      });
    });

    // Remove user from DB
    await User.deleteOne({ socketId: socket.id });

    removeUserFromMap(getUsernameFromSocketId(socket.id), socket.id);
    socket.leave();
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
