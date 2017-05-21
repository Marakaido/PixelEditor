Filters = {};
Filters.getPixels = function(img) 
{
    return gc.getImageData(0,0,canvas.width,canvas.height);
};

Filters.grayscale = {
    action: function(context, x, y, width, height) 
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
    }
};

Filters.negative = {
    action: function(context, x, y, width, height) 
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
    }
};

Filters.logarithm = {
    inputId: "logarithmInput",
    action: function(context, x, y, width, height) 
    {
        var imageData = context.getImageData(x, y, width, height);
        var data = imageData.data;
        var maxIntensities = computeMaxIntesities(data);
        var c = document.getElementById("logarithmCoeficientInput").value;
        var cr = Math.floor(255 / Math.log(1 + maxIntensities[0]));
        var cg = Math.floor(255 / Math.log(1 + maxIntensities[1]));
        var cb = Math.floor(255 / Math.log(1 + maxIntensities[2]));
        for (var i=0; i<data.length; i+=4) 
        {
            var r = data[i];
            var g = data[i+1];
            var b = data[i+2];
            data[i] = c * Math.floor(cr * Math.log(1 + r));
            data[i+1] = c * Math.floor(cg * Math.log(1 + g));
            data[i+2] = c * Math.floor(cb * Math.log(1 + b));
        }
        context.putImageData(imageData, 0, 0);
    }
};

Filters.gamma = {
    inputId: "gammaInput",
    action: function(context, x, y, width, height) 
    {
        var imageData = context.getImageData(x, y, width, height);
        var data = imageData.data;
        var maxIntensities = computeMaxIntesities(data);
        var e = document.getElementById("gammaCoeficientInput").value;
        var cr = Math.floor(255 / Math.pow(maxIntensities[0], e));
        var cg = Math.floor(255 / Math.pow(maxIntensities[1], e));
        var cb = Math.floor(255 / Math.pow(maxIntensities[2], e));
        for (var i=0; i<data.length; i+=4) 
        {
            var r = data[i];
            var g = data[i+1];
            var b = data[i+2];
            data[i] = Math.floor(cr * Math.pow(data[i], e));
            data[i+1] = Math.floor(cg * Math.pow(data[i+1], e));
            data[i+2] = Math.floor(cb * Math.pow(data[i+2], e));
        }
        context.putImageData(imageData, 0, 0);
    }
};

function computeMaxIntesities(data)
{
    var result = [0, 0, 0];
    for (var i=0; i<data.length; i+=4) 
    {
        if(data[i] > result[0]) result[0] = data[i];
        if(data[i+1] > result[1]) result[1] = data[i+1];
        if(data[i+2] > result[2]) result[2] = data[i+2];
    }
    return result;
}

Filters.histogramEqualization = {
    action: function(context, x, y, width, height) 
    {
        var imageData = context.getImageData(x, y, width, height);
        var data = imageData.data;
        var histograms = computeHistograms(data, width, height);
        var pdfs = computePDFValues(histograms, width, height);
        applyPDFs(pdfs, data);
        context.putImageData(imageData, 0, 0);
    }
};

Filters.histogramSpecification = {
    inputId: "histogramSpecificationInput",
    targetImageData: null,
    action: function(context, x, y, width, height) 
    {
        var imageData = context.getImageData(x, y, width, height);
        var data = imageData.data;
        var histograms = computeHistograms(data, width, height);
        var targetHistograms = computeHistograms(this.targetImageData.data, this.targetImageData.width, this.targetImageData.height);
        
        //Perform equalization
        var s_pdfs = computePDFValues(histograms, width, height);

        //Compute all G values
        var z_pdfs = computePDFValues(targetHistograms, width, height);
        
        //Compute resulting values
        for(var i = 0; i < 3; i++)
        {
            for(var j = 0; j < 256; j++)
            {
                histograms[i][j] = findIndexOfNearestValue(s_pdfs[i][j], z_pdfs[i]);
            }
        }

        applyPDFs(histograms, data);
        context.putImageData(imageData, 0, 0);
    }
};

/*
Returns arrays, containing number of pixels of intensity for i at i-th index.
First array - histogram for red color
Second array - histogram for green color
Third array - histogram for blue color
*/
function computeHistograms(data, width, height)
{
    var result = [
        Array.apply(null, Array(256)).map(Number.prototype.valueOf,0), 
        Array.apply(null, Array(256)).map(Number.prototype.valueOf,0), 
        Array.apply(null, Array(256)).map(Number.prototype.valueOf,0)
    ];
    for (var i=0; i<data.length; i+=4) 
    {
        result[0][data[i]] += 1;
        result[1][data[i+1]] += 1;
        result[2][data[i+2]] += 1;
    }
    return result;
}

/*
Returns values of PDF function based on histograms specified
Parameter histograms - a 2D array containing 3 histograms for red, green and blue colors respectively
Parameters width, height - width and height of the image
*/
function computePDFValues(histograms, width, height)
{
    var result = [
        Array.apply(null, Array(256)).map(Number.prototype.valueOf,0), 
        Array.apply(null, Array(256)).map(Number.prototype.valueOf,0), 
        Array.apply(null, Array(256)).map(Number.prototype.valueOf,0)
    ];
    for (var i = 0; i<3; i++) 
    {
        var sum = 0;
        for(var j = 0; j < 256; j++)
        {
            sum += histograms[i][j];
            result[i][j] = Math.round((254/(width*height)) * sum);
        }
    }
    return result;
}

/*
Sets intensities of pixels in data according to the histograms
*/
function applyPDFs(histograms, data)
{
    for(var i=0; i < data.length; i+=4)
    {
        data[i] = histograms[0][data[i]];
        data[i+1] = histograms[1][data[i+1]];
        data[i+2] = histograms[2][data[i+2]];
    }
}

function findIndexOfNearestValue(value, Gvalues)
{
    var result = 0;
    var diff = Math.abs(value - Gvalues[0]);
    for(var i = 1; i < 256; i++)
    {
        var newDiff = Math.abs(value - Gvalues[i]);
        if(newDiff < diff)
        {
            result = i;
            diff = newDiff;
            if(newDiff == 0) return result;
        }
    }
    return result;
}

//Updates imageData object to contain convoluted result of its previous content with kernel matrix
//kernel - one-dimensional array representing 3x3 matrix
Filters.convolute = function(imageData, kernel)
{
    var data = imageData.data;
    var result = new Array(imageData.width*imageData.height);
    for(var i = 1; i < imageData.height-1; i++)
    {
        for(var j = 1; j < imageData.width-1; j++)
        {
            var r = 0; var g = 0; var b = 0;
            for(var k = 0; k < 3; k++)
            {
                for(var l = 0; l < 3; l++)
                {
                    var dataRedPosition = ((i-1 + k) * imageData.width + j-1 + l) * 4;
                    var kernelMultiplier = kernel[k*3 + l];
                    r += kernelMultiplier * data[dataRedPosition];
                    g += kernelMultiplier * data[dataRedPosition + 1];
                    b += kernelMultiplier * data[dataRedPosition + 2];
                }
            }

            var resultRedPosition = (i * imageData.width + j) * 4;
            result[resultRedPosition] = r;
            result[resultRedPosition + 1] = g;
            result[resultRedPosition + 2] = b;
            result[resultRedPosition + 3] = 255;
        }
    }

    for(var i = 1; i < imageData.height-1; i++)
    {
        for(var j = 1; j < imageData.width-1; j++)
        {
            var index = (i * imageData.width + j) * 4;
            data[index] = result[index];
            data[index+1] = result[index+1];
            data[index+2] = result[index+2];
            data[index+3] = result[index+3];
        }
    }
};

Filters.blur = {
    inputId: "blurInput",
    action: function(context, x, y, width, height) 
    {
        var imageData = context.getImageData(x, y, width, height);
        var intensity = document.getElementById("blurIntensityInput").value;
        for(var i = 0; i < intensity; i++) Filters.convolute(imageData, [1/9, 1/9, 1/9,
                                                                1/9, 1/9, 1/9,
                                                                1/9, 1/9, 1/9]);
        context.putImageData(imageData, 0, 0);                                  
    }
};

Filters.sharpen = {
    inputId: "sharpenInput",
    action: function(context, x, y, width, height) 
    {
        var imageData = context.getImageData(x, y, width, height);
        var intensity = document.getElementById("sharpenIntensityInput").value;
        for(var i = 0; i < intensity; i++) Filters.convolute(imageData, [0, -1, 0,
                                                                -1, 5, -1,
                                                                0, -1, 0]);
        context.putImageData(imageData, 0, 0);                                  
    }
};

Filters.bitplaneSlicing = {
    inputId: "bitplaneSlicingInput",
    action: function(context, x, y, width, height) 
    {
        var imageData = context.getImageData(x, y, width, height);
        var data = imageData.data;
        var mask = document.getElementById("bitplaneSlicingMaskInput").value;
        for (var i=0; i<data.length; i+=4) 
        {
            data[i] &= mask;
            data[i+1] &= mask;
            data[i+2] &= mask;
        }
        context.putImageData(imageData, 0, 0);
    }
};

Filters.linearFunction = {
    inputId: "linearFunctionInput",
    action: function(context, x, y, width, height) 
    {
        var imageData = context.getImageData(x, y, width, height);
        var data = imageData.data;
        var f = parseLinearFunction(document.getElementById("linearFunctionFunctionInput").value);
        for (var i=0; i<data.length; i+=4) 
        {
            data[i] = f.apply(data[i]);
            data[i+1] = f.apply(data[i+1]);
            data[i+2] = f.apply(data[i+2]);
        }
        context.putImageData(imageData, 0, 0);
    }
};

function parseLinearFunction(str)
{
    return {
        ranges: parseRanges(str),
        apply: function(x)
        {
            for(var i = 0; i < this.ranges.length; i++)
            {
                if(this.ranges[i].start <= x && x <= this.ranges[i].end) 
                    return this.ranges[i].value;
            }
        }
    };
}

function parseRanges(str)
{
    var ranges = str.split(",");
    for(var i = 0; i < ranges.length; i++)
    {
        ranges[i] = parseRangeWithValue(ranges[i].trim());
    }
    return ranges;
}

function parseRangeWithValue(rangeWithValue)
{
    var range = rangeWithValue.split("=")[0].trim();
    var result = {
        start: 0,
        end: 0,
        value: rangeWithValue.split("=")[1].trim() * 1
    };
    var points = range.split(";");
    points[0] = points[0].trim();
    points[1] = points[1].trim();
    result.start = points[0].substring(1, points[0].length).trim() * 1;
    result.end = points[1].substring(0, points[1].length-1).trim() * 1;
    if(points[0][0] == "(") result.start += 0.5;
    if(points[1][points[1].length-1] == ")") result.end -= 0.5;
    return result;
}