let net = require('net');
let jsonStream = require('duplex-json-stream');

let username = process.argv[2];

let socket = jsonStream(net.connect(9000, 'localhost'));

socket.on('data', function(data){
    process.stdout.write(data.username + '> ' + data.message + '\n');
});

process.stdin.on('data', function(data){
    socket.write({
        username: username,
        message: data.toString().trim()
    });
});