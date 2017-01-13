var GUI = {
    TOOL_MENU: "toolMenu",
    TOOL_MENU_BUTTON: "toolMenuButton",

    close: function(elementId)
    {
        document.getElementById(elementId).style.display = 'none';
    },

    open: function(elementId)
    {
        document.getElementById(elementId).style.display = 'block';
    },

    toolButtonClicked: function(tool)
    {
        Application.activateTool(tool);
        this.close(this.TOOL_MENU);
        document.getElementById(this.TOOL_MENU_BUTTON).style.backgroundImage = "url('Icons/"+tool.icon+"')";
    } 
};