let net = require('net')
let streamSet = require('stream-set');

let streams = streamSet();

let server = net.createServer(function (socket){
    console.log('Client connected!');
    streams.forEach(function (otherSocket){
        otherSocket.on('data', function (data){
            socket.write(data);
        });
        socket.on('data', function(data) {
            otherSocket.write(data);
        });
    });
    streams.add(socket);
});

server.listen(9000);