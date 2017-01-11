function loadFile()
{
    var reader = new FileReader();
    reader.onload = function(event)
    {
        var img = new Image();
        img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;
            gc.drawImage(img,0,0);

            imageData = gc.getImageData(0,0,canvas.width, canvas.height);
            data = imageData.data;
        }
        img.src = event.target.result;
    }
    var file = document.getElementById('fileInput').files[0];
    reader.readAsDataURL(file);    
}

function downloadImage()
{
    var link = document.getElementById("downloadLink");
    link.href = canvas.toDataURL("image/png");
    link.download = fileName;
}