// JavaScript Document


function ShowParagraph(data) {

var para = document.createElement("p");
var node = document.createTextNode(data);
para.appendChild(node);

var element = document.getElementById("empty");
element.appendChild(para);
}



function Go(n) {
	var socket = io();
	socket.emit('ButtonPress' + n);
	return false;
}


function hideshow(id) {
    var x = document.getElementById(id);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

var g = function(i) {

  var x = 100; 
  var y = 100;

  setup = function() {
    i.createCanvas(700, 410);
  };

  draw = function() {
    i.background(0);
    i.fill(255);
    i.rect(x,y,50,50);
  };
};

//function setup() {var myp5 = new p5(g, 'SnakeGame');}