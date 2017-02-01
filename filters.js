Filters = {};
Filters.getPixels = function(img) 
{
    return gc.getImageData(0,0,canvas.width,canvas.height);
};

Filters.grayscale = function(context, x, y, width, height) 
{
    var imageData = context.getImageData(x, y, width, height);
    var data = imageData.data;
    for (var i=0; i<data.length; i+=4) 
    {
        var r = data[i];
        var g = data[i+1];
        var b = data[i+2];
        var v = 0.2126*r + 0.7152*g + 0.0722*b;
        data[i] = data[i+1] = data[i+2] = v
    }
    context.putImageData(imageData, 0, 0);
};