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

Filters.negative = function(context, x, y, width, height) 
{
    var imageData = context.getImageData(x, y, width, height);
    var data = imageData.data;
    for (var i=0; i<data.length; i+=4) 
    {
        var r = data[i];
        var g = data[i+1];
        var b = data[i+2];
        var v = 0.2126*r + 0.7152*g + 0.0722*b;
        data[i] = data[i+1] = data[i+2] = 255 - v;
    }
    context.putImageData(imageData, 0, 0);
};

Filters.convolute = function(kernel, imageData)
{
    var data = imageData.data;
    var result = new Array();
    var getRedPosition = function(i, j, imageData)
    {
        return imageData.data[j * imageData.width * 4 + i*4];
    }
    for(var i = 1; i < imageData.height-1; i++)
    {
        for(var j = 1; j < imageData.width-1; j++)
        {
            var upperRow = getRedPosition(i-1, j-1);
            var middleRow = getRedPosition(i-1, j);
            var middleRow = getRedPosition(i-1, j+1);
            //var r = data[upperRow];
            //var g = ;
            //var b = ;
            //var a = ;
            result[pos] = value;
        }
    }
}