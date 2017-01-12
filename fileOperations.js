function loadFile()
{
    var reader = new FileReader();
    reader.onload = function(event)
    {
        var img = new Image();
        img.onload = function(){
            Application.canvas.width = img.width;
            Application.canvas.height = img.height;
            Application.gc.drawImage(img,0,0);

            Application.imageData = Application.gc.getImageData(0,0,Application.canvas.width, Application.canvas.height);
            Application.data = Application.imageData.data;
        }
        img.src = event.target.result;
    }
    var file = document.getElementById('fileInput').files[0];
    reader.readAsDataURL(file);    
}

function downloadImage()
{
    var link = document.getElementById("downloadLink");
    link.href = Application.canvas.toDataURL("image/png");
    link.download = Application.fileName;
}