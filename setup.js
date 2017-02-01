var Application = {
    canvasHolder: null,
    canvas: null,
    gc: null, //Graphics context
    imageData: null,
    data: null,
    selection: {
        canvas: null,
        gc: null,
        empty: true,
        apply: function(filter)
        {
            if(this.empty)
            {
                filter(Application.gc, 0, 0, Application.canvas.width, Application.canvas.height);
            }
            else
            {
                this.gc.save();
                this.gc.globalCompositeOperation = "source-in";
                this.gc.drawImage(Application.canvas, 0, 0);
                this.gc.restore();
                filter(this.gc, 0, 0, this.canvas.width, this.canvas.height);
                
                Application.gc.save();
                Application.gc.drawImage(this.canvas, 0, 0);
                Application.gc.restore();

                this.clear();
            }
        },
        clear: function()
        {
            this.gc.clearRect(0, 0, this.canvas.width, this.canvas.height);
            Application.ui.gc.clearRect(0, 0, Application.ui.canvas.width, Application.ui.canvas.height);
            this.empty = true;
        }
    },
    ui:{
        canvas: null,
        gc: null
    },
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
        this.calculateZoom();
    },

    initCanvas: function(width, height)
    {
        this.canvasHolder = document.getElementById("canvasHolder");
        this.canvas = document.getElementById("mainCanvas");
        this.selection.canvas = document.getElementById("selectionCanvas");
        this.ui.canvas = document.getElementById("uiCanvas");

        if(width == null || height == null)
        {
            height = 0.9 * window.innerHeight;
            width = 0.9 * window.innerWidth;
        }
        
        this.canvas.width = width;
        this.canvas.height = height;

        this.selection.canvas.width = this.canvas.width;
        this.selection.canvas.height = this.canvas.height;

        this.ui.canvas.width = this.canvas.width;
        this.ui.canvas.height = this.canvas.height;

        this.scaleCanvas();
        this.centerCanvas();
    },

    scaleCanvas: function()
    {
        var maxWidth = window.innerWidth * 0.9;
        var maxHeight = window.innerHeight * 0.9;
        var width = this.canvas.width;
        var height = this.canvas.height;
        if(width > maxWidth)
        {
            height = height * (maxWidth / width);
            width = maxWidth;
        }
        if(height > maxHeight)
        {
            width = width * (maxHeight / height);
            height = maxHeight;
        }

        this.canvasHolder.style.width = width + 'px';
        this.canvasHolder.style.height = height + 'px';
    },

    calculateZoom: function()
    {
        this.zoom.x = this.canvas.width / this.canvasHolder.offsetWidth;
        this.zoom.y = this.canvas.height / this.canvasHolder.offsetHeight;
    },

    initContext: function()
    {
        this.gc = this.canvas.getContext('2d');
        this.selection.gc = this.selection.canvas.getContext('2d');
        this.ui.gc = this.ui.canvas.getContext('2d');
    },

    centerCanvas: function()
    {
        this.canvasHolder.style.left = window.innerWidth / 2 - this.canvasHolder.offsetWidth / 2 + 'px';
        this.canvasHolder.style.top = window.innerHeight * 0.01 + 'px';
    },

    activateTool: function(tool)
    {
        this.tool && this.tool.deactivate();
        this.tool = tool;
        this.tool.activate();
    },

    getFullImageData: function()
    {
        return this.getImageData(0, 0, this.canvas.width, this.canvas.height);
    },

    getImageData: function(x, y, width, height)
    {
        var imageData = this.gc.getImageData(x, y, width, height);
        return {
            imageData: imageData,
            data: imageData.data,
            getPixel: function(i, j)
            {
                if(i < 0 || j < 0 || i >= imageData.width || j >= imageData.height) return null;
                var redPos = j * imageData.width * 4 + i*4;
                return {
                    red: this.data[redPos],
                    green: this.data[redPos+1],
                    blue: this.data[redPos+2],
                    alpha: this.data[redPos+3],
                    equals: function(color)
                    {
                        return  this.red == color.red &&
                                this.green == color.green &&
                                this.blue == color.blue &&
                                this.alpha == color.alpha;
                    }
                };
            },
            setPixel: function(i, j, color)
            {
                var redPos = j * imageData.width * 4 + i*4;
                this.data[redPos] = color.red;
                this.data[redPos+1] = color.green;
                this.data[redPos+2] = color.blue;
                this.data[redPos+3] = color.alpha;
            }
        };
    }
};

window.onload = Application.init();