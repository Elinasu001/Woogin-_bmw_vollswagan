/*
포틀릿 페이지 구성
<script type="text/javascript">
//기타버튼 설정
applyEtcButton({
	id:window.name
	,buttons:[
		{
			iconClass:"po_completion"
			,click:function(e){
				//버튼 클릭시 이벤트 처리
			}
		}
	]
});
</script>

<div id="ptl-sample-default">
sample
</div>

 */

//메인화면 포틀릿 loading
loadPortlet = function(portlet, target){
	$(target).find("div.po_header h1").html(portlet.portletNm);

	//새로고침 버튼 셋팅
	portlet.reloadYn == "Y" ? $(target).find("a.btnPortletRefresh").show():$(target).find("a.btnPortletRefresh").hide();

    //더보기 버튼 셋팅
    if(portlet.viewId != null && portlet.viewId != ""){
        $(target).find("a.btnPortletMore").show();
    }else{
        $(target).find("a.btnPortletMore").hide();
    }

    dms.loading.show($(target).find("div.po_content"));

    //iframe 방식 적용
    var portletFrame = $(target).find("div.po_content").find("iframe");
    if(portletFrame.length == 0){
        portletFrame = $("<iframe frameborder=\"0\" scrolling=\"no\" style=\"width:100%;height:228px;\"/>");
        $(target).find("div.po_content").append(portletFrame);
    }

    portletFrame.load(function() {
        $($(this).closest("div")).children("div").hide();
    });

    portletFrame.attr("name", "IFR-"+portlet.portletId);
    portletFrame.attr("id", "IFR-"+portlet.portletId);
    portletFrame.attr("src", _contextPath + portlet.portletUrl);

//layer 방식 적용
//	$.get(_contextPath + portlet.portletUrl, function(data) {
//	    dms.loading.hide($(target).find("div.po_content"));
//	    $(target).find("a.btn-etc").remove();
//		$(target).find("div.po_content").html(data);
//		resizePortletHeight(target);
//	});
};

applyEtcButton = function(buttonConfig){
	var portletButton = $("div.btn_right", $("#"+buttonConfig.id).closest("section"));

	$.each(buttonConfig.buttons, function(idx, obj){
		portletButton.prepend($("<a href=\"#\" />").addClass(obj.iconClass).addClass("btn-etc").bind("click", obj.click));
	});
};

//포틀릿 리사이즈
resizePortletHeight = function(target){
	var cnt = 1;
	var timer;
	var h = 0;

	timer = setInterval(function(){
		cnt++;

		if($(target).html()){
			h = $(target).find("div.po_content").height();

			if(cnt > 30 || h != 0){

				h = h<100? 100:h;

				$(target).height(h+36);
				clearInterval(timer);
			}
		}
	}, 500);
};

//더보기 화면으로 이동
openMorePage = function(obj){
	var target = "#"+$(obj).closest("section").prop("id");
	var portlet = $(target).data();

	if(dms.string.isEmpty(portlet.viewId)){
	    return;
	}

	$.ajax({
        url:_contextPath + "/cmm/ptl/portletLayout/selectViewInfo.do"
        ,data:JSON.stringify({"sTCd":portlet.viewId})
        ,type:'POST'
        ,dataType:'json'
        ,contentType:'application/json'
        ,error:function(jqXHR,status,error){
            dms.notification.error(jqXHR.responseJSON.errors[0].errorMessage);
        }
    }).done(function(viewData) {
        if(viewData != null ){
            parent._addTabMenu(viewData.viewNm, _contextPath + viewData.viewUrl, viewData.tCd, viewData.viewId, true, true);
        }
    });
};

//포틀릿 새로고침 버튼 클릭시
reloadPortlet = function(element){
	var target = "#"+$(element).closest("section").prop("id");
	var portletInfo = $(target).data();

	var iframe = $("#IFR-"+portletInfo.portletId)[0];
	iframe.src = iframe.src;

	//loadPortlet($(target).data(), target);
};

//포틀릿 설정 버튼 클릭시
function updatePortletDeploy(obj) {
    var target = "#"+$(obj).closest("section").prop("id");
    dms.window.popup({
        windowId:"portletSearchPopupWin"
        ,title:dms.settings.defaultMessage.portletSearch
        ,content:{
            url:_contextPath + "/cmm/sci/commonPopup/selectPortletPopup.do"
            ,data:{
                "autoBind":false    //자동 조회 여부
                ,"searchAll":false  //포틀릿 전체 조회 여부 true 인 경우 전체 포틀릿 목록 조회, false 인 경우 로그인 사용자의 직무에 매핑된 포틀릿 목록 조회
                ,"callbackFunc":function(newData){
                    var oldData = $(target).data();

                    var exist = false;
                    var portletId = newData.portletId;

                    //포틀릿 중복 체크
                    $("section.portlet").each(function(idx, elem){
                    	if($(this).data("portletId") == portletId){
                    		exist = true;
                    		return false;
                    	}
                    });

                    if(exist){
                    	dms.notification.warning(dms.settings.defaultMessage.aready);
                    	return;
                    }

                    $.ajax({
                        url:_contextPath + (isDefaultPortletDeploy? "/cmm/ptl/portletLayout/updateDefaultPortletDeploy.do":"/cmm/ptl/portletLayout/updateUserPortletDeploy.do")
                        ,data:JSON.stringify({
                            portletLayoutId:oldData.portletLayoutId
                            ,portletId:newData.portletId
                            ,rowLocCnt:oldData.rowLocCnt
                            ,columnLocCnt:oldData.columnLocCnt
                        })
                        ,type:'POST'
                        ,dataType:'json'
                        ,contentType :'application/json'
                        ,error:function(jqXHR,status,error){
                            dms.loading.hide($(target).find("div.po_content"));
                            dms.notification.error(jqXHR.responseJSON.errors);
                        }

                    }).done(function(portletInfo) {
                        $(target).data(portletInfo);
                        loadPortlet(portletInfo, target);

                        $("#portletSearchPopupWin").data("kendoWindow").close();
                    });
                }
            }
        }

    });
}

function selectMainReportMenu(tcode){
    var params = {};
    params["tCd"] = tcode;
    $.ajax({
        url:"<c:url value='/cmm/ath/viewInfo/selectViewInfoByTcd.do' />"
        ,data:JSON.stringify(params)
        ,type:'POST'
        ,dataType:'json'
        ,contentType:'application/json'
        ,error:function(jqXHR,status,error){
            dms.notification.error(jqXHR.responseJSON.errors[0].errorMessage);
        }
    }).done(function(viewData) {
        if(viewData != null && !dms.string.isEmpty(viewData.viewUrl)){
            parent._addTabMenu(viewData.viewNm, _contextPath + viewData.viewUrl, viewData.tCd, viewData.viewId);
        }
    });
}