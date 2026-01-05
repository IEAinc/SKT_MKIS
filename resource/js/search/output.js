"use strict";
$(function () {
	/* //주석처리 P051230 아래 $(document).on('click') 동적바인딩으로 변경
    $('.contents-tabs')
        .find('.unit__tab')
        .on('click', function (e) {
        e.preventDefault();
        var el = $(this).parent('.contents-tabs__unit');
        el.toggleClass('active').siblings().removeClass('active');
        $(this)
            .siblings('.contents-section')
            .css({
            top: $(this).position().top + 23 + 'px',
        })
            .toggle()
            .parent()
            .siblings()
            .find('.contents-section')
            .hide();
    });*/
    $(document).on('click', '.contents-tabs > div >.unit__tab', function (e) {		//P051230 동적바인딩으로 변경
        //e.preventDefault();
        var el = $(this).parent('.contents-tabs__unit');
        el.toggleClass('active').siblings().removeClass('active');
        $(this)
            .siblings('.contents-section')
            .css({
            top: $(this).position().top + 23 + 'px',
        })
            .toggle()
            .parent()
            .siblings()
            .find('.contents-section')
            .hide();
    });
    $('.search-options')
        .find('>a')
        .on('click', function (e) {
        e.preventDefault();
        $(this).hide().siblings().toggle().find('>a').show();
    });
    $('.search-options__body')
        .find('>a')
        .on('click', function (e) {
        e.preventDefault();
        $(this).hide().parent().toggle().siblings().show();
    });
    $('.search-results__contents__area__title__single')
        .find('#render-count > a')
        .on('click', function (e) {
        e.preventDefault();
        var target = $(this).siblings('ul');
        target.toggle();
    });
    $(this).on('click', '.contents-section > a', function (e) {
        e.preventDefault();
        $(this).parents('.contents-section').hide();
        $(this).parents('dd').find('.contents-tabs__unit').removeClass('active');
    });
    $('#button-mycontents').on('click', function (e) {
        e.preventDefault();
        $('#search-page').toggleClass('side-active');
    });
    $('#button-mycontents-close').on('click', function (e) {
        e.preventDefault();
        $('#search-page').removeClass('side-active');
    });
});
