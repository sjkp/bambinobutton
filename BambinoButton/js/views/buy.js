var BuyView = function () {
    this.init = function () {
        this.el = $('<div/>');
        this.el.on('click', '#buyfullaccess', function () {
            var button = $(this);
            button.attr('disabled', 'disabled');
            if (typeof (inappbilling) != 'undefined') {
                inappbilling.buy(function (productId) {
                    //success
                    app.products.push(productId);
                    app.loadSongs(app.language.get());
                    window.location.hash = "Buy?Complete";
                },
                function (error) {
                    alert(eror);
                    button.removeAttr('disabled');
                }, 'bambinobutton.fullaccess');
            }
            else
            {
                app.products.push('bambinobutton.fullaccess');
                app.loadSongs(app.language.get());
                window.location.hash = "Buy?Complete";
            }
        });
    };

    this.render = function () {
        //if (typeof (inappbilling) == 'undefined')
        //{
        //    return this.el.html(BuyView.template({
        //        text: 'If you want access to all songs please buy the phone version.',
        //        buttontext: 'Buy full access',
        //        disabled: 'disabled'
        //    }));
        //}

        if (app.products != null && app.products.length > 0) {
            return this.el.html(BuyView.template({
                text: 'Thank you for supporting us and create the possibility for this project to flourish. We cannot thank you enough and hope that you will enjoy the full version for bambino button. Have a fantastic day and by the way, you look amazing today.',
                buttontext: 'Thank you',
                disabled: 'disabled'
            }));
        }
        return this.el.html(BuyView.template({
            text: 'Open up for plenty more songs for the little ones plus additional features and options. One dollar you will get you:<ul><li>50+ songs and more to come<li>Possibility for fast feedback</li><li>Continuing development and more languages</li><li>A good warm feeling and plus point in karma.</li><li>Least but not last, are you supporting us and thanks for that! We appreciate it and a grateful for it.</li></ul>',
            buttontext: 'Get it now',
            disabled: ''
        }));

    };

    this.init();
};

BuyView.template = Handlebars.compile($('#buy-tmpl').html(), { noEscape: true });