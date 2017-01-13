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