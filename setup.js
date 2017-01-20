var Application = {
    canvas: null,
    gc: null, //Graphics context
    imageData: null,
    data: null,
    selection: {
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
        this.updateSelectionCanvas();
        this.initContext();
        this.initSelectionContext();
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

    updateSelectionCanvas: function()
    {
        this.selection.canvas = document.getElementById("selectionCanvas");
        this.selection.canvas.width = this.canvas.width;
        this.selection.canvas.height = this.canvas.height;
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
    },
    
    initSelectionContext: function()
    {
        this.selection.gc = this.selection.canvas.getContext('2d');
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