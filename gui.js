var GUI = {
    TOOL_MENU: "toolMenu",
    TOOL_MENU_BUTTON: "toolMenuButton",
    INPUT_FIELDS: "inputFields",

    init: function()
    {
        var root = document.getElementById("root");
        root.style.background = "repeating-linear-gradient(135deg,#474451,#474451 50px,#4c4957 50px,#4c4957 100px)";
        root.style.width = window.innerWidth + 'px';
        root.style.height = window.innerHeight + 'px';
    },

    close: function(elementId)
    {
        document.getElementById(elementId).style.display = 'none';
        document.getElementById('root').className = '';
    },

    open: function(elementId)
    {
        document.getElementById(elementId).style.display = 'block';
        document.getElementById('root').className = 'blur';
    },

    toolButtonClicked: function(tool)
    {
        Application.activateTool(tool);
        this.close(this.TOOL_MENU);
        document.getElementById(this.TOOL_MENU_BUTTON).src = "Icons/"+tool.icon;
    },

    filterButtonClicked: function(filter)
    {
        this.close(this.TOOL_MENU);
        
        if(filter.inputId != null) 
        {
            this.open(this.INPUT_FIELDS);
            if(Application.activeTool != null && Application.activeTool.inputId != null)
                this.close(Application.activeTool.inputId);
            this.open(filter.inputId);
        }
        else 
        {
            this.close(this.INPUT_FIELDS);
            Application.selection.apply(filter);
        }
        Application.activeTool = filter;
    },

    onParameterSubmit: function()
    {
        Application.selection.apply(Application.activeTool);
    },

    histogramSpecificationClicked: function()
    {
        Application.activeTool = Filters.histogramSpecification;
        var reader = new FileReader();
        reader.onload = function(event)
        {
            var img = new Image();
            img.onload = function(){
                var canvas = document.getElementById("hiddenCanvas");
                canvas.width = img.width;
                canvas.height = img.height;
                var gc = canvas.getContext("2d");
                gc.drawImage(img,0,0);
                Filters.histogramSpecification.targetImageData = gc.getImageData(0,0,img.width, img.height);
                Application.selection.apply(Filters.histogramSpecification);
            }
            img.src = event.target.result;
        }
        var btn = document.getElementById("histogramSpecificationFileInput");
        btn.onchange = function ()
        {
            var file = btn.files[0];
            reader.readAsDataURL(file);
        }
        btn.click();
        
        
    }
};