function activateTool(tool)
{
    Pencil.activate();
    Application.activeTool = tool;
}

function getPixelCoordinates(x, y)
{
    return {
        x: (x - Application.canvas.offsetLeft) * Application.zoom,
        y: (y - Application.canvas.offsetTop) * Application.zoom
    };
}

var Pencil = {
    previousPoint: null, 

    activate: function()
    {
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
    }
};