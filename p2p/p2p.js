let topology = require('fully-connected-topology');
let jsonStream = require('duplex-json-stream');
let streamSet = require('stream-set');
// let register = require('register-multicast-dns');
// let toPort = require('hash-to-port');
let wrtcSwarm = require('webrtc-swarm');
let signalHub = require('signalhub');


var hub = signalHub('test-app-demo',[
        'localhost:10000' 
]);

//let swarm = topology(toAddres(me), peers.map(toAddres));
var swarm = wrtcSwarm(hub);
let streams = streamSet();
let id = Math.random();
let seq = 0;
let logs = {};

// register(me);

swarm.on('peer', function(socket) {
    console.log('[a friend joined]');
    socket = jsonStream(socket);
    streams.add(socket);
    socket.on('data', function(data) {
        if(logs[data.log] <= data.seq) {
            console.log("not sended");
            return;
        }

        logs[data.log] = data.seq;

        console.log(data.username + '> ' + data.message);

        streams.forEach(function (otherSocket){
            otherSocket.write(data);
        });
    });
});

window.chat = function (message){
    let next = seq++;

    streams.forEach(function(socket) {
        socket.write({
            log: id,
            seq: next,
            username: window.username,
            message: message
        })
    });
}

// function toAddres(name) {
//     return name + '.local:' + toPort(name);
// }