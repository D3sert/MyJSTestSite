var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var os = require('os');
var path = require('path');


var mylib = require('./public/js/MyJS.js');
var Spreadsheet = require('edit-google-spreadsheet');
var convert = require("./libraries/CSVToArray");
var fs = require('fs');
var url = require('url');
var jsonfile = require('jsonfile');

var data;


app.use(express.static(__dirname + '/public'));
//redirect / to our index.html file
app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/public/index.html');
});

//start our web server and socket.io server listening
http.listen(3000, function() {
    console.log('listening on *:3000');
});

/*

*/
var numUsers = 0;

io.on('connection', function(socket) {
    var socketId = socket.id;
    var clientIp = socket.request.connection.remoteAddress;
    var addedUser = false;

    console.log('Connection from: ', clientIp)
    console.log('At Socket: ', socketId)
    if (clientIp !== '::1') {
        fs.appendFile('logs/connection.log', clientIp + " : " + new Date() + os.EOL, function(err) {
            if (err) throw err;
        });
    }

    socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));

    socket.on('new message', function(data) {
        //var msg = (clientIp + ": " + msg); io.emit('chat message', msg);
          socket.broadcast.emit('new message', {
          username: socket.username,
          message: data
  });
    });

    socket.on('add user', function (username) {
  if (addedUser) return;

  // we store the username in the socket session for this client
  socket.username = username;
  ++numUsers;
  addedUser = true;
  socket.emit('login', {
    numUsers: numUsers
  });
  // echo globally (all clients) that a person has connected
  socket.broadcast.emit('user joined', {
    username: socket.username,
    numUsers: numUsers
  });
});

// when the client emits 'typing', we broadcast it to others
socket.on('typing', function () {
  socket.broadcast.emit('typing', {
    username: socket.username
  });
});

// when the client emits 'stop typing', we broadcast it to others
socket.on('stop typing', function () {
  socket.broadcast.emit('stop typing', {
    username: socket.username
  });
});

// when the user disconnects.. perform this
socket.on('disconnect', function () {
  if (addedUser) {
    --numUsers;

    // echo globally that this client has left
    socket.broadcast.emit('user left', {
      username: socket.username,
      numUsers: numUsers
    });
  }
});

    socket.on('ButtonPress1', function() {
        GoogleGet(function(data) {
            console.log('Emitting');
            jsonfile.writeFile('logs/GoogleGet.log', data, function(err) {
                console.error(err);
            });
            //mylib.ArraytoTable(data,'tableloc');
            io.sockets.emit('displayTable', data);
        });
    });



});

function GoogleGet(callback) {
    Spreadsheet.load({
            debug: true,
            oauth2: require("./libraries/cred-loader"),
            spreadsheetId: "1aVmm2roeH_qSq_2PPT16xUEDbP2KtbVrWlLW8XaqJjo",
            worksheetId: "od6"
        },
        function run(err, spreadsheet) {
            if (err) throw err;

            //receive all cells
            spreadsheet.receive({
                getValues: true
            }, function(err, rows, info) {
                if (err) throw err;
                //console.log("Found rows:", rows);
                console.log("With info:", info);
                callback(rows);
            });
        },
    );
}
