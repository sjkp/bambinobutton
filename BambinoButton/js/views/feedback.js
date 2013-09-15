var FeedbackView = function () {
    this.init = function () {
        this.el = $('<div/>');
        this.el.on('click', '#sendfeedback', function () {
            var button = $(this);
            button.attr('disabled', 'disabled');
            app.client.getTable('feedback').insert({ feedback: $('#feedbacktext').val(), userAgent: navigator.userAgent }).done(function (succes) {
                $('#feedbackresponse').text('Thanks for the feedback and for taking your time to write it. Have a lovely day.');
                button.removeAttr('disabled');
                $('#feedbacktext').val('');
            }, function (error) {
                alert("Unable to send feedback:" + JSON.stringify(error));
            });
        });
    };
    this.render = function () {
        return this.el.html(FeedbackView.template());
    };

    this.init();
};

FeedbackView.template = Handlebars.compile($('#feedback-tmpl').html());