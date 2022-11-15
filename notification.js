const io = require("./util/socketUtil");

const initServerAndSocket = () => {
    io.on("connection", (socket) => {
        console.log('someone has connected')
        io.emit('test', 'hellow socket')
    });
} 

module.exports = initServerAndSocket
