$(document).ready(function () {
    // 공통 버튼
    $(".btn").kendoMobileButton();

    // modal close
    $(".btn-close-modal-confirm").click(function(){
        $(this).parents(".modal-confirm").removeClass("show");
    });
    $(".btn-close-modal").click(function(){
        $(this).parents(".modal").removeClass("show");
    });
});

// 아코디언
function accordionEvent(acc) {
    var accItem = acc.querySelectorAll('.accordion-item');
    // var accBtn = acc.getElementsByClassName('accordion-btn');
    var accBtn = acc.getElementsByClassName('accordion-header');
    var accPanel = acc.getElementsByClassName('accordion-panel');
    var i, j;

    for (i = 0; i < accItem.length; i++) {
        if(accItem[i].classList.contains('nodata')) {
            // nodata
            return;
        } else {
            accBtn[i].addEventListener('click', function () {
                // var panel = this.parentElement.nextElementSibling;
                var panel = this.nextElementSibling;

                if (!this.classList.contains('active')) {
                    //active 없을 때
                    this.classList.add('active');
                    panel.style.maxHeight = panel.scrollHeight + 'px';
                    for (j = 0; j < accItem.length; j++) {
                        if (accPanel[j] != panel) {
                            accPanel[j].style.maxHeight = null;
                            accBtn[j].classList.remove('active');
                        }
                    }
                } else {
                    //active 있을 때
                    this.classList.remove('active');
                    panel.style.maxHeight = null;
                }
            });
        }
    }
}

// 아코디언
function accordionMultyEvent(acc) {
    var accItem = acc.querySelectorAll('.accordion-item');
    // var accBtn = acc.getElementsByClassName('accordion-btn');
    var accBtn = acc.getElementsByClassName('accordion-header');
    var accPanel = acc.getElementsByClassName('accordion-panel');
    var i, j;

    for (i = 0; i < accItem.length; i++) {
        if(accItem[i].classList.contains('nodata')) {
            // nodata
            return;
        } else {
            accBtn[i].addEventListener('click', function () {
                // var panel = this.parentElement.nextElementSibling;
                var panel = this.nextElementSibling;

                if (!this.classList.contains('active')) {
                    //active 없을 때
                    this.classList.add('active');
                    panel.style.maxHeight = panel.scrollHeight + 'px';
                    for (j = 0; j < accItem.length; j++) {
                        if (accPanel[j] != panel) {
                            //accPanel[j].style.maxHeight = null;
                            //accBtn[j].classList.remove('active');
                        }
                    }
                } else {
                    //active 있을 때
                    this.classList.remove('active');
                    panel.style.maxHeight = null;
                }
            });
        }
    }
}

// toast
var toastTimeout;

function createToast(msg) {
    var toastArea = document.createElement('div');
    var toast = document.createElement('div');
    toastArea.classList.add('toast-area');
    toast.classList.add('toast');

    toast.innerHTML = msg;

    toastArea.append(toast);
    document.body.append(toastArea);
}

function showToast() {
    var toast = document.querySelector('.toast-area');
    toast.classList.add('show');

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(function () {
        toast.classList.remove('show');
    }, 1500);
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



// 탭
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

// toast
var toastTimeout;

function createToast(msg) {
    var toastArea = document.createElement('div');
    var toast = document.createElement('div');
    toastArea.classList.add('toast-area');
    toast.classList.add('toast');

    toast.innerHTML = msg;

    toastArea.append(toast);
    document.body.append(toastArea);
}

function showToast() {
    var toast = document.querySelector('.toast-area');
    toast.classList.add('show');

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(function () {
        toast.classList.remove('show');
    }, 1500);
}

//modal
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