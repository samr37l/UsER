var port = 8888;
console.log(port);
var io = require('./libs/node_modules/socket.io').listen(8080);

var MailListener = require('./libs/node_modules/mail-listener2');

var mailListener = new MailListener({
    username: "samr37l@gmail.com",
    password: "34F0re12",
    host: "imap.gmail.com",
    port: 993, // imap port
    mailbox: "INBOX",
    markSeen: true,
    fetchUnreadOnStart: false
});

mailListener.start();

mailListener.on("server:connected", function() {
    console.log("imapConnected");
});

mailListener.on("server:disconnected", function() {
    console.log("imapDisconnected");
});

mailListener.on("error", function(err) {
    console.log(err);
});

var connected = false;
var clients = [];


io.sockets.on('connection', function (socket) {
  //socket.broadcast.send("You are being kicked off", function() { io.sockets.socket(clients[0]).disconnect(); });   <- can be used to kick off other clients, haven't really gotten to work but moving on
  clients[0] = socket.id;   //this sets the newest client to receive messages. Should use clients.push(socket) in the future
  socket.emit('message', "You're ID is: " + socket.id);
  connected = true;
});


mailListener.on('mail', function(mail) {
        console.log(mail.from[0].name);
        if(connected) {
            io.sockets.socket(clients[0]).emit('new-mail', mail);
            console.log("sent to:" + clients[0]);
        }
});