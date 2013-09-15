var AboutView = function () {
    this.render = function ()
    {
        return AboutView.template();
    }
};

AboutView.template = Handlebars.compile($('#about-tmpl').html());