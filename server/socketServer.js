let users = [];

const socketServer = (socket) => {
  socket.on('joinUser', (user) => {
    console.log('connected');
    users.push({ id: user._id, socketId: socket.id });
  });

  socket.on('disconnect', () => {
    users = users.filter((user) => user.socketId !== socket.id);
  });

  socket.on('sendBroadcast', (data) => {
    users.forEach((client) => {
      if (client.id === data.to) {
        // to individual socketid (private message) io.to(socketId).emit(/* ... */);
        socket.to(`${client.socketId}`).emit('sendBroadcastToClient', data);
      }
    });
  });

  socket.on('createQuiz', (data) => {
    users.forEach((client) => {
      if (client.id === data.to) {
        // to individual socketid (private message) io.to(socketId).emit(/* ... */);
        socket.to(`${client.socketId}`).emit('createQuizToClient', data);
      }
    });
  });

  socket.on('submitQuiz', (data) => {
    users.forEach((client) => {
      if (client.id === data.to) {
        // to individual socketid (private message) io.to(socketId).emit(/* ... */);
        socket.to(`${client.socketId}`).emit('submitQuizToClient', data);
      }
    });
  });

  socket.on('addSubmission', (data) => {
    users.forEach((client) => {
      if (client.id === data.to) {
        // to individual socketid (private message) io.to(socketId).emit(/* ... */);
        socket.to(`${client.socketId}`).emit('addSubmissionToClient', data);
      }
    });
  });
};

module.exports = socketServer;
