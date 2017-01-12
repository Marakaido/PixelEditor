var Application = {
    canvas: null,
    gc: null, //Graphics context
    imageData: null,
    data: null,
    fileName: "test.png",

    init: function()
    {
        this.initCanvas();
        this.imageData = this.gc.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.data = this.imageData.data;
    },

    initCanvas: function(width, height)
    {
        this.canvas = document.getElementById("mainCanvas");
        this.gc = this.canvas.getContext('2d');
        this.gc.imageSmoothingEnabled = false;

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

    centerCanvas: function()
    {
        this.canvas.style.left = window.innerWidth / 2 - this.canvas.offsetWidth / 2 + 'px';
        this.canvas.style.top = window.innerHeight / 2 - this.canvas.offsetHeight / 2 + 'px';
    }
};

window.onload = Application.init();