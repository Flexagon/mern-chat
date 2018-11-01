module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('new message', (conversation) => {
      io.emit('refresh messages', conversation);
    });

    socket.on('disconnect', () => console.log('user disconnected'));
  });
};
