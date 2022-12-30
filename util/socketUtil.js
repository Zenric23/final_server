const io = require("socket.io")(process.env.SOCKET_PORT || 8000, {
    cors: {
        origin: ['https://kingcanis.netlify.app', 'https://dashboard.kingcanis.com']
    }
  });
  
  
module.exports = io
