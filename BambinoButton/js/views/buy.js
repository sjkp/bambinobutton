var BuyView = function () {
    this.init = function () {
        this.el = $('<div/>');
        this.el.on('click', '#buyfullaccess', function () {
            var button = $(this);
            button.attr('disabled', 'disabled');
            if (typeof (inappbilling) != 'undefined') {
                inapbilling.buy(function (productId) {
                    //success
                    alert('succes');
                    button.removeAttr('disabled');
                },
                function (error) {
                    alert(eror);
                    button.removeAttr('disabled');
                }, 'bambinobutton.fullaccess');
            }
        });
    };

    this.render = function () {

        return this.el.html(BuyView.template({
            text: 'You already have full access',
            buttontext: 'Buy full access',
            disabled: 'disabled'
        }));

    };

    this.init();
};

BuyView.template = Handlebars.compile($('#buy-tmpl').html());