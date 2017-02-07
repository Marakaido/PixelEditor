//message must be an object with fields filter, data, width and height
onmessage = function(message) {
    var time = new Date().getTime();
    var result = sharpen(message.data.data, message.data.width, message.data.height);
    postMessage({data: result, width: message.data.width, height: message.data.height, time: new Date().getTime()-time});
}

function convolute(imageData, kernel)
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
    return data;
}

function sharpen(data, width, height) 
{
    return convolute({data: data, width: width, height: height}, [0, -1, 0,
                                                                            -1, 5, -1,
                                                                            0, -1, 0]);                                
};