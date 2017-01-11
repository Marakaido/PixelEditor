var canvas;
// Graphics context
var gc;
var imageData;
var data;

var fileName = "test.png";

window.onload = function()
{
    alert("Setting up");
    canvas = document.getElementById("mainCanvas");
    gc = canvas.getContext('2d');
    gc.imageSmoothingEnabled = false;

    imageData = gc.getImageData(0,0,canvas.width, canvas.height);
    data = imageData.data;

    loadFile();
}