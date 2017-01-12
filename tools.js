function activateTool(tool)
{
    tool.activate();
    Application.activeTool = tool;
}

function getPixelCoordinates(x, y)
{
    return {
        x: (x - Application.canvas.offsetLeft) * Application.zoom.x,
        y: (y - Application.canvas.offsetTop) * Application.zoom.y
    };
}

var Pencil = {
    previousPoint: null, 

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
                Pencil.previousPoint = null;
            }
        }
    },

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
                Application.gc.globalCompositeOperation = 'source-over';
            }
        }
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