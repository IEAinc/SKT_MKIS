"use strict";
function callbackAction(el) {
    alert('sample callback scope : value is ' + el.value);
}
$(function () {
    $('#gnb a').on('mouseenter', function (e) {
        e.preventDefault();
        var target = $('#header-drop');
        var subMenu = $('.menu-columns');
        subMenu.addClass('slide_open');
        target.addClass('slide_open');
    });
    $('#header')
        .find('#hamburger-a')
        .on('click', function (e) {
        e.preventDefault();
        try {
            var target = $('.new-layer');
            target.toggle();
        }
        catch (err) {
            console.error(err);
        }
    });
    $('#new-layer-body')
        .find('.new-layer-close-btn')
        .on('click', function (e) {
        e.preventDefault();
        handleLayerTriggerEvent();
    });
    $('.new-layer')
        .find('.dimmed')
        .on('click', function (e) {
        e.stopPropagation();
        handleLayerTriggerEvent();
    });
    var handleLayerTriggerEvent = function () {
        var target = $('.new-layer');
        if (!target.is(':hidden')) {
            target.hide();
            return;
        }
        target.show();
    };
    var handleGlobalHeaderEvent = function () {
        $('.menu-columns').removeClass('slide_open');
        $('#header-drop').removeClass('slide_open');
    };
    $('#header').find('.header-row').eq(1).on('mouseleave', handleGlobalHeaderEvent);
    /* //주석처리 P051230 공통js에서 따로 로직처리하고 있어서 주석처리
    $('#search_type').selectOrDie();
    $('#family_site').selectOrDie();
    */
    /* //주석처리 P051230 jsp에 로직 변경 적용
    $('#search')
        .find('input[type=text]')
        .on('keyup', function () {
        var target = $('.search-autocomplete');
        if ($(this).val().length === 0) {
            target.hide();
            return;
        }
        if (target.is(':hidden')) {
            target.show();
        }
    });
    $('#search')
        .find('#btn-autocomplete')
        .on('click', function (e) {
        e.preventDefault();
        var isUseAutoComplete = $('.search-autocomplete__no').is(':hidden');
        if (isUseAutoComplete === true) {
            $(this).text('자동완성 켜기');
            $('.search-autocomplete__yes').hide();
            $('.search-autocomplete__no').show();
        }
        else {
            $(this).text('자동완성 끄기');
            $('.search-autocomplete__no').hide();
            $('.search-autocomplete__yes').show();
        }
    });*/
    $('#search')
        .find('.search-category a')
        .on('click', function (e) {
        e.preventDefault();
        var form = $(this).parents('form');
        var value = $(this).data('value').toString();
        $(this).toggleClass('selected');
        $('input[name=' + value + ']', form).prop('value', $(this).hasClass('selected'));
    });
    $('#search-retry-box')
        .find('#retry-flag > a')
        .on('click', function (e) {
        e.preventDefault();
        var target = $(this).siblings('ul');
        target.toggle();
    });
    $('#search-retry-box')
        .find('#retry-flag > ul a')
        .on('click', function (e) {
        e.preventDefault();
        var form = $(this).parents('form');
        var value = $(this).data('value');
        var label = $(this).text();
        var target = $(this).parents('ul').prev();
        $(this).parents('ul').hide();
        target.text(label);
        $('input[name=search_retry_flag]', form).prop('value', value);
    });
    /* //주석처리 P051230 공통js에서 따로 로직처리하고 있어서 주석처리
    $('select').not('[data-extend=false]').selectOrDie({
        customClass: 'extend-custom-select'
    });*/
});
