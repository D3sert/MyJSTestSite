// JavaScript Document



function WhenClicked() {
	"use strict";
	window.alert('hello!');
}



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
