var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var mylib = require('./public/js/main.js');
var Spreadsheet = require('edit-google-spreadsheet');
var convert = require("./libraries/CSVToArray");
var fs = require('fs');
var url = require('url');
var data = 1;
var car = {type:"Fiat", model:"500", color:"white"};


app.use(express.static(__dirname + '/public'));
//redirect / to our index.html file
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/public/index.html');
});

//start our web server and socket.io server listening
http.listen(3000, function(){
  console.log('listening on *:3000');
});


io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
  socket.on('ButtonPress', function() {

//#######################
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
      var data = rows[1][1];
      //console.log("Found rows:", rows);
      console.log("With info:", info);
    });
  },
);
	  //##########################

  });
  socket.emit('Displayme', car);

});
