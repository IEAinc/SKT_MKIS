"use strict";
$(function () {
    $("#notice-tab")
        .find("a")
        .on("click", function (e) {
        //e.preventDefault();
        var currentIdx = $("#notice-tab").find("a").index($(this));
        $(this)
            .addClass("selected")
            .parents("li")
            .siblings()
            .find("a")
            .removeClass("selected");
    });
    $("#contents-tab")
        .find("a")
        .on("click", function (e) {
        e.preventDefault();
        var container = $(".area-contents__body__contents");
        var currentIdx = $("#contents-tab").find("a").index($(this));
        $(this)
            .addClass("selected")
            .parents("li")
            .siblings()
            .find("a")
            .removeClass("selected");
        $(".contents__section", container)
            .eq(currentIdx)
            .show()
            .siblings()
            .hide();
    });
});
