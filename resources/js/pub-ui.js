
$(document).ready(function () {
    // 공통 버튼
    $(".btn").kendoButton();

    /**** gnb ****/
    // scrollbar custom
//    $(window).on("load",function(){
        if($(".gnb").length> 0 ) {
            $(".gnb-menu-wrap").mCustomScrollbar({
                // axis: 'y',
                theme:"minimal",
            });
        }
//    });
    // 즐겨찾기 버튼
    $(".btn-favorite").click(function(){
        if($(this).hasClass("active")) {
            $(this).removeClass("active");
        } else {
            $(this).addClass("active");
        }
    });
    // lnb 아코디언
    $(".lnb-acc-tit").click(function(){
        var $accCon = $(this).parents(".lnb-acc");
        if($accCon.hasClass("active")) {
            $accCon.removeClass("active"); 
        } else {
            $accCon.addClass("active"); 
        }
    });
    // gnb 클릭 시 lnb 노출
    $(".gnb-ul-link").click(function(){
        var $lnbId = $(this).attr('href');

        // gnb 아이콘 active
        $(".gnb-ul-link").removeClass("active");
        $(this).addClass("active");

        // lnb 액션
        if(!($(".lnb").hasClass("active"))){
            $(".lnb").addClass("active");
        }
        $(".lnb-con").css("display", "none");
        $($lnbId).css("display", "block");
        
    });
    // user-profile
    $(".gnb-user").click(function() {
        $("#header .user-profile-area").addClass("active");

        // lnb 숨기기
        if($(".lnb").hasClass("active")) {
            $(".lnb").removeClass("active");
            $(".gnb-ul-link").removeClass("active");
        }
    });
    $(document).click(function(e) {
        var $gnb = $(".gnb-ul-link");
        var $lnb = $(".lnb");
        var $gnbUser = $(".gnb-user");
        var $profile = $("#header .user-profile-area");

        if (!$gnb.is(e.target) &&            // 클릭의 타겟이 원하는 div 또는 섹션이 아닌 경우
            $gnb.has(e.target).length === 0 && // ... 컨테이너의 자손도 아님
            !$lnb.is(e.target) &&
            $lnb.has(e.target).length === 0 &&
            !$gnbUser.is(e.target) &&
            $gnbUser.has(e.target).length === 0 &&
            !$profile.is(e.target) &&
            $profile.has(e.target).length === 0
            ) 
        {
            $gnb.removeClass("active");
            $lnb.removeClass("active");
            $profile.removeClass("active");
        }
    });

    // btn more
    if($(".btn-more-group")) {
        $(".btn-more-group").click(function(){
            var $sub = $(this).find(".btn-more-sub");
            $sub.addClass("active"); 
        });
        $(document).click(function(e) {
            var container = $(".btn-more-group");
            if (!container.is(e.target) &&            // 클릭의 타겟이 원하는 div 또는 섹션이 아닌 경우
                container.has(e.target).length === 0) // ... 컨테이너의 자손도 아님
            {
                container.find(".btn-more-sub").removeClass("active");
            }
        });
    }

    // 모달 닫기 공통
    $(".hide-modal").click(function(){
       $(this).parents(".modal").removeClass("show"); 
    });


    // search panel
    if($(".panel.search.expansion")) {
        $('.btn-search-expansion').click(function(){
            var $panel = $(this).parents('.panel.search.expansion');
            if($panel.hasClass('active')) {
                $panel.removeClass('active'); 
            } else {
                $panel.addClass('active'); 
            }
        });
    }
    // table-header-expansion
    if($(".table-header-expansion")) {
        $('.btn-search-expansion').click(function(){
            var $panel = $(this).parents('.table-header-expansion');
            if($panel.hasClass('active')) {
                $panel.removeClass('active'); 
            } else {
                $panel.addClass('active'); 
            }
        });
    }

    $('.btn-search-expansion-more').click(function(e){
        e.preventDefault()
        var $panel = $(this).closest('.panel.search.expansion');
        $panel.toggleClass('active');
    });

    // accordion panel 
    if($(".panel.accordion")) {
        $('.btn-panel-accordion').click(function(){
            var $panel = $(this).parents('.panel.accordion');
            if($panel.hasClass('active')) {
                $panel.removeClass('active'); 
            } else {
                $panel.addClass('active'); 
            }
         });
    }

    // tab 실행
    if($(".tab")) {
        var $tabs = $(".tab");
        $tabs.each(function(i) {
            // tab 함수 (전체 탭, 시작index)
            tabEvent($tabs[i], 0);
        }); 
    }

    // tab multi 실행
    if($(".tab-multi")) {
        var $tabMulti = $(".tab-multi");
        $tabMulti.each(function(i) {
            // tab 함수 (전체 탭, 시작index)
            tabMultiEvent($tabMulti[i], 0);
        }); 
    }

    // Tooltip
    if($(".tooltip")) {
        $(".tooltip-btn").click(function() {
            var $tooltipBox = $(this).siblings(".tooltip-box");
            if($tooltipBox.hasClass("active")){
                $tooltipBox.removeClass("active");
            } else {
                $tooltipBox.addClass("active");
            }
        });
    }

    //Toggle
    if($(".user-phone-number")) {
        $(".user-phone-number").click(function(){
            var $icon = $(this).find(".phone-number-icon");
            var $text = $(this).find(".hide-text");
            if($icon.hasClass("active")){
                $icon.removeClass("active"),
                $text.text("****");
            } else {
                $icon.addClass("active"),
                $text.text("5678");
            }
        });
    }

});

// tab 함수
function tabEvent(tab, index) {
    var tabBtns = tab.querySelector('.tab-nav').querySelectorAll('li');
    var tabPanels = tab.querySelector('.tab-content').getElementsByClassName('tab-panel');

    displayPanel(tabBtns[index]);

    for (var i = 0; i < tabBtns.length; i++) {
        tabBtns[i].onclick = function () {
            displayPanel(this);
            return false;
        }
        tabBtns[i].onfocus = function () {
            displayPanel(this);
            return false;
        }
    }

    function displayPanel(tabToActivate) {
        for (var i = 0; i < tabBtns.length; i++) {
            if (tabBtns[i] == tabToActivate) {
                tabBtns[i].querySelector('a').classList.add('active');
                tabPanels[i].classList.add('active');
            } else {
                tabBtns[i].querySelector('a').classList.remove('active');
                tabPanels[i].classList.remove('active');
            }
        }
    }
}

// tabMulti 함수
function tabMultiEvent(tab, index) {
    var tabBtns = tab.querySelector('.tab-nav').querySelectorAll('li');
    var tabPanels = tab.querySelector('.tab-content').getElementsByClassName('tab-panel');

    // displayPanel(tabBtns[index]);

    for (var i = 0; i < tabBtns.length; i++) {
        tabBtns[i].onclick = function () {
            displayPanel(this);
            return false;
        }
        tabBtns[i].onfocus = function () {
            displayPanel(this);
            return false;
        }
    }

    function displayPanel(tabToActivate) {
        for (var i = 0; i < tabBtns.length; i++) {
            if (tabBtns[i] == tabToActivate) {
                if(tabBtns[i].classList.contains('active')) {
                    tabBtns[i].classList.remove('active');
                    tabPanels[i].classList.remove('active');
                } else {
                    tabBtns[i].classList.add('active');
                    tabPanels[i].classList.add('active');
                }
                
            }
        }
    }
}

// //전체선택
// function allChkEvent() {
//     var select_all = document.getElementById('allChk');
//     var checkboxes = document.querySelectorAll('.form-list-group .form-chk-input');
//     if(select_all && checkboxes) {
//         select_all.addEventListener('change', function () {
//             for (i = 0; i < checkboxes.length; i++) {
//                 checkboxes[i].checked = select_all.checked;
//             }
//         });
//         for (var i = 0; i < checkboxes.length; i++) {
//             checkboxes[i].addEventListener('change', function () {
//                 if (this.checked == false) {
//                     select_all.checked = false;
//                 }
//                 if (document.querySelectorAll('.form-list-group .form-chk-input').length == checkboxes.length) {
//                     select_all.checked = true;
//                 }
//             });
//         }
//     }
// }

// //textarea count
// function chkByte() {
//     var countArea = document.querySelectorAll('.form-item-count');
//     if(countArea) {
//         countArea.forEach(function (countChk) {
//             const textarea = countChk.querySelector('.form-control');
//             const wroteCount = textarea.value.length;
//             const textareaCount = countChk.nextElementSibling;
//             const count = textareaCount.querySelector('.write');
//             count.innerHTML = wroteCount;
//             textarea.addEventListener('input', function () {
//                 let currentLength = this.value.length;
//                 count.innerHTML = currentLength;
//             });
//         });
//     }
// }


// // 아코디언
// function accordionEvent(acc) {
//     var accItem = acc.querySelectorAll('li');
//     var accBtn = acc.getElementsByClassName('accordion-btn');
//     var accPanel = acc.getElementsByClassName('accordion-panel');
//     var i, j;

//     for (i = 0; i < accItem.length; i++) {
//         accBtn[i].addEventListener('click', function () {
//             var panel = this.nextElementSibling;

//             if (!this.classList.contains('active')) {
//                 //active 없을 때
//                 this.classList.add('active');
//                 panel.style.maxHeight = panel.scrollHeight + 'px';
//                 for (j = 0; j < accItem.length; j++) {
//                     if (accPanel[j] != panel) {
//                         accPanel[j].style.maxHeight = null;
//                         accBtn[j].classList.remove('active');
//                     }
//                 }
//             } else {
//                 //active 있을 때
//                 this.classList.remove('active');
//                 panel.style.maxHeight = null;
//             }
//         });
//     }
// }



// // toast
// var toastTimeout;

// function createToast(msg) {
//     var toastArea = document.createElement('div');
//     var toast = document.createElement('div');
//     toastArea.classList.add('toast-area');
//     toast.classList.add('toast');

//     toast.innerHTML = msg;

//     toastArea.append(toast);
//     document.body.append(toastArea);
// }

// function showToast() {
//     var toast = document.querySelector('.toast-area');
//     toast.classList.add('show');

//     clearTimeout(toastTimeout);

//     toastTimeout = setTimeout(function () {
//         toast.classList.remove('show');
//     }, 1500);
// }

// //modal
// function modal() {
//     //open modal
//     let showModal = document.querySelectorAll('.btn-show-modal');

//     showModal.forEach(function (trigger) {
//         trigger.addEventListener('click', function () {
//             const targetText = this.getAttribute('onclick').substr(16);
//             const target = targetText.slice(0, -1);
//             const modalWindow = document.getElementById(target);
//             const modalCont = modalWindow.childNodes[1];
//             if (modalWindow.classList) {
//                 modalWindow.classList.add('show');
//             }
//             modalCont.style.transform = "none";
//             modalCont.style.cssText = "trasnfrom: none;transition: transform .3s";
//         });
//     });

//     //close modal
//     let closeModal = document.querySelectorAll('.btn-close-modal');

//     closeModal.forEach(function (btn) {
//         btn.addEventListener('click', function () {
//             const modalWindow = this.parentNode.parentNode;
//             const modalCont = this.parentNode;
//             modalWindow.classList.remove('show');
//             modalCont.style.cssText = "trasnfrom: translateY(100%);transition: transform .3s";
//         });
//     });

//     let closeModalConfirm = document.querySelectorAll('.btn-close-modal-confirm');

//     closeModalConfirm.forEach(function (btn) {
//         btn.addEventListener('click', function () {
//             const modalWindow = this.parentNode.parentNode.parentNode;
//             modalWindow.classList.remove('show');
//         });
//     });

//     var modalBottom = document.querySelector('.modal-bottom');
//     var modalEvt = document.querySelector('.modal-event');
    
//     var clickEvent = (function() {
// 		if ('ontouchstart' in document.documentElement === true) return 'touchstart';
// 		else return 'click';
//     })();
    
//     window.addEventListener(clickEvent, function (e) {
//         if(e.target == (modalBottom || modalEvt)) {
//             if(modalBottom) {
//                 modalBottom.classList.remove('show');
//             }
//             if(modalEvt) {
//                 modalEvt.classList.remove('show');
//             }
//         }
//     });
// }

// function goolbiWhenReady(func) {
//     document.addEventListener('DOMContentLoaded', func);
// }

// goolbiWhenReady(modal);
// goolbiWhenReady(chkByte);
// goolbiWhenReady(allChkEvent);
// //goolbiWhenReady(swipeModal);