(function($){
    $.fn.nodoubletapzoom = function() {
        $(this).bind('touchstart', function preventZoom(e){
            var t2 = e.timeStamp;
            var t1 = $(this).data('lastTouch') || t2;
            var dt = t2 - t1;
            var fingers = e.originalEvent.touches.length;
            $(this).data('lastTouch', t2);
            if (!dt || dt > 500 || fingers > 1){
                return; // not double-tap
            }
            e.preventDefault(); // double tap - prevent the zoom
            // also synthesize click events we just swallowed up
            $(e.target).trigger('dblclick');
        });
    };


})(jQuery);


var originalHeight=$(window).height();

$(document).on('pageinit',function(e){
    $("body").nodoubletapzoom();
});

// 입력폼: 소문자만 입력
$(document).on('keyup','.onlyLowerCase', function() {
	$(this).val( $(this).val().toLowerCase() );
});

// 입력폼: 대문자만 입력
$(document).on('keyup','.onlyUpperCase', function() {
	$(this).val( $(this).val().toUpperCase() );
});

// 입력폼: 한글, 숫자만 입력
$(document).on('keyup','.onlyKoreanNum', function() {
	$(this).val( $(this).val().replace(/[^ㄱ-ㅎ가-힣0-9]/gi,"") );
});

// 입력폼 숫자,영문만 입력
$(document).on('keyup','.onlyAlphaNum', function() {
	$(this).val( $(this).val().replace(/[^\!-z]/gi,"") );
});

$(document).on('focusout','.onlyAlphaNum', function() {
	$(this).val( $(this).val().replace(/[^\!-z]/gi,"") );
});

// 입력폼 숫자,영문만 입력(대문자변환)
$(document).on('keyup','.onlyAlphaNumUpper', function() {
    $(this).val( $(this).val().replace(/[^a-zA-Z0-9]/gi,"").toUpperCase() );
});
$(document).on('focusout','.onlyAlphaNumUpper', function() {
	$(this).val( $(this).val().replace(/[^a-zA-Z0-9]/gi,"").toUpperCase() );
});

// 입력폼 영문 + 공백만 입력
$(document).on('keyup','.onlyAlpha', function() {
	$(this).val( $(this).val().replace(/[^a-zA-Z\s+]/gi,"") );
});
$(document).on('focusout','.onlyAlpha', function() {
	$(this).val( $(this).val().replace(/[^a-zA-Z\s+]/gi,"") );
});

// 숫자
$(document).on('keyup','.onlyNumber', function() {
	$(this).val( $(this).val().replace(/[^0-9]/gi,"") );
});
$(document).on('focusout','.onlyNumber', function() {
	$(this).val( $(this).val().replace(/[^0-9]/gi,"") );
});

//숫자제외한 문자입력
$(document).on('keyup','.onlyChar', function() {
	$(this).val( $(this).val().replace(/[0-9]/gi,"") );
});
$(document).on('focusout','.onlyChar', function() {
	$(this).val( $(this).val().replace(/[0-9]/gi,"") );
});

// 휴대폰번호 정규식
$(document).on('focusout','.onlyPhoneNum', function() {
	var regPhone = /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/;
	if(!regPhone.test($(this).val())){
		$(this).val("");
	}
});

var _focusTimeout;
//입력폼[input]에 포커스가 될때 입력값 선택
$(document).on('focus','input, textarea', function() {
    var input = $(this);
    _focusTimeout = setTimeout(function () {
        input.select();
        clearTimeout(_focusTimeout);
    });


    //khskhs 문제시 삭제 : 태블릿 키보드 안가라게 스크롤하는거 textArea, iPad 용 코드 추가 필요 할 것 같음
    try{
        var userAgent = navigator.userAgent.toLowerCase();
        if ((userAgent.search("iphone") > -1) || (userAgent.search("ipod") > -1)
            || (userAgent.search("ipad") > -1))
        {

        }else
        {
            var _this=this;
            setTimeout(function(){
                var offset = $(_this).offset();
                var py = offset.top - $(window).scrollTop();
                if($(window).height()<(py+$(_this).height())){
                    $(window).scrollTop($(window).scrollTop()+py+$(_this).height()-$(window).height()+$(_this).height());
                }
           },500);
        }
    }catch(e){

    }
    //khskhs 문제시 삭제


});
//입력폼[input]에 포커스가 될때 입력값 선택
$(document).ready(function(){
    $("input").focus(function(){
        this.select();
    });

  	var inputs = $("input:text");
   	inputs.each(function(index, item) {

   		var allowChar = $(item).attr("allow-char");

   		if(allowChar == "AN") {
   			// only  IE
   			$(item).attr("style", "ime-mode:disabled")
   			$(item).alphanum();
   		}

   		if(allowChar == "HAN") {
   			$(item).alphanum();
   		}

   		if(allowChar == "A") {
   			// only  IE
   			$(item).attr("style", "ime-mode:disabled")
   			$(item).alpha();
   		}

   		if(allowChar == "N") {
   			$(item).numeric();
   		}
   	});

    //UpperCase치환 함수 document ready Call - Do 2019.04.12 : 문세지 삭제
    dms.string.toUpperCase();
});

(function(window, document, $) {

    'use strict';

    $.ajaxSetup({
        headers:{
            "X-AjaxRequest":"1"
            ,"Client-TimeZone-Offset":-(new Date().getTimezoneOffset())
            ,"Client-Frame-Viewid" : (window.parent._tabMenu ? parent._tabMenu.select().data().viewId : "")
        }
        ,type:'POST'
        ,dataType:'json'
        //,contentType:'application/json'
        //,timeout: 10000
        //,cache:false
        ,beforeSend:function(xhr) {
            //$("#ajaxProcessing").show();
        }
        ,complete:function(xhr, status) {
            //$("#ajaxProcessing").hide();
        }
        ,error: function (xhr, status, errors) {
        }
    });

    $(document).on("mousemove", function(e){
        dms.mouse.X = e.pageX;
        dms.mouse.Y = e.pageY;
    });

    var dms = window.dms? window.dms:{};

    dms.mouse = {
        X:0
        ,Y:0
    };

    dms.uri = {

    		getProtocol : function(){

    			return window.location.protocol;
    		},

    		getHostname : function() {

    			return window.location.hostname;
    		},

    		getPort : function() {

    			return window.location.port;
    		},

    		getUrl : function(url){

    			if (url == undefined) {

    				url = "";
    			}

        		return  dms.uri.getProtocol() + "//" + dms.uri.getHostname() +":" + dms.uri.getPort()  + url;
    		},

    		getExtLinkUrl : function(url){

    			if (url == undefined) {

    				url = "";
    			}

    			var hostName = dms.uri.getHostname();

    			var protocol = dms.uri.getProtocol();
    			if (protocol == "https:") {

        			hostName = hostName.replace("wdmsdms.", "wdmsi.").replace("wdmsi.", "wdmsm.");
    			}

        		return  protocol + "//" + hostName + url;
    		},

    		getPdsLinkUrl : function(extVal1, inlineVal) {

    			var param = {};
    			param.extVal1 = extVal1;

    			var option = {};
    			option.async = false;
    			option.url = dms.uri.getUrl("/cmm/sci/bbs/retrieveOneContentsPdsNewest.do");
    			option.data = JSON.stringify(param)

    			var fileInfo = dms.ajax.getJson(option);
    			var url = '/cmm/sci/fileUpload/link.do?inline=true';

    			if (inlineVal != null && inlineVal == false) {
    				url = '/cmm/sci/fileUpload/link.do?inline=false';
    			}

    			return dms.uri.getUrl(url + '&fileDocNo=' + fileInfo.fileDocNo + '&fileNo=' + fileInfo.fileNo);
    		},
            getPdsLinkUrlSec : function(extVal1, inlineVal) {

                var param = {};
                param.extVal1 = extVal1;

                var option = {};
                option.async = false;
                option.url = dms.uri.getUrl("/cmm/sci/bbs/retrieveOneContentsPdsNewest.do");
                option.data = JSON.stringify(param)

                var fileInfo = dms.ajax.getJson(option);
                var url = '/cmm/sci/fileUpload/'+fileInfo.fileSecKey+'/link.do?inline=true';

                if (inlineVal != null && inlineVal == false) {
                    url = '/cmm/sci/fileUpload/'+fileInfo.fileSecKey+'/link.do?inline=false';
                }

                return dms.uri.getUrl(url);
            },
    		getThumUrl : function(code, value) {

    			var param = {};
    			param[code] = value;

    			var option = {};
    			option.async = false;
    			option.url = dms.uri.getUrl("/cmm/sci/bbs/retrieveOneContentsThumnailNewest.do");
    			option.data = JSON.stringify(param)

    			var fileInfo = dms.ajax.getJson(option);

    			return dms.uri.getExtLinkUrl('/cmm/sci/fileUpload/link.do?inline=true' + '&fileDocNo=' + fileInfo.fileDocNo + '&fileNo=' + fileInfo.fileNo);
    		},
    		getThumUrlSec : function(code, value) {

                var param = {};
                param[code] = value;

                var option = {};
                option.async = false;
                option.url = dms.uri.getUrl("/cmm/sci/bbs/retrieveOneContentsThumnailNewest.do");
                option.data = JSON.stringify(param)

                var fileInfo = dms.ajax.getJson(option);

                return dms.uri.getExtLinkUrl('/cmm/sci/fileUpload'+fileInfo.fileSecKey+'/link.do?inline=true');
            }
    }

    dms.browser = {
            /**
             * 사용자의 브라우저 종류를 확인하여 리턴한다.<br>
             * @return {String} 브라우저 종류
             */
            getBrowserType:function() {
                var userAgent = navigator.userAgent.toLowerCase();

                if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (userAgent.indexOf("msie") != -1) ) {
                    return "msie";
                } else if (userAgent.indexOf("chrome") > -1) {
                    return "chrome";
                } else if (userAgent.indexOf("safari") > -1) {
                    return "safari";
                } else if (userAgent.indexOf("firefox") > -1) {
                    return "firefox";
                } else if (userAgent.indexOf("opera") > -1) {
                    return "opera";
                } else {
                    return "unknown";
                }
            },

            /**
             * 사용자의 브라우저가 MicroSoft Internet Explorer 인지 확인
             * @returns {Boolean}
             */
            isMsie:function() {
                return (this.getBrowserType() == "msie") ? true:false;
            },

            /**
             * 사용자의 브라우저가 Chrome 인지 확인
             * @returns {Boolean}
             */
            isChrome:function() {
                return (this.getBrowserType() == "chrome") ? true:false;
            },

            /**
             * 사용자의 브라우저가 Safari 인지 확인
             * @returns {Boolean}
             */
            isSafari:function() {
                return (this.getBrowserType() == "safari") ? true:false;
            },

            /**
             * 사용자의 브라우저가 Firefox 인지 확인
             * @returns {Boolean}
             */
            isFirefox:function() {
                return (this.getBrowserType() == "firefox") ? true:false;
            },

            /**
             * 사용자의 브라우저가 Opera 인지 확인
             * @returns {Boolean}
             */
            isOpera:function() {
                return (this.getBrowserType() == "opera") ? true:false;
            },

            /**
             * 사용자의 브라우저가 msie, chrome, safari, firefox, opera 중 하나가 아니면 true return
             * @returns {Boolean}
             */
            isUnknown:function() {
                return (this.getBrowserType() == "unknown") ? true:false;
            },

            isMobile:function() {
                var isMobile = false;

                if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
                    isMobile = true;
                }
                return isMobile;
            },

            isTablet:function() {
				var isTablet = false;

				if(navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 0){
					isTablet = true;
				} else {
					isTablet = navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i) ? true : false
				}
                return isTablet;
            }
    };

    dms.notification = {
        notification:null,
        messageTemplate:"<section id=\"template\">" +
                   "<div class=\"k-notification-wrap\">" +
                   "    <h3 class=\"notification_title\">#= title #</h3>" +
                   "    <div class=\"notification_msgBox\">" +
                   "        <p>#= message #</p>" +
                   "    </div>" +
                   "    <span class=\"k-icon k-i-close\">Hide</span>" +
                   "</div>" +
                   "</section>",
        kioskMessageTemplate:"<section id=\"template\">" +
                   "<div class=\"kiosk-notification-wrap\">" +
                   "    <div class=\"notification-symbol\"></div>"+
                   "    <div class=\"notification_msgBox\">" +
                   "        <p class=\"notification_title\">알 림</p>" +
                   "        <p class=\"notification_msg\">#= message #</p>" +
                   "    </div>" +
                   "</div>" +
                   "</section>",

        /**
         * Displays a notification.
         * @param data The string content for the notification; or the object with the values for the variables inside the notification template; or the function, which returns the required string or an object.
         * @param notificationType The notification type. Built-in types include 'info', 'success', 'warning', 'error'
         * @author Kang Seok Han
         * @since 2016. 1. 27.
         * @Modification Information
         * <pre>
         *     since          author              description
         *  ===========    =============    ===========================
         *  2016. 1. 27.     Kang Seok Han     최초 생성
         * </pre>
         */
        show:function(messages, notificationType, options) {

            var msg = "";

            if (typeof messages === "string") {
                msg = messages;
            } else if(typeof messages === "object") {
                $(messages).each(function(idx, error){
                    msg += "<p>" + error.errorMessage + "</p>";
                 });
            } else if(typeof messages === "function") {
                msg = messages.call();
            }

            if (notificationType == "popup") {

                alert(msg);
            } else if (notificationType == "alert") {
                alert(msg);
            } else {


                var settings = {
                    stacking: "up"
                    ,button: true
                    ,position: {
                        bottom: 35,
                        right: 12
                    }
                    ,hideOnClick: false
                    ,autoHideAfter: 3000
                  ,templates: [
                      {type: "info", template: this.messageTemplate}
                      ,{type: "warning", template: this.messageTemplate}
                      ,{type: "error", template: this.messageTemplate}
                      ,{type: "success", template: this.messageTemplate}
                      ,{type: "kiosk", template: this.kioskMessageTemplate}
                  ]
                };

                if(options){
                    $.extend(true, settings, options);
                }

                if(this.notification == null) {
                    var element;

                    if (window.parent) {
                        element = window.parent.$("#globalFooterNotification");
                    } else {
                        element = $("#globalFooterNotification");
                    }

                    this.notification = element.kendoNotification(settings).data("kendoNotification");
                }

                this.notification.show({title:notificationType, message:msg}, notificationType);
            }

        },

        info:function(messages, options) {
            this.show(messages, "info", options);
        },

        success:function(messages, options) {
            this.show(messages, "success", options);
        },

        warning:function(messages, options) {
            this.show(messages, "warning", options);
        },

        error:function(messages, options) {
            this.show(messages, "error", options);
        },
        
        kiosk:function(messages, options) {
            this.show(messages, "kiosk", options);
        }

    };

    dms.window = {

    	open : function(url,  width, height, target) {

    		if (dms.string.isEmpty(width)) {

    			width = 1024;
    		}

    		if (dms.string.isEmpty(height)) {

    			height = 768;
    		}

    		if (dms.string.isEmpty(target)) {

    			target = "_blank";
    		}

    		if (dms.string.isNotEmpty(url) && url.length > 4 && url.substr(0, 4) != "http") {

    			url = dms.uri.getUrl(url);
    		}

    	    window.open(url, target, "toolbar=yes,scrollbars=yes,resizable=yes,width=" + width + ",height=" + height);
    	},

    	reportViewer : function(options,  width, height) {

    		localStorage.setItem('_reportParams', JSON.stringify(options));

    		dms.window.open( "/ozRpt/viewer.do");
    	},

        popup:function(options){
            this.settings = {
                 width:960
                ,height:643
                ,animation:false
                ,draggable:false
                ,visible:false
                ,resizable:false
                ,title:"POPUP"
                ,modal:false
                ,pinned:true
                ,closeBtn:true
                ,content:{
                    data:{
                        "type":"default"
                        ,"autoBind":true
                        ,"selectable":"row"
                        ,"callbackFunc":function(data){
                        }
                    }
                }
                ,iframe:true
                ,deactivate:function() {
					if(!options.modal){
                    	this.destroy();
                    }
                }
                ,open:function(e){
                    //팝업창을 오픈할때 iframe이 로드 될때까지 로딩 이미지를 출력한다.
                    if(e.sender.options.iframe){
						var maxWidth;
                        var iframeLoader = $("<div/>");
                        var background = "#ffffff url('"+_contextPath+"/resources/img/loading-image.gif') no-repeat scroll 50% 50%";
                        if(dms.browser.isMobile()){
							background = "#ffffff url('"+_contextPath+"/resources/mob/css/libs/kendo/Default/loading_2x.gif') no-repeat scroll 50% 50%";
						}

                        if(dms.browser.isTablet()){
							maxWidth = 960;
						}
                        iframeLoader.css({
                            position:"absolute"
                            ,top:0
                            ,left:0
                            ,maxWidth:maxWidth
                            ,width:e.sender.options.width
                            ,height:e.sender.options.height
                            ,background:background
                        });

                        var iframe = $("iframe", e.sender.element);
                        //iframe.hide();

                        iframe.on("load", function(){
                            iframeLoader.remove();
                            const wContent = iframe[0].contentWindow.document.querySelector("body > div > div.window-content");
                            if(wContent && $(wContent).hasClass("bg")){
                                iframe.addClass("gray");
                            }
                            //iframe.show();
                        });

                        iframeLoader.appendTo(e.sender.element);
                    }
                }
            };

            $.extend(true, this.settings, options);

			// 닫기 버튼 사용하지 않을시 esc, x 버튼 사용금지
			if(!this.settings.closeBtn){
		    	// esc 버튼 클릭하여도 팝업창 닫히지 않도록 처리
		    	kendo.ui.Window.fn._keydown = function(originalFn) {
		    	    var KEY_ESC = 27;
		    	    return function(e) {
		    	        if (e.which !== KEY_ESC) {
		    	            originalFn.call(this, e);
		    	        }
		    	    };
		    	}(kendo.ui.Window.fn._keydown);
			}

			var _popupWindowContainer = $("#"+ this.settings.windowId);

			if(!this.settings.modal){
				_popupWindowContainer = $("<div/>");
	            _popupWindowContainer.attr("id", this.settings.windowId);
	            _popupWindowContainer.appendTo("body");
			}

            var _popupWindow = _popupWindowContainer.kendoWindow(this.settings).data("kendoWindow");
            _popupWindow.center().open();


			if(!this.settings.modal){
	            if (window.parent) {
	                //khs 문제시 삭제
	                var _parent = $(window.parent);
	                var _top;
	                if (_parent.height() < originalHeight) {
	                    _top = (originalHeight - _popupWindow.options.height)/2 + _parent.scrollTop() - 40 ;
	                } else {
	                    _top = (_parent.height() - _popupWindow.options.height)/2 + _parent.scrollTop() - 40 ;
	                }
	                //khs 문제시 삭제
	                _popupWindowContainer.closest(".k-window").css({
	                    top: _top, maxWidth: 960
	                });
	            }
			}

			if(!this.settings.closeBtn){
				_popupWindowContainer.parent().find(".k-window-action").css("visibility", "hidden");
			}

            return _popupWindow;
        },
        /**
         * daum postcode API 서비스
         *  On data...

		        zonecode	13494	국가기초구역번호. 2015년 8월 1일부터 시행될 새 우편번호.
		        address	경기 성남시 분당구 판교역로 235	기본 주소 (검색 결과에서 첫줄에 나오는 주소, 검색어의 타입(지번/도로명)에 따라 달라집니다.)
		        addressEnglish	235 Pangyoyeok-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, korea	기본 영문 주소
		        addressType	R/J	검색된 기본 주소 타입: R(도로명), J(지번)
		        userSelectedType	R/J	검색 결과에서 사용자가 선택한 주소의 타입
		        noSelected	Y/N	연관 주소에서 "선택 안함" 부분을 선택했을때를 구분할 수 있는 상태변수
		        userLanguageType	K/E	검색 결과에서 사용자가 선택한 주소의 언어 타입: K(한글주소), E(영문주소)
		        roadAddress	경기 성남시 분당구 판교역로 235	도로명 주소 (지번:도로명 주소가 1:N인 경우에는 데이터가 공백으로 들어갈 수 있습니다.- 아래 autoRoadAddress의 자세한 설명 참고)
		        roadAddressEnglish	235, Pangyoyeok-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, Korea	영문 도로명 주소
		        jibunAddress	경기 성남시 분당구 삼평동 681	지번 주소 (도로명:지번 주소가 1:N인 경우에는 데이터가 공백으로 들어갈 수 있습니다.- 아래 autoJibunAddress의 자세한 설명 참고)
		        jibunAddressEnglish	681, Sampyeong-dong, Bundang-gu, Seongnam-si, Gyeonggi-do, Korea	영문 지번 주소
		        autoRoadAddress	경기 성남시 분당구 판교역로 235	'지번주소'에 매핑된 '도로명주소'가 여러개인 경우, 사용자가 '선택안함' 또는 '지번주소'를 클릭했을 때 연관된 도로명 주소 중 임의로 첫번째 매핑 주소를 넣어서 반환합니다. (autoMapping을 false로 설정한 경우에는 값이 채워지지 않습니다.)
		        autoRoadAddressEnglish	235, Pangyoyeok-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, Korea	autoRoadAddress의 영문 도로명 주소
		        autoJibunAddress	경기 성남시 분당구 삼평동 681	'도로명주소'에 매핑된 '지번주소'가 여러개인 경우, 사용자가 '선택안함' 또는 '도로명주소'를 클릭했을 때 연관된 지번 주소 중 임의로 첫번째 매핑 주소를 넣어서 반환합니다. (autoMapping을 false로 설정한 경우에는 값이 채워지지 않습니다.)
		        autoJibunAddressEnglish	681, Sampyeong-dong, Bundang-gu, Seongnam-si, Gyeonggi-do, Korea	autoJibunAddress의 영문 지번 주소
		        buildingCode	4113510900106810000000001	건물관리번호
		        buildingName	에이치스퀘어 엔동	건물명
		        apartment	Y/N	공동주택 여부 (아파트,연립주택,다세대주택 등)
		        sido	경기	도/시 이름
		        sigungu	성남시 분당구	시/군/구 이름
		        sigunguCode	41135	시/군/구 코드 (5자리 구성된 시/군/구 코드입니다.)
		        roadnameCode	3179025	도로명 코드, 7자리로 구성된 도로명 코드입니다. 추후 7자리 이상으로 늘어날 수 있습니다.
		        bcode	4113510900	법정동/법정리 코드
		        roadname	판교역로	도로명 값, 검색 결과 중 선택한 도로명주소의 "도로명" 값이 들어갑니다.(건물번호 제외)
		        bname	삼평동	법정동/법정리 이름
		        bname1		법정리의 읍/면 이름
		        ("동"지역일 경우에는 공백, "리"지역일 경우에는 "읍" 또는 "면" 정보가 들어갑니다.)
		        bname2	삼평동	법정동/법정리 이름
		        hname	-	행정동 이름, 검색어를 행정동으로 검색하고, 검색결과의 법정동과 검색어에 입력한 행정동과 다른 경우에 표시하고, 데이터를 내립니다.
		        query	판교역로 235	사용자가 입력한 검색어
		        postcode	463-400	구 우편번호 (2015년 8월 1일 이후에는 업데이트가 되지 않습니다.)
		        postcode1	463	구 우편번호 앞 3자리 (2015년 8월 1일 이후에는 업데이트가 되지 않습니다.)
		        postcode2	400	구 우편번호 뒤 3자리 (2015년 8월 1일 이후에는 업데이트가 되지 않습니다.)
		        postcodeSeq	001	구 우편번호 일련번호 (2015년 8월 1일 이후에는 업데이트가 되지 않습니다.)
         **/
        popupPostal:function(options) {

        	var _popupContainer = $("div#"+options.windowId);
        	var  settings;

        	if(dms.browser.isMobile()) {
            	settings = {
               		 width :'300'
               		,height :'100%'
               		,maxSuggestItems :5  // 표현갯수
                    ,theme : {
                        searchBgColor: "#1F263E" //검색창 배경색
                        ,queryTextColor: "#FFFFFF" //검색창 글자색
                    }
       		    };
        	} else {
            	settings = {
                  		 width :'100%'
                  		,height :'100%'
                  		,maxSuggestItems :5  // 표현갯수
                        ,theme : {
                            searchBgColor: "#1F263E" //검색창 배경색
                            ,queryTextColor: "#FFFFFF" //검색창 글자색
                        }
          		};
        	}

        	$.extend(true, settings, options);

        	if (_popupContainer.length == 0) {
        		_popupContainer = $("<div/>", {id : options.windowId})
	    		.css("display", "none")
	    		.css("position", "fixed")
	    		.css("overflow", "hidden")
	    		.css("z-index", "999999")
	    		.css("-webkit-overflow-scrolling", "touch")
	    		.appendTo("body");

	    		$("<img/>", {src : "/resources/images/common/icon/icon_16_close_white.png", id : "btnCloseLayer", onclick : "javascript:dms.window.popupPostalOnClose('"+options.windowId+"');"})
	    		.css("position", "absolute")
	    		.css("right", "0px")
	    		.css("top", "0px")
	    		.css("z-index", "1")
	    		.css("cursor", "pointer")
                .css("width", "1.6rem")
	    		.appendTo(_popupContainer);
        	}

        	try{
				new daum.Postcode(settings).embed(document.getElementById(options.windowId));
			}catch{
				dms.notification.error("주소 API 호출이 되지않았습니다. 앱 종료후 다시 시도해주세요.");
				return;
			}

			//new daum.Postcode(settings).embed(document.getElementById(options.windowId));

            var element_width = 500; //우편번호서비스가 들어갈 element의 width
            var element_height = 470; //우편번호서비스가 들어갈 element의 height

        	if(dms.browser.isMobile()) {
                element_width = 300;
                element_height = 450;
        	}

            var element_borderWidth = 1; //샘플에서 사용하는 border의 두께

        	_popupContainer.css("display", "block").css("width", element_width+"px").css("height", element_height+"px").css("border",element_borderWidth+"px solid")
        					.css("border-color", "#6c747b").css("border-radius", "5px")
				        	.css("left", (((window.innerWidth || document.documentElement.clientWidth) - element_width)/2 - element_borderWidth) + 'px')
				        	.css("top", (((window.innerHeight || document.documentElement.clientHeight) - element_height)/2 - element_borderWidth) + 'px');
        },
        popupPostalOnClose:function(elementId){
        	$("div#"+elementId).css("display", "none");
        },
        popupJuso:function(options){
        	window.selectJusoPopupWin = dms.window.popup({
				windowId:"selectJusoPopupWin"
				,title:"주소 검색"
				,content:{
					url: _contextPath + "/cmm/addr/selectJusoPopup.do"
					, data:{
						"type":1
						,"callbackFunc": function(data){
							options.jusoCallBack(data);
		              		selectJusoPopupWin.close();
		              	}
					}
				}
				,width: options.width || "570px"
				,height: options.height || "500px"
				,pinned: false
				,draggable: true
			});
        },
        /**
         * options.title : 확인창 타이틀(optional)
         * options.message : 확인메세지(required)
         * options.width : 확인창 넓이(optional)
         * options.confirmBtnText : 확인버튼 텍스트(optional)
         * options.cancelBtnText : 취소버튼 텍스트(optional)
         * options.callback : 버튼클릭 콜백 함수(required)
         *
         * dms.window.confirm({
         *     message:"삭제 하시겠습니까?"
         *     ,width:300
         *     ,confirmBtnText:"예"
         *     ,cancelBtnText:"아니오"
         *     ,callback:function(result){
         *         if(result){
         *             //확인버튼 클릭
         *         }else{
         *             //취소버튼 클릭
         *         }
         *     }
         * });
         */
        confirm:function(options){

            var settings = {
                title:dms.settings.defaultMessage.confirmWindowTitle
                ,message:""
                ,width:300
                ,confirmBtnText:dms.settings.defaultMessage.confirmBtnText
                ,cancelBtnText:dms.settings.defaultMessage.cancelBtnText
                ,callback:function(flag){}
                ,modal:true
                ,displayCancelBtn:true
                ,closeBtn:true
            };

            $.extend(true, settings, options);

			// 닫기 버튼 사용하지 않을시 esc, x 버튼 사용금지
			if(!settings.closeBtn){
		    	// esc 버튼 클릭하여도 팝업창 닫히지 않도록 처리
		    	kendo.ui.Window.fn._keydown = function(originalFn) {
		    	    var KEY_ESC = 27;
		    	    return function(e) {
		    	        if (e.which !== KEY_ESC) {
		    	            originalFn.call(this, e);
		    	        }
		    	    };
		    	}(kendo.ui.Window.fn._keydown);
			}

            var kendoWindow = $("<div />").kendoWindow({
                title:settings.title
                ,width:settings.width
                ,resizable:false
                ,modal:settings.modal
            });

            var confirmBtn = "<button class=\"confirm-yes btn btn-small k-button k-primary hide-modal\" style=\"margin-right:10px;\">"+settings.confirmBtnText+"</button>";
            var cancelBtn = "<button class=\"confirm-no btn btn-small k-button k-secondary hide-modal\" style=\"margin-left:10px;\">"+settings.cancelBtnText+"</button>";

            if(!settings.displayCancelBtn){
                cancelBtn = "";
            }

            kendoWindow.data("kendoWindow")
                .content("<p class=\"conform-message\" style=\"margin:20px 10px;text-align:center;\">"+settings.message+"</p><p style=\"text-align:center;margin:20px;\">"+confirmBtn+cancelBtn+"</p>")
                .center()
                .open();

            kendoWindow
                .find(".confirm-yes,.confirm-no")
                .click(function() {
                    var result = false;
                    if ($(this).hasClass("confirm-yes")) {
                        result = true;
                    }
					this.setAttribute("disabled", "disabled");
                    kendoWindow.data("kendoWindow").close();

                    settings.callback(result);
                })
                .end();

			if(!settings.closeBtn){
				kendoWindow.parent().find(".k-window-action").css("visibility", "hidden");
			}
        }
    };

    dms.cookie = {
       setCookie:function(cookieName, cookieValue, expireDays){
           var exdate = new Date();
           exdate.setDate(exdate.getDate() + expireDays);
           document.cookie = cookieName + "=" + escape(cookieValue) + ((expireDays == null)? "":";expires=" + exdate.toGMTString());
       },

       removeCookie:function(cookieName){
           this.setCookie(cookieName, '', -1);
       },

       getCookie:function(cookieName){
            if (document.cookie.length > 0){
                var startIdx = document.cookie.indexOf(cookieName + "=");
                var endIdx;

                if (startIdx != -1) {
                    startIdx = startIdx + cookieName.length + 1;
                    endIdx = document.cookie.indexOf(";", startIdx);

                    if (endIdx == -1) {
                        endIdx = document.cookie.length;
                    }

                    return unescape(document.cookie.substring(startIdx, endIdx));
                }
            }

            return "";
       }
    };

    dms.string = {

        /**
         * String 일 경우 좌우측 여백 삭제
         * Array일 경우 빈 index 삭제 후 재할당
         * @param obj - 넘겨줄 값
         * @returns {Object}
         */
        trim:function(obj) {
            if(typeof obj === "string"){
                return obj.replace(/(^\s*)|(\s*$)/g, "");
            }
            else if(obj.constructor === Array) {
                var param = [];
                var j = 0;
                for(var i=0; i < obj.length; i++){
                    if(dms.string.isNotEmpty(obj[i])){
                        param[j++] = obj[i];
                    }
                }
                return param;
            }
        },

        /**
         * 자열 str 가 null 이거나 "" 이면 defaultStr 그렇지 않다면 str을 반환한다.
         */
        defaultString:function(str, defaultStr){
            if(this.isEmpty(str))  return defaultStr;
            return str;
        },

        /**
         * 문자열 str 가 null 이거나 trim(str) 결과가 "" 와 같다면 true, 아니면 false 를 리턴한다.
         * @param str
         * @returns {Boolean}
         */
        isEmpty:function(str) {

            if (str == undefined || str == null || this.trim(str) == "") {
                return true;
            } else {
                return false;
            }
        },

        /**
         * 문자열 str 가 null 이거나 trim(str) 결과가 "" 와 다르다면 true, 아니면 false 를 리턴한다.
         * @param str
         * @returns {Boolean}
         */
        isNotEmpty:function(str) {
            return !this.isEmpty(str);
        },

        /**
         * 문자열 str 가 null, undefined 일때 ""값을 리턴한다.
         * @param str
         * @returns str
         */
        strNvl:function(str) {
            if (str == undefined || str == null || this.trim(str) == "") {
                return "";
            } else {
                return str;
            }
        },

        /**
         * 언더바 문자열을 카멜 표기법으로 변환
         * 예> var result=dms.string.under2camel('kaudo_ahndoori');
         *     result = 'kaudoAhndoori';
         */
        under2camel:function(str){
            return str.toLowerCase().replace(/(\_[a-z])/g, function(arg)
            {
                return arg.toUpperCase().replace('_', '');
            });
        },

        /**
         * 카멜 표기법을 언더바 문자로 변환
         * 예> var result=dms.string.under2camel('ahndooriKaudo');
         *     result = 'AHNDOORI_KAUDO ';
         */
        camel2under:function(str){
            return str.replace(/([A-Z])/g, function(arg)
            {
                return "_" + arg.toLowerCase();
            }).toUpperCase();
        },

        /**
         * 헥사코드를 RGB 코드로 변환
         * 예> var result=dms.string.hexToRgb('#ffffff').r;
         *     result = '255';
         */
        hexToRgb:function(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            }:null;
        },

        /**
         * RGB 코드를 헥사코드로 변환
         * 예> var result=dms.string.rgbToHex('255','255','255');
         *     result = '#ffffff';
         */
        rgbToHex:function(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        },

        /**
         * 금액 천단위 구분(,) 표시
         * 예> var result=dms.string.addThousandSeparatorCommas(1000000);
         *     result = '1,000,000';
         */
        addThousandSeparatorCommas:function(num) {
       	 	if(typeof num == 'string'){
        		num = num ? num : ''
        	}else if(typeof num == 'undefined' || num === null){
        		num = '0'
        	}
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },

        /**
         * 금액 구분(,) 삭제
         * 예> var result=dms.string.deleteSeparatorCommas(1,000,000);
         *     result = '1000000';
         */
        deleteSeparatorCommas:function(num) {
        	if(typeof num == 'string'){
        		num = num ? num : ''
        	}else if(typeof num == 'undefined' || num === null){
        		num = '0'
        	}
            return num.toString().replace(/,/gi , '');
        },

        /**
         * 금액 구분(,) 삭제
         * 예> var result=dms.string.deleteSeparatorCommasToNumber(1,000,000);
         *     result = 1000000;
         */
        deleteSeparatorCommasToNumber:function(num) {
            return parseInt(num.toString().replace(/,/gi , ''));
        },

        /**
         * 날짜 Format변경(checkDate 함수에서 사용.)
         * 예> var result=dms.string.setDateFormat('2014', '05', '20', 'MMDDYYYY', '/');
         *     result = '05/20/2014';
         */
        setDateFormat: function(y, m, d, format, gb) {
            format = format.split("YYYY").join(y + gb);
            format = format.split("MM").join(m + gb);
            format = format.split("DD").join(d);
            return format.substr(0,10);
        },

        /**
         * 날짜 Validation 체크: Input박스에서 입력된 날짜 값에 대한 Validation 체크
         * 예> var result=dms.string.checkDate(obj, '20150513', 'date', '/', 'MMDDYYYY');
         *     result = '05/13/2015';
         */
        checkDate:function(obj, strings, type, gbn, fmt) {
            var year_data = "",
                month_data = "",
                date_data = "",
                rt_date = "",
                mnthst,
                mnth,
                dy,
                strValue,
                resultObj = {result: true, resultMsg: '', resultArgs: ''},
                i;


            if(dms.string.isEmpty(gbn)){
                gbn = '-';
            }

            if(dms.string.isEmpty(fmt)){
                fmt = 'YYYYMMDD';
            }

            strValue = strings.replace(/[^\d]/g, '');
            for (i = 0; i < 8; i++) {
                var c = strValue.charAt(i);
                if (c < '0' || c > '9') {
                    //alert('날짜형식에 맞는지 확인하세요!');
                    obj.focus();
                    resultObj.result = false;
                    return (resultObj);
                }

                if (i < 4)
                    year_data += c;
                else if (i >= 4 && i < 6)
                    month_data += c;
                else if (i >= 6)
                    date_data += c;
            }

            mnthst = month_data;
            mnth   = parseInt(mnthst, 10);
            dy     = parseInt(date_data);

            if (mnth > 12 || mnth < 1) {
                //alert("날짜가 잘못 입력되었습니다.");
                obj.focus();
                resultObj.result = false;
                return (resultObj);
            }

            if (mnth != 2) {
                if (mnth == 4 || mnth == 6 || mnth == 9 || mnth == 11) {
                    if (dy > 30 || dy < 1) {
                        //alert("날짜가 30일을 초과할수가 없습니다.");
                        var exceedDt = '30';
                        obj.focus();
                        resultObj.result = false;
                        resultObj.resultArgs = exceedDt;
                        return (resultObj);
                    }
                } else if (mnth == 1 || mnth == 3 || mnth == 5 || mnth == 7 || mnth == 8 || mnth == 10 || mnth == 12) {
                    if (dy > 31 || dy < 1) {
                        //alert("날짜가 31일을 초과할수가 없습니다.");
                        var exceedDt = '31';
                        obj.focus();
                        resultObj.result = false;
                        resultObj.resultArgs = exceedDt;
                        return (resultObj);
                    }
                }
            } else {
                var yr1 = parseInt(year_data);
                var leapYrTest = yr1 % 4;
                var maxdy;
                if ((yr1 % 400 == 0) || ((yr1 % 4 == 0) && (yr1 % 100 != 0))) {
                    maxdy = 29;
                } else {
                    maxdy = 28;
                }

                if (dy > maxdy) {
                    //alert("날짜가 " + maxdy + "일을 초과할수가 없습니다.");
                    obj.focus();
                    resultObj.result = false;
                    resultObj.resultArgs = maxdy;
                    return (resultObj);
                }
            }

            if (type === 'date') {
                if(resultObj.result === true){
                    resultObj.resultMsg = this.setDateFormat(year_data, month_data, date_data, fmt, gbn);
                }

                return resultObj;
            } else {

                return (resultObj);
            }
        },

        /**
         * input박스에 숫자만 입력받기
         */
        numberHandler: function(e) {
            var e = e || window.event, keyId = (e.which) ? e.which:e.keyCode;
            if ((keyId >= 48 && keyId <= 57) || (keyId >= 96 && keyId <= 105) || keyId == 35 || keyId == 36 || keyId == 37 || keyId == 39 // 방향키
                    // 좌우,home,end
                    || keyId == 8 || keyId == 46 || keyId == 9 // del, back space,
            // tab
            ) {
                return;
            } else {
                return false;
            }
        },

        /**
         * 왼쪽 채움
         * lpad('1234', '0', 8);     // 00001234
         */
        lpad: function(s, c, n) {
            if (! s || ! c || s.length >= n) {
                return s;
            }

            var max = (n - s.length)/c.length;
            for (var i = 0; i < max; i++) {
                s = c + s;
            }

            return s;
        },

        /**
         * 오른쪽 채움
         * rpad('1234', '0', 8);     // 12340000
         */
        rpad: function(s, c, n) {
            if (! s || ! c || s.length >= n) {
                return s;
            }

            var max = (n - s.length)/c.length;
            for (var i = 0; i < max; i++) {
                s += c;
            }

            return s;
        },

        /**
         * 파일사이즈 포맷
         */
        formatFileSize: function(size){
            if (size < 1024) {
                return size + ' bytes';
            } else if (size < 1024 * 1024) {
                return (size / 1024.0).toFixed(0) + ' KB';
            } else if (size < 1024 * 1024 * 1024) {
                return (size / 1024.0 / 1024.0).toFixed(1) + ' MB';
            } else {
                return (size / 1024.0 / 1024.0 / 1024.0).toFixed(1) + ' GB';
            }
        },

        /**
         *
         */
        parseClipboardDataToExcelFormat:function(){
            var data = [];
            var value = $.trim(window.clipboardData.getData("Text"));

            if(value === "parseClipboardDataToExcelFormat")
                value = "";

            if(!dms.string.isEmpty(value)){
                var rows = value.split("\r\n");

                for(var i=0; i<rows.length; i++) {
                   data[i] = rows[i].split("\t");
                }
            }

            return data;
        },

        /**
         * 문자열의 byte수를 반환한다.
         */
        byteLength:function(s,b,i,c) {
            for(b=i=0; c=s.charCodeAt(i++); b+=c>>11?3:c>>7?2:1);
            return b;
        },

        /**
         * 주민등록번호 검사
         */
        juminNumCheck:function(str) {
			if(dms.string.isEmpty(str)){
				return false;
			} else {
				var s = str.split("-").join('');

				if(s.length != 13){
                    return false;
                }

				if( s.charAt(6) == 1 || s.charAt(6) == 2 || s.charAt(6) == 3 || s.charAt(6) == 4) {
					if( s.charAt(12) == (( 11 - ((s.charAt(0)*2+s.charAt(1)*3+s.charAt(2)*4
							 +s.charAt(3)*5+s.charAt(4)*6+s.charAt(5)*7
							 +s.charAt(6)*8+s.charAt(7)*9+s.charAt(8)*2
							 +s.charAt(9)*3+s.charAt(10)*4+s.charAt(11)*5)
							% 11)))%10)
					return true;
				}
				return false;
			}
        },

        /**
         * 외국인등록번호 검사
         */
        frgnrNumCheck:function(str) {
			if(dms.string.isEmpty(str)){
				return false;
			} else {
				var rn = str.split("-").join('');

			    // 검증값 합계
			    var checkSum = 0;
			    for(var i=0; i<12; i++) checkSum += ((rn.substr(i,1)>>0)*((i%8)+2));

			    // 검증
			    var modCheckSum = checkSum%11;    // 검증값 합계의 11의 나머지수
			    var frnMatch = (13-(modCheckSum))%10 == rn.substr(12,1);    // 외국인번호 검증

			    return frnMatch;
			}
        },

        /**
         * 문자열의 HTML 문자를 치환한다.
         */
        htmlEscape:function(str) {
			if(dms.string.isEmpty(str)){
				return "";
			} else {
	            return str
	                .replace(/&/g, '&amp;')
	                .replace(/"/g, '&quot;')
	                .replace(/'/g, '&#39;')
	                .replace(/</g, '&lt;')
	                .replace(/>/g, '&gt;');
			}
        },

        /**
         *
         */
        htmlUnescape:function(str){
			if(dms.string.isEmpty(str) || typeof str !== "string"){
				return "";
			} else {
	            return str
	                .replace(/&amp;/g, '&')
	                .replace(/&quot;/g, '"')
	                .replace(/&#39;/g, "'")
	                .replace(/&lt;/g, '<')
	                .replace(/&gt;/g, '>')
	                .replace(/&times;/g,'×')
	                .replace(/&rsquo;/g,'’');
			}
        },

        /**
        * mail 형식 validator
        */
        isValidEmail:function(str) {
        	//var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        	var regExp = /^([0-9a-zA-Z_\.-]+)@[0-9a-zA-Z]([-.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/;
        	if (str.match(regExp) != null) {
        	    return true;
        	  } else {
        		 return false;
        	  }
        },

        isValidPasswd:function(str) {
			var regExp = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&#()])[A-Za-z\d@$!%*?&#()]{10,16}$/;
			if(!regExp.test(str)) {
			    return false;
			} else {
				return true;
			}
		},
        /**
         * 대문자 치환함수
         */
        toUpperCase:function(){
        	var classSelector = document.getElementsByClassName("form_uppercase");

    		for(var i = 0; i < classSelector.length; i++){
    			classSelector[i].addEventListener("keyup", function(){
    				if (this.value != undefined) {
    					this.value = this.value.toUpperCase();
    				}
    			});
    		}
        },

        setValidDate: function(g, s, e) {
        	var grid = $("#"+g).data("kendoExtGrid");
        	var data = grid.dataSource.data();
    		var dataRows = grid.items();
    		var rowIndex = dataRows.index(grid.select()); // 현재 클릭된 그리드의 row index

    		var sDate = data[rowIndex][s];
    		var eDate = data[rowIndex][e];

    		if(!dms.string.isEmpty(sDate) && !dms.string.isEmpty(eDate)){
    			if(sDate > eDate){
    				var year = eDate.getFullYear();              //yyyy
    				var month = (1 + eDate.getMonth());          //M
    				month = month >= 10 ? month : '0' + month;   //month 두자리로 저장
    				var day = eDate.getDate();                   //d
    				day = day >= 10 ? day : '0' + day;           //day 두자리로 저장
    				var date = year + '-' + month + '-' + day;   //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
    				data[rowIndex][s] = date;
    				grid.refresh();
    			}
    		}
        },

        setHpNo:function(str){
        	var regExp = '';
        	var rtnVal = '';
        	var strVal = str ? str : '';

        	regExp = /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/;
        	rtnVal = strVal.replace(regExp, '$1-$2-$3');
        	return rtnVal;
        },

        formatHpNo:function(str){
        	var rtnVal = '';

        	if(dms.string.isNotEmpty(str)){
				if(str.length == 11){
					rtnVal = str.substring(0,3)+"-"+str.substring(3,7)+"-"+str.substring(7,11);
				}else if(str.length == 10){
					if(str.substring(0,2) == "02"){
						rtnVal = str.substring(0,2)+"-"+str.substring(2,6)+"-"+str.substring(6,10);
					}else{
						rtnVal = str.substring(0,3)+"-"+str.substring(3,6)+"-"+str.substring(6,10);
					}
				}else if (str.length == 9){
					rtnVal = str.substring(0,2)+"-"+str.substring(2,5)+"-"+str.substring(5,9);
				}else{
					rtnVal = str.substring(0,4)+"-"+str.substring(4,8);
				}
			}

        	return rtnVal;
        }
    };

    dms.date = {
        isValidPeriod:function(fromDate, toDate, errorCallback){

            if(fromDate == null || toDate == null){
                return true;
            }

            if(typeof fromDate != typeof toDate){
                return false;
            }

            if(fromDate > toDate){

                return false;
            }

            return true;
        }
        ,getDateString:function (dayStr) {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1;
            var yyyy = today.getFullYear();
            return dayStr ? yyyy +'-'+ mm +'-'+ dayStr : yyyy +'-'+ mm +'-'+ dd;
        }
        ,getDateFormat:function(dateStr){
        	var yyyy = dateStr.substr(0,4);
        	var mm = dateStr.substr(4,2);
        	var dd = dateStr.substr(6,2);
        	return yyyy +'-'+ mm +'-'+ dd;
        }
        /**
         * 법인정보 목록을 반환한다.
         *
         * @param async 동기/비동기 여부 true 인 경우 비동기, false 인 경우 동기호 호출한다.
         * @params sCoCd 법인코드
         * @params sCoNm 법인명
         * @return 법인정보 목록
         */

    };

    dms.idGen = {
        rand : Math.floor(Math.random() * 26) + Date.now()
        ,getId : function(){
            return this.rand++;
        }
    };

    dms.resize = {
        tabContentIframResize:function(){
            try {
                var tabIframe = jQuery(parent.document).find("iframe[name=tabContentIframe]");

                if(tabIframe.length > 0) dms.resize.iFrameResize(tabIframe);
            } catch(e) {}
        },

        iFrameResize:function(target){
            var iframe = jQuery(target);

            try{
                iframe.contents().height();
            }catch(error)
            {
                iframe.height(600);
                return;
            }

            var windowHeight = jQuery(window).height();
            var conHeight = iframe.contents().height();

                iframe.height(conHeight+20);

            return conHeight;
        }
    };

    dms.loading = {
        show:function(target, backgroundColor){

            var cssObj = {
                top:0
                ,left:0
                ,width:"100%"
                ,height:"100%"
                ,zIndex:50000
                ,position:"fixed"
            };

            if(target === "undefined" || target == null){
                target = $("body")[0];

                if(backgroundColor){
                    cssObj.backgroundColor = backgroundColor;
                }
            }else{
                var position = target.position();
                cssObj.top = position.top;
                cssObj.left = position.left;

                if(target.css("width")){
                    cssObj.width = target.css("width");
                }else{
                    cssObj.width = target.innerWidth();
                }

                if(target.css("height")){
                    cssObj.height = target.css("height");
                }else{
                    cssObj.height = target.innerHeight();
                }

                if(backgroundColor){
                    cssObj.backgroundColor = backgroundColor;
                }
                cssObj.position = "absolute";
            }

            $("<div/>").appendTo(target)
                .css(cssObj)
                .addClass("k-loading-mask")
                .addClass("dms-loading-mask")
                .append("<span class=\"k-loading-text\">Loading...</span>")
                .append("<div class=\"k-loading-image\"></div>")
                .append("<div class=\"k-loading-color\"></div>");
        },
        hide:function(target) {
            if(target === "undefined" || target == null){
                target = $("body")[0];
            }

            $(target).find("div.dms-loading-mask").remove();
        },
        gridNoData:function(gridId, msg) {
            var grid = $("#"+gridId).data("kendoGrid");
            if (grid.dataSource.data().length === 0) {
                dms.loading.appendNoDataDiv($("#"+gridId+" div.k-grid-content"), msg);
            }else{
                dms.loading.removeNoDataDiv($("#"+gridId+" div.k-grid-content"));
            }
        },
        appendNoDataDiv:function($target, msg) {
            $('<div class=\"empty-grid\" style=\"width:auto;\">'+msg+'<div/>').appendTo($target);

            var left  = $target.innerWidth()/2-77;
            if(left < 0){
                left = 5;
            }
            $target.find("div.empty-grid").css({position:"absolute", left:left, top:$target.innerHeight()/2-8, width:"auto", height:"auto"});
        },
        removeNoDataDiv:function($target) {
            $target.find("div.empty-grid").remove();
        }
    };

    dms.ajax = {
        getJson:function(settings) {
            this.options = {
                type:"post"
                ,dataType:"json"
                ,contentType:"application/json"
                ,async:true
            };

            $.extend(true, this.options, settings);
            var responseText = $.ajax(this.options).responseText;
            return responseText ? $.parseJSON(responseText) : "";
        },

        excelExport:function(params) {

            var excelExportId = dms.idGen.getId();
            var queryString = "excelExportId="+excelExportId;

            $.each(params, function(key, value){
                queryString += "&" + key + "=" + encodeURIComponent(value);
            });

            dms.loading.show();

            location.href = _contextPath + "/cmm/sci/excelDownload.do?" + queryString;

            var interval = setInterval(function(){
                $.ajax({
                    url:_contextPath + "/cmm/sci/excelDownloadStatus.do?excelExportId="+excelExportId
                    ,type:'GET'
                    ,dataType:'json'
                    ,error:function(jqXHR, status, error) {
                        clearInterval(interval);
                        dms.loading.hide();
                    }
                    ,success:function(jqXHR, textStatus) {
                        if(jqXHR.status != 1 && jqXHR.status != 2){
                            clearInterval(interval);
                            dms.loading.hide();
                        }
                    }
                });
            }, 500);
        },

        excelExportByPoi:function(params) {

            var excelExportId = dms.idGen.getId();
            var queryString = "excelExportId="+excelExportId;
			var url = _contextPath + "/cmm/sci/excelDownloadByPoi.do?" + queryString;

            $.each(params, function(key, value){
                queryString += "&" + key + "=" + encodeURIComponent(value);
            });

            dms.loading.show();

		    $.fileDownload(url, {
				httpMethod: "post",
		      	data: params,
		      	successCallback: function() {
		        	dms.loading.hide();
		      	},
		      	failCallback: function() {
		        	dms.loading.hide();
		        	return false;
		      	}
		    });
        }
    };

    dms.data = {

        /**
         * 배열을 맵으로 변환한다.
         * @param arr 배열
         * @param keyNameHandler 맵의 키값을 반환하는 펑션
         * ex) dms.data.arrayToMap(arr, function(obj){ return obj.cmmCd; })
         */
        arrayToMap:function(arr, keyNameHandler){
            var result = arr.reduce(function(map, obj){
                map[keyNameHandler(obj)] = obj;
                return map;
            }, {});

            return result;
        },

        arrayFilter:function(arr, callback) {
           return arr.filter(callback);
        },

        cmmCdFilter:function(arr) {
           return this.arrayFilter(arr, function(element, index, array){
               return element.useYn !== "N";
           });
        },

        /**
		 * 유저 그룹코드에 해당하는 코드 목록을 반환한다.
		 * ex) dms.data.getUsrCodeList(true, grpCd)
		 * 	   dms.data.getUsrCodeList(true, grpCd, false);
		 *
		 * @param async 동기/비동기 여부 true 인 경우 비동기, false 인 경우 동기호 호출한다.
		 * @param grpCd 유저 그룹 코드
		 * @param isAppendEmptyData 빈데이터 적용 여부 true면 빈 데이터를 첫번재 목록에 추가하고 false 면 빈 데이터를 목록에 추가 하지 않는다.
		 * @param isAll 전체데이터 조회 여부 true 인 경우 사용여부 구분 없이 목록을 조회하고 false 인 경우 사용여부가 'Y' 인 목록만을 조회한다.
		 * @return [
		 * 	{"userCdGrp":"UHN001","userCd":"01","userCdNm":"영업","useYn":"Y","orderBy":4,"remark1":"","note2":"","note3":"","note4":"","note5":""}
		 * ]
		 */
		getUsrCodeList : function(async, grpCd, isAppendEmptyData, isAll){
			isAppendEmptyData = dms.string.isEmpty(isAppendEmptyData)? false:isAppendEmptyData;
			isAll = dms.string.isEmpty(isAll)? false:isAll;
			var useYn = isAll? "":"Y";

			var response = $.ajax({
				url : _contextPath + "/cmm/sci/commonCode/selectCommonCodes.do",
				data: "{\"sCmmGrpCd\":\"" + grpCd + "\", \"sUseYn\":\"" + useYn + "\", \"includeRootCodeYn\":\"N\"}",
		        type: "POST",
		        dataType : "json",
		        contentType : "application/json",
		        async : async
			}).responseText;

			if(isAppendEmptyData){
				return [{"cmmGrpCd":grpCd,"cmmCd":"","cmmCdNm":"","useYn":"Y","sortOrder":0,"remark1":"","remark2":"","remark3":"","remark4":"","remark5":"","remark6":"","remark7":"","remark8":"","remark9":"","remark10":""}].concat($.parseJSON(response).data);
			}

			return $.parseJSON(response).data;
		},

		/**
		 * 시스템 그룹코드에 해당하는 코드 목록을 반환한다.
		 * ex) dms.data.getSysCodeList(true, grpCd);
		 * 	   dms.data.getSysCodeList(true, grpCd, false);
		 *
		 * @param async 동기/비동기 여부 true 인 경우 비동기, false 인 경우 동기호 호출한다.
		 * @param grpCd 시스템 그룹 코드
		 * @param isAppendEmptyData 빈데이터 적용 여부 true 인 경우 빈 데이터를 첫번재 목록에 추가하고 false 인 경우 빈 데이터를 목록에 추가 하지 않는다.
		 * @param isAll 전체데이터 조회 여부 true 인 경우 사용여부 구분 없이 목록을 조회하고 false 인 경우 사용여부가 'Y' 인 목록만을 조회한다.
		 * @return [
		 * 	{"sysCdGrp":"SCM010","sysCd":"01","sysCdNm":"판매처","useYn":"Y","orderBy":1,"remark1":"","note2":"","note3":"","note4":"","note5":""}
		 * ]
		 */
		getSysCodeList : function(async, grpCd, isAppendEmptyData, isAll){
			isAppendEmptyData = dms.string.isEmpty(isAppendEmptyData)? false:isAppendEmptyData;
			isAll = dms.string.isEmpty(isAll)? false:isAll;

			var useYn = isAll? "":"Y";

			var response = $.ajax({
				url : _contextPath + "/cmm/sci/commonCode/selectCommonCodes.do",
		        data: "{\"sCmmGrpCd\":\"" + grpCd + "\", \"sUseYn\":\"" + useYn + "\", \"includeRootCodeYn\":\"N\"}",
		        type: "POST",
		        dataType : "json",
		        contentType : "application/json",
		        async : async
			}).responseText;

			if(isAppendEmptyData){
				return [{"cmmGrpCd":grpCd,"cmmCd":"","cmmCdNm":"","useYn":"Y","sortOrder":0,"remark1":"","remark2":"","remark3":"","remark4":"","remark5":"","remark6":"","remark7":"","remark8":"","remark9":"","remark10":""}].concat($.parseJSON(response).data);
			}

			return $.parseJSON(response).data;
		},

		/**
		 * 지점 목록 반환
		 *
		 * @param async 동기/비동기 여부 true 인 경우 비동기, false 인 경우 동기호 호출한다.
		 * @param sCoCd 법인코드
		 * @param bizAreaCd 사업장 코드
		 * @return pltCd, pltNm 목록 반환
		 * ex) dms.data.getPltCdList(false , "${loginCoCd}", "${loginBizAreaCd}", true);
		 */
		getPltCdList : function(async, sCoCd, sBizAreaCd, isAppendEmptyData){

			isAppendEmptyData = dms.string.isEmpty(isAppendEmptyData)? false:isAppendEmptyData;

			var params = {"sCoCd":"", "sBizAreaCd":""};

			if(sCoCd){
				params["sCoCd"] = sCoCd;
			}

			if(sBizAreaCd){
				params["sBizAreaCd"] = sBizAreaCd;
			}

			var response = $.ajax({
				url : _contextPath + "/cmm/plt/mst/selectPlantList.do",
				data: JSON.stringify(params),     //파라미터
				type: 'POST',			//조회요청
				dataType : 'json',		//json 응답
				contentType : 'application/json',//문자열 파라미터
				async: async
			}).responseText;

			if(isAppendEmptyData){
				return [{"pltCd":"","pltNm":""}].concat($.parseJSON(response));
			}


			return $.parseJSON(response);

		},
		/**
		 * 시스템 코드에 해당하는 코드 목록을 반환한다.
		 * ex) dms.data.getMultiSysCode(grpCd, initFlag, valueField, textField)
		 *
		 * @param async 동기/비동기 여부 true 인 경우 비동기, false 인 경우 동기호 호출한다.
		 * @param grpCd 시스템 그룹 코드
		 * @param initFlag DropDownList의 ""의 사용여부.(기본 false)
		 * @param valueField value값으로 사용될 필드(undefinded시 기본 sysCd)
		 * @param textField text값으로 사용될 필드(undefinded시 기본 sysCdNm)
		 * @return rtnObj.list = [{"sysCdGrp":"SCM010","sysCd":"01","sysCdNm":"판매처","useYn":"Y","orderBy":1,"note1":"","note2":"","note3":"","note4":"","note5":""},
		 * 							{"sysCdGrp":"SCM010","sysCd":"02","sysCdNm":"구매처","useYn":"Y","orderBy":2,"note1":"","note2":"","note3":"","note4":"","note5":""}
		 * 							];
		 * 			rtnObj.array["01"] = "판매처"; rtnObj.array["02"] = "구매처";
		 *
		 * 			rtnObj.list 는 DropDownList 또는 Grid 각 셀의 Editor에 쓰이는 DropDownList에서 사용.
		 * 			rtnObj.array는 Grid의 Template에 키값대신 Text값을 화면에 보여줄때 사용.
		 */
		getMultiSysCode : function(async, grpCd, initFlag, valueField, textField, isAll){
			var rtnObj = {};
			var array = [];
			initFlag = dms.string.isEmpty(initFlag)? false:initFlag;
			valueField = dms.string.isEmpty(valueField)? "sysCd":valueField;
			textField = dms.string.isEmpty(textField)? "sysCdNm":textField;

			var data = dms.data.getSysCodeList(async, grpCd, initFlag, isAll);

			$.each(data, function(idx, item){
				array[item[valueField]] = item[textField];
			});

			rtnObj.list = data;
			rtnObj.array = array;
			return rtnObj;
		},/**
		 * 유저 코드에 해당하는 코드 목록을 반환한다.
		 * ex) dms.data.getMultiUsrCode(grpCd, initFlag, valueField, textField)
		 *
		 * @param async 동기/비동기 여부 true 인 경우 비동기, false 인 경우 동기호 호출한다.
		 * @param grpCd 시스템 그룹 코드
		 * @param initFlag DropDownList의 ""의 사용여부.(기본 false)
		 * @param valueField value값으로 사용될 필드(undefinded시 기본 userCd)
		 * @param textField text값으로 사용될 필드(undefinded시 기본 userCdNm)
		 * @return rtnObj.list = [{"userCdGrp":"UCM022","userCd":"01","userCdNm":"현금","useYn":"Y","orderBy":1,"note1":"","note2":"","note3":"","note4":"","note5":""},
		 * 						   {"userCdGrp":"UCM022","userCd":"02","userCdNm":"신용카드","useYn":"Y","orderBy":2,"note1":"","note2":"","note3":"","note4":"","note5":""},
		 * 						   {"userCdGrp":"UCM022","userCd":"03","userCdNm":"예금이체","useYn":"Y","orderBy":3,"note1":"","note2":"","note3":"","note4":"","note5":""}
		 * 							];
		 * 			rtnObj.array["01"] = "현금"; rtnObj.array["02"] = "신용카드"; rtnObj.array["03"] = "예금이체";
		 *
		 * 			rtnObj.list 는 DropDownList 또는 Grid 각 셀의 Editor에 쓰이는 DropDownList에서 사용.
		 * 			rtnObj.array는 Grid의 Template에 키값대신 Text값을 화면에 보여줄때 사용.
		 */
		getMultiUsrCode : function(async, grpCd, initFlag, valueField, textField, isAll){
			var rtnObj = {};
			var array = [];
			valueField = dms.string.isEmpty(valueField)? "userCd":valueField;
			textField = dms.string.isEmpty(textField)? "userCdNm":textField;
			initFlag = dms.string.isEmpty(initFlag)? false:initFlag;
			var data = dms.data.getUsrCodeList(async, grpCd, initFlag, isAll);

			$.each(data, function(idx, item){
				array[item[valueField]] = item[textField];
			});

			rtnObj.list = data;
			rtnObj.array = array;
			return rtnObj;
		}

		/**
		 * 법인정보 목록을 반환한다.
		 *
		 * @param async 동기/비동기 여부 true 인 경우 비동기, false 인 경우 동기호 호출한다.
		 * @params sCoCd 법인코드
		 * @params sCoNm 법인명
		 * @return 법인정보 목록
		 */
		,getCoCdList : function(async, sCoCd, sCoNm){
			var params = {"sCoCd":"", "sCoNm":""};
			if(sCoCd){
				params["sCoCd"] = sCoCd;
			}

			if(sCoNm){
				params["sCoNm"] = sCoNm;
			}
			//존재하면 검색
			var response = $.ajax({
				url : _contextPath + "/cmm/cpy/master/list.do",
		        data: JSON.stringify(params),
		        type: "POST",
		        dataType : "json",
		        contentType : "application/json",
		        async: async
			}).responseText;
			return $.parseJSON(response);
		}
		/**
		 * 법인에 속하는 사업장정보 목록을 반환한다.
		 *
		 * @param async 동기/비동기 여부 true 인 경우 비동기, false 인 경우 동기호 호출한다.
		 * @params sCoCd 법인코드
		 * @return 사업장 정보 목록
		 */
		,getBizAreaCdList : function(async, sCoCd){

			//TODO 사업장정보 조회 파라메터 coCd -> sCoCd로 변경 필요
			var params = {"sCoCd":sCoCd};

			var response = $.ajax({
				url : _contextPath + "/common/businessArea/master/list.do",
		        data: JSON.stringify(params),
		        type: "POST",
		        dataType : 'json',
		        contentType : 'application/json',
		        async: async
			}).responseText;
			return $.parseJSON(response);
		}

		/**
		 * 창고 목록
		 * @param async 동기/비동기 여부 true 인 경우 비동기, false 인 경우 동기호 호출한다.
		 * @param sCorpCd 플랜트코드 , sStrgCd 창고코드
		 * @table CMM_STRG
		 * @return :"sCorpCd":"P01","pltNm":"","strgeCd":"WH01","strgeNm":"완성차창고","locatCd":"L01","locatNm":"1층","coCd":"1000","bizAreaCd":"100"
		 * ex) dms.data.getLocationList(false,sCorpCd,sStrgCd)
		 */
		,getStrgeList : function(async,sCorpCd,sStrgCd){
			var params = {"sCorpCd":"", "sStrgCd":""};
			if(sCorpCd){
				params["sCorpCd"] = sCorpCd;
			}

			if(sStrgCd){
				params["sStrgCd"] = sStrgCd;
			}

			var response = $.ajax({
				url : _contextPath + "/cmm/com/strg/selectStrg.do",
				data: JSON.stringify(params),
				type: 'POST',
				dataType : 'json',
				contentType : 'application/json',
				async: async
			}).responseText;
			return $.parseJSON(response);

		}

		/**
		 * 로게이션 목록
		 * @param async 동기/비동기 여부 true 인 경우 비동기, false 인 경우 동기호 호출한다.
		 * @param sPltCd 플랰트코드 sStrgeCd 창고코드 sLocatCd 로케이션코드
		 * @table cm_006
		 * @return :"pltCd":"P01","pltNm":"","strgeCd":"WH01","strgeNm":"완성차창고","locatCd":"L01","locatNm":"1층","coCd":"1000","bizAreaCd":"100"
		 * ex) dms.data.getLocationList(false,sPltCd,sStrgeCd,sLocatCd)
		 */
		,getLocationList : function(async,sPltCd,sStrgeCd,sLocatCd){
			var params = {"sPltCd":"", "sStrgeCd":"", "sLocatCd":""};
			if(sPltCd){
				params["sPltCd"] = sPltCd;
			}

			if(sStrgeCd){
				params["sStrgeCd"] = sStrgeCd;
			}

			if(sLocatCd){
				params["sLocatCd"] = sLocatCd;
			}
			var response = $.ajax({
				url : _contextPath + "/parts/location/locationMasterList.do",
				data: JSON.stringify(params),
				type: 'POST',
				dataType : 'json',
				contentType : 'application/json',
				async: async
			}).responseText;
			return $.parseJSON(response);

		},

    };

    dms.format = {

   		date : function(strDate){

   			if(dms.string.isEmpty(strDate)) {
   				return "";
   			}
   			return strDate.substr(0, 4) + "-" + strDate.substr(4, 2) + "-" + strDate.substr(6, 2);
   		},

        currency: function(amt, currencyCode, isDisplaySymbol){
            var currencyObj;
            var currencyFormat;

            if (typeof currencyCode === "undefined" || currencyCode === null) {
                currencyCode = dms.settings.defaultCurrency;
            }
            if (typeof isDisplaySymbol === "undefined" || isDisplaySymbol === null) {
                isDisplaySymbol = false;
            }

            currencyCode = currencyCode.toUpperCase();

            if(dms.settings.currency[currencyCode]){
                currencyObj = dms.settings.currency[currencyCode];
            }else{
                currencyObj = dms.settings.currency[dms.settings.defaultCurrency];
            }

            if(currencyObj.decimals == 0){
                currencyFormat = kendo.format("\#{0}\#\#\#", currencyObj.numberSymbol);
            }else{
                currencyFormat = kendo.format("\#{0}\#\#\#{1}{2}", currencyObj.numberSymbol, currencyObj.decimalSymbol, dms.string.lpad('0', '0', currencyObj.decimals));
            }

            if(isDisplaySymbol){
                if(currencyObj.position == "P"){
                    return kendo.format("{0}{1:"+currencyFormat+"}", currencyObj.symbol, amt);
                }else{
                    return kendo.format("{0:"+currencyFormat+"}{1}", amt, currencyObj.symbol);
                }
            }

            return kendo.format("{0:"+currencyFormat+"}", amt);
        },

        currencyFormat: function(currencyCode){
            var currencyObj;
            var currencyFormat;

            if (typeof currencyCode === "undefined" || currencyCode === null) {
                currencyCode = dms.settings.defaultCurrency;
            }

            currencyCode = currencyCode.toUpperCase();

            if(dms.settings.currency[currencyCode]){
                currencyObj = dms.settings.currency[currencyCode];
            }else{
                currencyObj = dms.settings.currency[dms.settings.defaultCurrency];
            }

            if(currencyObj.decimals == 0){
                currencyFormat = kendo.format("\#{0}\#\#\#", currencyObj.numberSymbol);
            }else{
                currencyFormat = kendo.format("\#{0}\#\#\#{1}{2}", currencyObj.numberSymbol, currencyObj.decimalSymbol, dms.string.lpad('0', '0', currencyObj.decimals));
            }

            return currencyFormat;
        }
    };

    dms.fileManager = {
        downloadImgDoc:function(fileDocNo, fileNo, downloadDocType="cmm"){
            location.href = _contextPath + "/cmm/sci/fileUpload/download.do?fileDocNo=" + fileDocNo + "&fileNo=" + fileNo+ "&downloadDocType=" + downloadDocType;
        }
        ,download:function(fileDocNo, fileNo, downloadDocType="cmm"){
            if(!dms.fileManager.exist(fileDocNo, fileNo, downloadDocType)){
                dms.notification.error(dms.settings.defaultMessage.fileNotFound);
                return;
            }

            location.href = _contextPath + "/cmm/sci/fileUpload/link.do?fileDocNo=" + encodeURIComponent(fileDocNo) + "&fileNo=" + fileNo+ "&downloadDocType=" + downloadDocType;
        }
        ,preview:function(fileDocNo, fileNo, popupWidth, popupHeight, popupTitle){
            if(!dms.fileManager.existSec(fileDocNo, fileNo)){
                dms.notification.error(dms.settings.defaultMessage.fileNotFound);
                return;
            }

            var title = popupTitle || dms.settings.defaultMessage.preview;
            var width = popupWidth || 950;
            var height = popupHeight || 500;

            dms.window.popup({
                windowId:"filePreviewPopup"
                ,width:width
                ,height:height
                ,title:title
                ,modal:true
                ,content:{
                    url:_contextPath + "/cmm/sci/fileUpload/link.do?fileDocNo=" + fileDocNo + "&fileNo=" + fileNo + "&inline=true"
                }
            });
        }
        ,exist:function(fileDocNo, fileNo, downloadDocType="cmm"){
            var result = false;
            $.ajax({
                url:_contextPath + "/cmm/sci/fileUpload/selectExistFile.do?"+"fileDocNo="+fileDocNo+"&fileNo="+fileNo+ "&downloadDocType=" + downloadDocType
                ,type:'GET'
                ,async:false
                ,error:function(jqXHR, status, error) {
                }
                ,success:function(data, textStatus, jqXHR) {
                    result = data;
                }
            });

            return result;
        }
        ,downloadSec:function(fileSecKey){
            if(!dms.fileManager.existSec(fileSecKey)){
                dms.notification.error(dms.settings.defaultMessage.fileNotFound);
                return;
            }

            location.href = _contextPath + '/cmm/sci/fileUpload/'+fileSecKey+'/link.do';
        }
        ,previewSec:function(fileSecKey, popupWidth, popupHeight, popupTitle){
             if(!dms.fileManager.exist(fileDocNo, fileNo)){
                 dms.notification.error(dms.settings.defaultMessage.fileNotFound);
                 return;
             }

             var title = popupTitle || dms.settings.defaultMessage.preview;
             var width = popupWidth || 950;
             var height = popupHeight || 500;

             dms.window.popup({
                 windowId:"filePreviewPopup"
                 ,width:width
                 ,height:height
                 ,title:title
                 ,modal:true
                 ,content:{
                     url:_contextPath + "/cmm/sci/fileUpload/"+fileSecKey+"/link.do?inline=true"
                 }
             });
         }
        ,existSec:function(fileSecKey){
             var result = false;
             $.ajax({
                 url:_contextPath + "/cmm/sci/fileUpload/selectExistFileSec.do?fileSecKey="+fileSecKey
                 ,type:'GET'
                 ,async:false
                 ,error:function(jqXHR, status, error) {
                 }
                 ,success:function(data, textStatus, jqXHR) {
                     result = data;
                 }
             });

             return result;
         }
        ,extention:function(fileName){
			var ext = fileName.split('.').pop().toLowerCase();
 			if($.inArray(ext, ["gif","jpg","jpeg","png"]) > 0) {
          		return "img";
        	} else if ($.inArray(ext, ["xls","xlsx"]) > 0) {
				return "excel";
			} else if ($.inArray(ext, ["ppt","pptx"]) > 0) {
				return "ppt";
			} else if ($.inArray(ext, ["pdf"]) > 0) {
				return "pdf";
			} else if ($.inArray(ext, ["doc","docx","txt","hwp"]) > 0) {
				return "word";
			} else if ($.inArray(ext, ["7z","alz","zip","rar"]) > 0) {
				return "zip";
			} else if ($.inArray(ext, ["avi","wmv","mpeg","mpg","mkv","mp4","mov","swf","flv","mp3"]) > 0) {
				return "mov";
			} else {
				return "";
			}
		}
    };

    dms.utils = {

   	    getParam : function(key) {

   	    	var val = localStorage.getItem(key);

   	    	if (val == undefined) {

   	    		val = "";

   	    	} else {

   	    		val = JSON.parse(val);

   	    		localStorage.removeItem(key);
   	    	}

   			return val;
   	    },

   	    setParam :  function(key, value) {

   	    	if (dms.string.isEmpty(key) || dms.string.isEmpty(value)) {
   	    		return;
   	    	}

   	    	localStorage.setItem(key, JSON.stringify(value));
   	    },

        // Copies a string to the clipboard. Must be called from within an
        // event handler such as click. May return false if it failed, but
        // this is not always possible. Browser support for Chrome 43+,
        // Firefox 42+, Safari 10+, Edge and IE 10+.
        // IE: The clipboard feature may be disabled by an administrator. By
        // default a prompt is shown the first time the clipboard is
        // used (per session).
        copyToClipboard:function(text) {
            if(window.clipboardData && window.clipboardData.setData){
                // IE specific code path to prevent textarea being shown while dialog is visible.
                return clipboardData.setData("Text", text);
            }else if(document.queryCommandSupported && document.queryCommandSupported("copy")){
                var textarea = document.createElement("textarea");
                textarea.textContent = text;
                textarea.style.position = "fixed";        // Prevent scrolling to bottom of page in MS Edge.
                document.body.appendChild(textarea);
                textarea.select();
                try{
                    return document.execCommand("copy");  // Security exception may be thrown by some browsers.
                }catch(ex){
                    console.warn("Copy to clipboard failed.", ex);
                    return false;
                }finally{
                    document.body.removeChild(textarea);
                }
            }
        }
        ,getLeftGnbHeight:function() {
            var leftGnb = window.parent.$('div.gnb_wrap');
                 leftGnb = leftGnb.length > 0 ? leftGnb : window.parent.parent.$('div.gnb_wrap');
                 if (leftGnb.length == 0) {
                     return false;
                 }
            return leftGnb.height();
        }

        /**
         * Author: Do
		 * Date  : 2019-04-12
		 *
         * [사용방법]
         * Grid field 생성시 attributes:{"class":"form_uppercase"} 넣어주시면 됩니다.
         * 기존에 class가 있다면 attributes:{"class":"al form_uppercase"} 이런식으로 넣어주시면 됩니다.
         *
         * Ex) Grid Method에 아래 속성추가
         * ------------------------------------------
			,edit:function(e){
				dms.utils.addGridChildClass(e);
			}
		 * ------------------------------------------
         */
        ,addGridChildClass:function(e){
        	if(typeof(e) === 'undefined' || e === ""){
        		console.warn('Error : 파라미터는 Editor만 올 수 있습니다.'+e);
        		return;
        	}

        	try{
	        	for(var i=0; i < e.container.length; i++){
		        	if(e.container[i].className.indexOf("form_uppercase") > 0){
		        		for(var j=0; j < e.container[i].children.length; j++){
			        		if(e.container[i].children[j].className.indexOf("form_uppercase") < 0){
			        			e.container[i].children[j].classList.add("form_uppercase");
			        		}
		        		}
			    	}
	        	}
	        	dms.string.toUpperCase();
        	}catch(error){
        		console.warn('그리드 Editor 객체가 아닙니다.'+error);
        	}
        }
    };

    dms.biz = {

    		isValidBizNo : function(bizNo) {

    	    	var param = {};
    	    	param.bizNo = bizNo;

    			var option = {};
    			option.async = false;
    			option.url = dms.uri.getUrl("/cmm/sci/etc/checkBusinessNo.do");
    			option.data = JSON.stringify(param)

    			return dms.ajax.getJson(option);
    		}
    };

    dms.form = {

    	       getId:function(args) {
    	          var idList = [],
    	             len = args.length,
    	             obj = null;

    	          for(var i=0; i<len; i++){
    	             var idSet = new Object();
    	             obj = args[i];

    	             idSet.id = obj.id;
    	             idSet.dataType = obj.getAttribute("data-type");

    	             idList.push(idSet);
    	          }

    	          return idList;
    	       },

    	       initVal:function(args, custValObj) {
                   	var len = args.length;

					for(var i=0; i<len; i++){
                      const dataset = args[i].dataset;
                      const id = args[i].id;
                      const type = args[i].type;
                      const dataType = dataset.role||"input";
                      
                      if(dms.string.isNotEmpty(id)){
						  const $element = $("#"+id);
	                      const custValue = custValObj == undefined ? custValObj : custValObj[id];
	
	                      if(dataType === "input") {
							if(type === "radio") {
								$('input[name='+$element[0].name+']')[0].checked = true;
							} else {
								$element.val(custValue||"");
							}
	                      } else if(dataType === "extmaskeddatepicker") {
	                         $element.data("kendoExtMaskedDatePicker").value(custValue||"");
	                      } else if(dataType === "extmaskeddatetimepicker") {
	                          $element.data("kendoExtMaskedDateTimePicker").value(custValue||"");
	                      } else if(dataType === "extnumerictextbox") {
	                         $element.data("kendoExtNumericTextBox").value(custValue||0);
	                      } else if(dataType === "dropdownlist") {
	                         $element.data("kendoDropDownList").value(custValue||"");
	                      } else if(dataType === "extdropdownlist") {
	                          $element.data("kendoExtDropDownList").value(custValue||"");
	                      } else if(dataType === "multiselect") {
	                         $element.data("kendoMultiSelect").value(custValue||[]);
	                      } else if(dataType === "extmultiselectdropdownlist") {
	                         $element.data("kendoExtMultiSelectDropDownList").value(custValue||[]);
	                      } else if(dataType === "datepicker") {
	                         $element.data("kendoDatePicker").value(custValue||"");
	                      } else if(dataType === "datetimepicker") {
	                         $element.data("kendoDateTimePicker").value(custValue||"");
	                      } else if(dataType === "daterangepicker") {
	                          $element.data("kendoDateRangePicker").range(custValue||{ start: null, end: null });
	                      } else if(dataType === "editor") {
	                          $element.data("kendoEditor").value(custValue||"");
	                      }
					  }
                   }
                },

                getExistId:function( args){
                	var idLength = args.length;
                	var result = true;

                	if(idLength == 0 ) result = false;

                	return result;
                }
    	    };

	dms.corp = {
		settingCorp : function(htmlId,corpNmTypes,corpCd) {

			//조회 - 법인명 -사업장코드 그룹
	    	$(htmlId).kendoExtDropDownList({
	        	dataSource:corpNmTypes
	        	,dataValueField:"corpCd"
	            ,dataTextField:"corpNm"
	            ,index:0
	        });

			$(htmlId).data("kendoExtDropDownList").value(corpCd);

		}
    };


    dms.setAmountInputHelper = {
    	init : function(){
	    	// 팝업 창 외에 클릭 시 팝업창 닫기
	        $(document).mouseup(function (e) {
	            var container = $(".helperDiv");
	            if (!container.is(e.target) && container.has(e.target).length === 0) {
	                container.remove();
	            }
	        });
	        
	        // keyPad 클래스가 포함된 input 엘리먼트에 대해 처리
	        $(".keyPad").each(function () {
	            // 입력 도우미 버튼 추가
	            var input = $(this);
	            var helperButton = $("<button>⌨</button>");
	            input.after(helperButton);
	
	            // 입력 도우미 버튼 클릭 시 팝업창 표시
	            helperButton.click(function () {
	                var helperDiv = $(".helperDiv");
	                if (helperDiv.length > 0) {
	                    helperDiv.remove();
	                    return;
	                }
	
	                helperDiv = $("<div class='helperDiv'></div>");
	                helperDiv.css({
	                    position: "absolute",
	                    top: input.offset().top + input.outerHeight() + 10 + "px",
	                    left: input.offset().left + "px",
	                    "background-color": "white",
	                    border: "1px solid gray",
	                    padding: "10px",
	                    height: "50px",
	                    width: "300px",
	                    display: "flex",
	                    justifyContent: "space-between",
	                });
	                $("body").append(helperDiv);
	
	                // 숫자 버튼 추가
	                var buttons = [
	                    { label: "1000만", value: 10000000 },
	                    { label: "100만", value: 1000000 },
	                    { label: "10만", value: 100000 },
	                    { label: "5만", value: 50000 },
	                    { label: "1만", value: 10000 }
	                ];
	                $.each(buttons, function (index, button) {
	                    var buttonElement = $("<button>" + button.label + "</button>");
	                    buttonElement.click(function () {
	                        var currentValue = parseInt(dms.string.deleteSeparatorCommas(input.val()));
	                        if (isNaN(currentValue)) {
	                            currentValue = 0;
	                        }
	                        input.val(dms.string.addThousandSeparatorCommas(currentValue + button.value));
                            input.focus(); // 포커스 이동
	                    });
	                    helperDiv.append(buttonElement);
	                });
	
					// 닫기 버튼 추가
	                var closeBtnEl = $("<button>X</button>");
	                closeBtnEl.click(function () {
	                    helperDiv.remove();
	                });
	                helperDiv.append(closeBtnEl);
	                
	            }); 
	        }); 
	    }
    }
    
    

    window.dms = dms;
}(window, document, jQuery));
