var GUI = {
    TOOL_MENU: "toolMenu",
    TOOL_MENU_BUTTON: "toolMenuButton",

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
        Application.selection.apply(filter);
    }
};