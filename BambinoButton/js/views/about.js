var AboutView = function () {

    this.init = function () {
        this.el = $('<div/>');
    };
    this.render = function ()
    {
        return this.el.html(AboutView.template());
    };

    this.init();
};

AboutView.template = Handlebars.compile($('#about-tmpl').html());