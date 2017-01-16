var Application = {
    canvas: null,
    gc: null, //Graphics context
    imageData: null,
    data: null,
    fileName: "test.png",
    activeTool: null,
    zoom: {x: 1, y: 1},
    values: {
        lineWidth: 30,
        color: "#000000",
    },

    init: function()
    {
        this.initCanvas();
        this.initContext();
        this.imageData = this.gc.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.data = this.imageData.data;
        this.calculateZoom();
    },

    initCanvas: function(width, height)
    {
        this.canvas = document.getElementById("mainCanvas");

        if(width == null || height == null)
        {
            height = 0.8 * window.innerHeight;
            width = 0.8 * window.innerWidth;
        }
        
        this.canvas.style.height = height + 'px';
        this.canvas.style.width = width + 'px';
        
        this.canvas.width = width;
        this.canvas.height = height;
        this.scaleCanvas();
        this.centerCanvas();
    },

    scaleCanvas: function()
    {
        var maxHeight = Math.round(0.8 * window.innerHeight);
        var maxWidth = Math.round(0.8 * window.innerWidth);
        var factor = 1;
        var width = maxWidth;
        var height = maxHeight;
        if(this.canvas.width < this.canvas.height)
        {
            factor = maxWidth / this.canvas.offsetWidth;
            height = this.canvas.offsetHeight * factor;
        }
        else
        {
            factor = maxHeight / this.canvas.offsetHeight;
            width = this.canvas.offsetWidth * factor;
        }

        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
    },

    calculateZoom: function()
    {
        this.zoom.x = this.canvas.width / this.canvas.offsetWidth;
        this.zoom.y = this.canvas.height / this.canvas.offsetHeight;
    },

    initContext: function()
    {
        this.gc = this.canvas.getContext('2d');
        this.gc.imageSmoothingEnabled = false;
        this.gc.mozImageSmoothingEnabled    = false;
        this.gc.oImageSmoothingEnabled      = false;
        this.gc.webkitImageSmoothingEnabled = false;
        this.gc.msImageSmoothingEnabled     = false;
    },

    centerCanvas: function()
    {
        this.canvas.style.left = window.innerWidth / 2 - this.canvas.offsetWidth / 2 + 'px';
        this.canvas.style.top = window.innerHeight / 2 - this.canvas.offsetHeight / 2 + 'px';
    },

    activateTool: function(tool)
    {
        this.tool && this.tool.deactivate();
        this.tool = tool;
        this.tool.activate();
    }
};

window.onload = Application.init();