(function ($) {

    $.fn.myCollapse = function (toShow, inputDuration) {

        var target = this[0].getAttribute('href');
        var $collapse = $(target);
        var duration = inputDuration || 300;

        if (!toShow && $collapse.hasClass('in')) {
            this.attr('aria-expanded', false).addClass('collapsed');
            $collapse.attr('aria-expanded', false).slideUp(duration, function () {
                $(this).css('display', '').removeClass('in');
            });
        } else if (toShow && !$collapse.hasClass('in')) {
            this.attr('aria-expanded', true).removeClass('collapsed');
            $collapse.attr('aria-expanded', true).slideDown(duration, function () {
                $(this).css('display', '').addClass('in');
            });
        }

        return this;
    };

    $.fn.myButton = function (_id) {

        if (!_id) {
            this.removeClass('to-edit');
            this.text(TAPi18n.__("bake"));
            this.data('id-edit', null);
        } else if (_id) {
            this.addClass('to-edit');
            this.text(TAPi18n.__("edit"));
            this.data('id-edit', _id);
        }

        return this;

    };

})(jQuery);
