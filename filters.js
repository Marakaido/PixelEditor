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

//Updates imageData object to contain convoluted result of its previous content with kernel matrix
//kernel - one-dimensional array representing 3x3 matrix
Filters.convolute = function(imageData, kernel)
{
    var data = imageData.data;
    var result = new Array();
    for(var i = 1; i < imageData.height-1; i++)
    {
        for(var j = 1; j < imageData.width-1; j++)
        {
            var r = g = b = a = 0;
            for(var k = 0; k < 3; k++)
            {
                for(var l = 0; l < 3; l++)
                {
                    var dataRedPosition = ((i-1 + k) * imageData.width + j-1 + l) * 4;
                    var kernelMultiplier = kernel[k*3 + l];
                    r += kernelMultiplier * data[dataRedPosition];
                    g += kernelMultiplier * data[dataRedPosition + 1];
                    b += kernelMultiplier * data[dataRedPosition + 2];
                    a += kernelMultiplier * data[dataRedPosition + 3];
                }
            }

            var resultRedPosition = (i * imageData.width + j) * 4;
            result[resultRedPosition] = r;
            result[resultRedPosition + 1] = g;
            result[resultRedPosition + 2] = b;
            result[resultRedPosition + 3] = a;
        }
    }

    for(var i = 0; i < data.length; i++)
    {
        data[i] = result[i];
    }
}

Filters.blur = function(context, x, y, width, height) 
{
    var imageData = context.getImageData(x, y, width, height);
    for(var i = 0; i < 1; i++) Filters.convolute(imageData, [1/9, 1/9, 1/9,
                                                            1/9, 1/9, 1/9,
                                                            1/9, 1/9, 1/9]);
    context.putImageData(imageData, 0, 0);                                  
};

Filters.sharpen = function(context, x, y, width, height) 
{
    var imageData = context.getImageData(x, y, width, height);
    for(var i = 0; i < 1; i++) Filters.convolute(imageData, [0, -1, 0,
                                                            -1, 5, -1,
                                                            0, -1, 0]);
    context.putImageData(imageData, 0, 0);                                  
};