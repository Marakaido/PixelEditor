var GUI = {
    TOOL_MENU: "toolMenu",
    TOOL_MENU_BUTTON: "toolMenuButton",

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
        document.getElementById(this.TOOL_MENU_BUTTON).style.backgroundImage = "url('Icons/"+tool.icon+"')";
    },
    filterButtonClicked: function(filter)
    {
        this.close(this.TOOL_MENU);
        Application.selection.apply(filter);
    }
};