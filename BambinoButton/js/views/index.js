var IndexView = function () {
    this.init = function () {
        this.el = $('<div class="textcenter" />');
        var p = navigator.platform;
        if ('ontouchstart' in window) {

            this.el.on('touchstart', '#bambinobutton', app.onPlayClick);
            this.el.on('touchend', '#bambinobutton', app.onPlayRelease);
        }
        else {          
            this.el.on('mousedown', '#bambinobutton', app.onPlayClick);
            this.el.on('mouseup', '#bambinobutton', app.onPlayRelease);
        }
        
        this.el.on('click', '#continuesplay', app.onContinuesPlayClick);
        this.el.on('click','#animation' ,function () {
            var that = $(that);
            if (this.checked) {
                app.animation = true;
                $('#page-1').addClass('ani');
            }
            else {
                app.animation = false;
                $('#page-1').removeClass('ani');
            }
        });
    }

    this.afterload = function ()
    {
        app.loadSongs(app.language.get());
        if (typeof (inappbilling) == 'undefined') {
            this.el.append(IndexView.appStoreTemplate());
        }
    }

    this.render = function () {
        return this.el.html(IndexView.template());
    }

    this.init();
};

IndexView.template = Handlebars.compile($('#index-tmpl').html());
IndexView.appStoreTemplate = Handlebars.compile($('#appstore-tmpl').html());