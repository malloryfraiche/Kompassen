$(function () {

    // Custom serialize function that Linus has developed for us

    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    $("#courseDetailsPlaceholder").hide();
    $("#courseListPlaceholder").hide();
    $("#studentListPlaceholder").hide();
    $(".navbar-brand").on("click", function () {
        location.reload();
    });

    // When clicking on one of the nav links

    $("#navbar li a").on("click", function () {

        // Sets the link to active when pressed

        $(this).parent().attr("class", "active").siblings().removeAttr("class", "active");
        var currentLink = $(this).attr("href");
        if (currentLink === "#start") {
            $("#defaultPlaceholder").slideDown().siblings("div").hide();
        }
        if (currentLink === "#courses") {
            $("#courseListPlaceholder").slideDown().siblings("div").hide();
        }
        if (currentLink === "#students") {
            $("#studentListPlaceholder").slideDown().siblings("div").hide();
        }
    });
});