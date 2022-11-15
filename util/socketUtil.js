const io = require("socket.io")(8000, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:3001']
    }
  });
  
  
module.exports = io
