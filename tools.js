function pensil()
{
    Application.canvas.onmousedown = function(event)
    {
        var x = event.clientX - event.currentTarget.offsetLeft;
        var y = event.clientY - event.currentTarget.offsetTop;

        pencilDraw(x, y);
        Application.canvas.onmousemove = function(event)
        {
            x = event.clientX - event.currentTarget.offsetLeft;
            y = event.clientY - event.currentTarget.offsetTop;
            pencilDraw(x, y);
        }
        Application.canvas.onmouseup = function(event)
        {
            Application.canvas.onmousemove = null;
        }
    }
}

function pencilDraw(x, y)
{
    Application.gc.beginPath();
    Application.gc.arc(x,y,2,0,2*Math.PI);
    Application.gc.fill();
}