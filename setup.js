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

        this.centerCanvas();
    },

    calculateZoom: function()
    {
        this.zoom.x = this.canvas.width / this.canvas.offsetWidth;
        this.zoom.y = this.canvas.height / this.canvas.offsetHeight;
    },

    initContext: function()
    {
        //this.gc.imageSmoothingEnabled = false;
        this.gc = this.canvas.getContext('2d');
    },

    centerCanvas: function()
    {
        this.canvas.style.left = window.innerWidth / 2 - this.canvas.offsetWidth / 2 + 'px';
        this.canvas.style.top = window.innerHeight / 2 - this.canvas.offsetHeight / 2 + 'px';
    }
};

window.onload = Application.init();