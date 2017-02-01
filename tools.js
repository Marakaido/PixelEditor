function getPixelCoordinates(x, y)
{
    return {
        x: Math.floor((x - Application.canvasHolder.offsetLeft) * Application.zoom.x),
        y: Math.floor((y - Application.canvasHolder.offsetTop) * Application.zoom.y)
    };
}

function brushStroke()
{
    Application.canvasHolder.onmousedown = function(event)
    {
        var point = getPixelCoordinates(event.clientX, event.clientY);
        Application.gc.beginPath();
        Application.gc.arc(point.x, point.y, Application.values.lineWidth/2, 0, 2*Math.PI);
        Application.gc.fill();
        Application.gc.beginPath();
        Application.gc.moveTo(point.x, point.y);
        Application.canvasHolder.onmousemove = function(event)
        {
            var coords = getPixelCoordinates(event.clientX, event.clientY);
            Application.gc.lineTo(coords.x, coords.y);
            Application.gc.stroke();
        }
        Application.canvasHolder.onmouseup = function(event)
        {
            Application.gc.closePath();
            Application.canvasHolder.onmousemove = null;
        }
    }
}

var Pencil = {
    icon: "pencil.png",

    activate: function()
    {
        this.configureContext();
        brushStroke();
    },

    deactivate: function()
    {
        Application.canvasHolder.onmousedown = null;
    },

    configureContext: function()
    {
        Application.gc.lineJoin = 'round';
        Application.gc.lineCap = 'round';
        Application.gc.lineWidth = Application.values.lineWidth;
        Application.gc.strokeStyle = Application.values.color;
    }
};

var Eraser = {
    icon: "Erase-50.png",

    activate: function()
    {
        this.configureContext();
        brushStroke();
    },

    deactivate: function()
    {
        Application.gc.globalCompositeOperation = 'source-over';
        Application.canvasHolder.onmousedown = null;
    },

    configureContext: function()
    {
        Application.gc.globalCompositeOperation = 'destination-out';
        Application.gc.lineJoin = 'round';
        Application.gc.lineCap = 'round';
        Application.gc.lineWidth = Application.values.lineWidth;
    }
};

var ColorPicker = {
    icon: "Color_picker.png",

    activate: function()
    {
        Application.canvasHolder.onclick = function(event)
        {
            var point = getPixelCoordinates(event.clientX, event.clientY);
            var data = Application.data;
            var pos = point.x * Application.canvas.width * 4 + point.y;
            Application.values.color = 'rgba('+data[pos]+', '+data[pos+1]+', '+data[pos+2]+', '+data[pos+3]+')';
        }
    },
    deactivate: function(){},
};

var Hand = {
    icon: "Hand.png",
    correctionValues: {x: 0, y: 0},

    activate: function()
    {
        Application.canvasHolder.onmousedown = function(event)
        {
            Hand.correctionValues = {x: event.pageX - Application.canvas.offsetLeft, y: event.pageY - Application.canvas.offsetTop};
            window.onmouseup = function()
            {
                window.onmousemove = null;
                window.onmouseup = null;
            }

            window.onmousemove = function(event)
            {
                Application.canvas.style.top = event.pageY - Hand.correctionValues.y + 'px';
                Application.canvas.style.left = event.pageX - Hand.correctionValues.x + 'px';
            }
        }
    },
    deactivate: function()
    {
        Application.canvasHolder.onmousedown = null;
    },
};

var Zoom = {
    icon: "Search.png",
    modifier: 0.1,
    
    activate: function()
    {
        Application.canvasHolder.onclick = function(event)
        {
            Zoom.zoom(event.clientX, event.clientY, Zoom.modifier);
        }
        Application.canvasHolder.oncontextmenu = function(event)
        {
            event.preventDefault();
            event.stopPropagation();
            Zoom.zoom(event.clientX, event.clientY, -Zoom.modifier);
        }
    },

    deactivate: function()
    {
        Application.canvasHolder.onclick = null;
        Application.canvasHolder.oncontextmenu = null;
    },

    zoom: function(x, y, modifier)
    {
        var width = Application.canvasHolder.offsetWidth;
        var height = Application.canvasHolder.offsetHeight;
        var left = Application.canvasHolder.offsetLeft;
        var top = Application.canvasHolder.offsetTop;
        Application.canvasHolder.style.width = width + width * modifier + 'px';
        Application.canvasHolder.style.height = height + height * modifier + 'px';
        Application.canvasHolder.style.left = left - x * modifier + 'px';
        Application.canvasHolder.style.top = top - y * modifier + 'px';
        Application.calculateZoom();
    }
};

var PaintBucket = {
    icon: "PaintBucket.png",
    
    activate: function()
    {
        Application.canvasHolder.onclick = function(event)
        {
            var imageData = Application.getFullImageData();
            var point = getPixelCoordinates(event.clientX, event.clientY);
            var targetPixel = imageData.getPixel(point.x, point.y);
            var color = {red: 255, green: 255, blue: 255, alpha: 255};
            var points = [point];
            while(points.length != 0)
            {
                point = points.pop();
                var topPixel = imageData.getPixel(point.x, point.y-1);
                var bottomPixel = imageData.getPixel(point.x, point.y+1);
                var leftPixel = imageData.getPixel(point.x-1, point.y);
                var rightPixel = imageData.getPixel(point.x+1, point.y);
                if(topPixel && topPixel.equals(targetPixel))
                {
                    imageData.setPixel(point.x, point.y-1, color);
                    points.push({x: point.x, y: point.y-1});
                }
                if(bottomPixel && bottomPixel.equals(targetPixel))
                {
                    imageData.setPixel(point.x, point.y+1, color);
                    points.push({x: point.x, y: point.y+1});
                }
                if(leftPixel && leftPixel.equals(targetPixel))
                {
                    imageData.setPixel(point.x-1, point.y, color);
                    points.push({x: point.x-1, y: point.y});
                }
                if(rightPixel && rightPixel.equals(targetPixel))
                {
                    imageData.setPixel(point.x+1, point.y, color);
                    points.push({x: point.x+1, y: point.y});
                }
            }
            Application.gc.putImageData(imageData.imageData, 0, 0);
        }
    },

    deactivate: function()
    {
        Application.canvasHolder.onclick = null;
    },
};

var BrushSelection = {
    icon: "pencil.png",

    activate: function()
    {
        this.configureContext();
        Application.canvasHolder.onmousedown = function(event)
        {
            var point = getPixelCoordinates(event.clientX, event.clientY);
            Application.ui.gc.beginPath();
            Application.ui.gc.arc(point.x, point.y, Application.values.lineWidth/2, 0, 2*Math.PI);
            Application.ui.gc.fill();
            Application.ui.gc.beginPath();
            Application.ui.gc.moveTo(point.x, point.y);

            Application.selection.gc.beginPath();
            Application.selection.gc.arc(point.x, point.y, Application.values.lineWidth/2, 0, 2*Math.PI);
            Application.selection.gc.fill();
            Application.selection.gc.beginPath();
            Application.selection.gc.moveTo(point.x, point.y);

            Application.canvasHolder.onmousemove = function(event)
            {
                var coords = getPixelCoordinates(event.clientX, event.clientY);
                Application.ui.gc.lineTo(coords.x, coords.y);
                Application.ui.gc.stroke();

                Application.selection.gc.lineTo(coords.x, coords.y);
                Application.selection.gc.stroke();
            }
            Application.canvasHolder.onmouseup = function(event)
            {
                Application.ui.gc.closePath();
                Application.selection.gc.closePath();
                Application.selection.empty = false;
                Application.canvasHolder.onmousemove = null;
            }
        }
    },

    deactivate: function()
    {
        Application.canvasHolder.onmousedown = null;
        Application.selection.clear();
    },

    configureContext: function()
    {
        Application.ui.gc.lineJoin = 'round';
        Application.ui.gc.lineCap = 'round';
        Application.ui.gc.lineWidth = Application.values.lineWidth;
        Application.ui.gc.strokeStyle = '#ff0000';

        Application.selection.gc.lineJoin = 'round';
        Application.selection.gc.lineCap = 'round';
        Application.selection.gc.lineWidth = Application.values.lineWidth;
        Application.selection.gc.strokeStyle = '#ff0000';
    }
};