var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var mylib = require('./public/js/main.js');
var Spreadsheet = require('edit-google-spreadsheet');
var convert = require("./libraries/CSVToArray");
var fs = require('fs');
var url = require('url');
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
        var data = rows;
        callback(data);
      });
    },
  );
  return data;
}

function GoogleGetAsync() {
  //const Spreadsheet = require("../");
  //const creds = require("./cred-loader");

  (async () => {
    try {
      let spreadsheet = await Spreadsheet.load({
        debug: true,
        oauth2: require("./libraries/cred-loader"),
        spreadsheetId: "1aVmm2roeH_qSq_2PPT16xUEDbP2KtbVrWlLW8XaqJjo",
        worksheetId: "od6"
      });
      //receive all cells
      let [rows, info] = await spreadsheet.receive({
        getValues: false
      }, function(err, rows, info) {

      });
      console.log("Found rows:", rows);
      console.log("With info:", info);
    } catch (err) {
      console.error("EROR", err);
    }
  })();
}


io.on('connection', function(socket) {
  socket.on('chat message', function(msg) {
    console.log('message: ' + msg);
  });
  socket.on('ButtonPress1', function() {

    //##########################
      console.log('hi');
      GoogleGet(function(data) {
        var string = JSON.stringify(data);
        console.log('Emitting');
        io.sockets.emit('Displayme', string);
      });
      //console.log('Data:', data);

    //##########################

  });
  socket.on('ButtonPress2', function() {
    var data = data.toString();
    console.log('Button2Pressed');
    io.sockets.emit('Displayme', data);
  });

});
