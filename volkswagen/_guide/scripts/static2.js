/*jslint browser: true*/

/*global $, SyntaxHighlighter, window */

$(function () {

    'use strict';

    /*$('.table tbody tr').each(function(){

        var num = $(this).index() + 1;

        $(this).find('td').eq(0).html(num);

    });*/

    $('.table li').each(function (idx) {

        $(this).find('.col-no').eq(0).html(idx);

    });

    var donePage = $(".done").length,

        finePage = $(".fine").length,

        //undonePage = $("td.undone").length,

        totalPage = $(".col-no").length - 1,

        realTotalPage = $(".col-no").length - $(".delete").length - $(".common").length - 1,

        ratio = parseInt(donePage / realTotalPage * 100, 10);

    $('.col-no').eq(0).html('번호');

    $(".ratio").text(ratio);

    $(".total-amount").text(totalPage);

    $(".real-total-amount").text(realTotalPage);

    $(".done-amount").text(donePage);

    $(".fine-amount").text(finePage);

    if ($('.col-status').hasClass('done')) {

        $('.done').parent().addClass('tr-done');

        $('.done').text('검수중');

    }

    if ($('.col-status').hasClass('ing')) {

        $('.ing').parent().addClass('tr-ing');

        $('.ing').text('진행중');

        $('.ing').siblings('.col-date').text('');

    }

    if ($('.col-status').hasClass('delete')) {

        $('.delete').parent().addClass('tr-delete');

        $('.delete').text('-');

    }

    if ($('.col-status').hasClass('fine')) {

        $('.fine').parent().addClass('tr-fine');

        $('.fine').text('배포');

    }

    if ($('.col-status').hasClass('common')) {

        $('.common').parent().addClass('tr-common');

        $('.common').text('공통');

    }

    $('.table-app .col-url').each(function () {

        var text = $(this).text(), baseUrl;

           

        /*if($(this).siblings('.col-device').text() == 'mo') {

            baseUrl = '../mo/html/';

        } else {

            baseUrl = '../html/';

        }*/
        
        // 현재 페이지의 URL에서 파일명만 추출
        var currentPage = window.location.pathname.split('/').pop().toLowerCase();  // 소문자로 변환
        console.log("현재 파일명:", currentPage);  // 현재 파일명 콘솔에 출력

        // 파일명을 소문자로 변환하여 비교
        if (currentPage === 'public_worklist_mobile.html') {
            console.log("public_worklist_mobil.html 파일이 맞습니다.");
            baseUrl = '../mo/html/';
        } else {
            console.log("다른 파일입니다.");
            baseUrl = '../html/';
        }



        if($(this).parent().is('.tr-done') || $(this).parent().is('.tr-ing')) {

            $(this).empty().append('<a href="' + baseUrl + text + '.jsp" target="_blank">' + text + '</a>');

        } 

    });

});

//$(function () {

//    'use strict';

//    SyntaxHighlighter.defaults.toolbar = false;

//    SyntaxHighlighter.defaults.gutter = false;

//    SyntaxHighlighter.all();

//});



function includeHTML() {

    var z, i, elmnt, file, xhttp;

    /* Loop through a collection of all HTML elements: */

    z = document.getElementsByTagName("*");

    for (i = 0; i < z.length; i++) {

      elmnt = z[i];

      /*search for elements with a certain atrribute:*/

      file = elmnt.getAttribute("include-html");

      if (file) {

        /* Make an HTTP request using the attribute value as the file name: */

        xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {

          if (this.readyState == 4) {

            if (this.status == 200) {elmnt.innerHTML = this.responseText;}

            if (this.status == 404) {elmnt.innerHTML = "Page not found.";}

            /* Remove the attribute, and call this function once more: */

            elmnt.removeAttribute("include-html");

            includeHTML();

          }

        }

        xhttp.open("GET", file, true);

        xhttp.send();

        /* Exit the function: */

        return;

      }

    }

  }



window.addEventListener('DOMContentLoaded', function () {

    'use strict';

    SyntaxHighlighter.defaults.toolbar = false;

    SyntaxHighlighter.defaults.gutter = false;

    SyntaxHighlighter.all();

    includeHTML();

});

