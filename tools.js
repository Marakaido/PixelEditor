function getPixelCoordinates(x, y)
{
    return {
        x: Math.round((x - Application.canvas.offsetLeft) * Application.zoom.x),
        y: Math.round((y - Application.canvas.offsetTop) * Application.zoom.y)
    };
}

var Pencil = {
    icon: "pencil.png",

    activate: function()
    {
        this.configureContext();
        Application.canvas.onmousedown = function(event)
        {
            var point = getPixelCoordinates(event.clientX, event.clientY);
            Application.gc.beginPath();
            Application.gc.moveTo(point.x, point.y);
            Application.canvas.onmousemove = function(event)
            {
                var point = getPixelCoordinates(event.clientX, event.clientY);
                Pencil.draw(point);
            }
            Application.canvas.onmouseup = function(event)
            {
                Application.gc.closePath();
                Application.canvas.onmousemove = null;
            }
        }
    },

    deactivate: function(){},

    draw: function(coords)
    {
        Application.gc.lineTo(coords.x, coords.y);
        Application.gc.stroke();
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
        Application.canvas.onmousedown = function(event)
        {
            var point = getPixelCoordinates(event.clientX, event.clientY);
            Application.gc.beginPath();
            Application.gc.moveTo(point.x, point.y);
            Application.canvas.onmousemove = function(event)
            {
                var point = getPixelCoordinates(event.clientX, event.clientY);
                Pencil.draw(point);
                Pencil.previousPoint = point;
            }
            Application.canvas.onmouseup = function(event)
            {
                Application.gc.closePath();
                Application.canvas.onmousemove = null;
            }
        }
    },
    deactivate: function()
    {
        Application.gc.globalCompositeOperation = 'source-over';
    },

    draw: function(coords)
    {
        Application.gc.lineTo(coords.x, coords.y);
        Application.gc.stroke();
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
        Application.canvas.onclick = function(event)
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
        Application.canvas.onmousedown = function(event)
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
        Application.canvas.onmousedown = null;
    },
};

var Zoom = {
    icon: "Search.png",
    modifier: 0.1,
    
    activate: function()
    {
        Application.canvas.onclick = function(event)
        {
            Zoom.zoom(event.clientX, event.clientY, Zoom.modifier);
        }
        Application.canvas.oncontextmenu = function(event)
        {
            event.preventDefault();
            event.stopPropagation();
            Zoom.zoom(event.clientX, event.clientY, -Zoom.modifier);
        }
    },

    deactivate: function()
    {
        Application.canvas.onclick = null;
        Application.canvas.oncontextmenu = null;
    },

    zoom: function(x, y, modifier)
    {
        var width = Application.canvas.offsetWidth;
        var height = Application.canvas.offsetHeight;
        var left = Application.canvas.offsetLeft;
        var top = Application.canvas.offsetTop;
        Application.canvas.style.width = width + width * modifier + 'px';
        Application.canvas.style.height = height + height * modifier + 'px';
        Application.canvas.style.left = left - x * modifier + 'px';
        Application.canvas.style.top = top - y * modifier + 'px';
        Application.calculateZoom();
    }
};