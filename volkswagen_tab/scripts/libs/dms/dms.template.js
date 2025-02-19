
$("<div id='_dialogTmpl'/>").kendoWindow({
	draggable : false,
	visible : false,
	resizable : false,
	modal : true
});

var dialogTmpl = $("#_dialogTmpl").data("kendoWindow"); 	

//포틀릿 화면 로딩 이미지 보여줌
portletLoadStart = function($target) {
	var position = $target.position();
	
	$('<div/>').appendTo($target)
		.css({left:position.left, top:position.top, width:$target.innerWidth(), height:$target.innerHeight()})	
		.addClass("ajax-container-loading");
}

//포틀릿 로딩 완료시 로등 이미지 삭제
portletLoadComplete = function($target) {
	$target.find("div.ajax-container-loading").remove();
}
 
//선택한 포틀릿으로 변경
setPortlet = function(jsonObj){
	
	var target = jsonObj.target;
	var curPortletObj = jsonObj.curPortletObj;	//현재 포틀릿 정보
	var selPortletObj = jsonObj.selPortletObj;	//변경될 포틀릿 정보

	portletLoadStart($(target).find("div.po_content"));

	$.ajax({
        url : _contextPath + (isSetDefaultView ? "/cmm/sci/portlet/updateDefaultPortlet.do" : "/cmm/sci/portlet/updateUserPortlet.do"),
        data: JSON.stringify({templateId:curPortletObj.templateId, portletId:selPortletObj[0].portletId, rowIndex:curPortletObj.rowIndex, columnIndex:curPortletObj.columnIndex}),         
        type: 'POST',			
        dataType : 'json',		
        contentType :'application/json',								    
        error: function(jqXHR,status,error){
        	portletLoadComplete($(target).find("div.po_content"));
	    	dms.notification.info(JSON.parse(jqXHR.responseText).error, "error");
	    }
	
    }).done(function(result) {
		$.get(_contextPath+selPortletObj[0].portletUrl, function(data) {
			
			portletLoadComplete($(target).find("div.po_content"));

			resetPortlet(target);
			$(target).find("div.po_header h1").html(selPortletObj[0].portletNm);

			//포틀릿 헤더 더보기, 새로고침 버튼 셋팅
			setPortletHeaderBtn(target, selPortletObj[0].reloadYn, selPortletObj[0].moreViewId);
			
			//포틀릿 contents
			$(target).find("div.po_content").html(data);
			
			//변경된 포틀릿 정보 셋팅
			if(target == "#portlet_11"){
				portlet_11 = selPortletObj[0];
			}else if(target == "#portlet_12"){
				portlet_12 = selPortletObj[0];
			}else if(target == "#portlet_13"){
				portlet_13 = selPortletObj[0];
			}else if(target == "#portlet_14"){
				portlet_14 = selPortletObj[0];
			}else if(target == "#portlet_21"){
				portlet_21 = selPortletObj[0];
			}else if(target == "#portlet_22"){
				portlet_22 = selPortletObj[0];
			}else if(target == "#portlet_23"){
				portlet_23 = selPortletObj[0];
			}else if(target == "#portlet_24"){
				portlet_24 = selPortletObj[0];
			}

			resizePortletHeight(target);
		},'html');		       
    });				
	
}		

//포틀릿 헤더 더보기, 새로고침 버튼 셋팅
setPortletHeaderBtn = function(target, reloadYn, moreViewId){
	
	//새로고침 버튼 셋팅
	reloadYn == "Y" ? $(target).find("a.po_refresh").show() : $(target).find("a.po_refresh").hide();

	console.log(moreViewId)
	
	//더보기 버튼 셋팅
	if(moreViewId != null && moreViewId != ""){ 
		$(target).find("a.po_add").show(); 
	}else{	
		$(target).find("a.po_add").hide();	
	}
}

//지정된 포틀릿 영역 내용 삭제
resetPortlet = function(target){
	$(target).find("div.po_header h1").html("");
	$(target).find("div.po_content").html("");
}

//메인화면 포틀릿 loading
loadPortlet = function(portletInfo, target){
	
	$(target).find("div.po_header h1").html(portletInfo.portletNm);	

	//포틀릿 헤더 더보기, 새로고침 버튼 셋팅
	setPortletHeaderBtn(target, portletInfo.reloadYn, portletInfo.moreViewId);

	portletLoadStart($(target).find("div.po_content"));
	
	$.get(_contextPath+portletInfo.portletUrl, function(data) {
		portletLoadComplete($(target).find("div.po_content"));
		
		$(target).find("div.po_content").html(data);

		resizePortletHeight(target);
	},'html'); 
	
}

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
				
				$(target).height(h+60);
				clearInterval(timer);	
			}
		}
	}, 500);
}

//더보기 화면으로 이동
goMoreView = function(obj){
	var target = "#"+$(obj).closest("article").prop("id");
	
	if($(obj).closest("article").prop("id") == "portlet_11"){
		targetData = portlet_11;
	}else if($(obj).closest("article").prop("id") == "portlet_12"){
		targetData = portlet_12;
	}else if($(obj).closest("article").prop("id") == "portlet_13"){
		targetData = portlet_13;
	}else if($(obj).closest("article").prop("id") == "portlet_14"){
		targetData = portlet_14;
	}else if($(obj).closest("article").prop("id") == "portlet_21"){
		targetData = portlet_21;
	}else if($(obj).closest("article").prop("id") == "portlet_22"){
		targetData = portlet_22;
	}else if($(obj).closest("article").prop("id") == "portlet_23"){
		targetData = portlet_23;
	}else if($(obj).closest("article").prop("id") == "portlet_24"){
		targetData = portlet_24;
	}
	

	$.ajax({
        url : _contextPath + "cmm/ath/viewInfo/selectViewInfoByKey.do",
        data: JSON.stringify({sViewId:targetData.moreViewId}),         
        type: 'POST',			
        dataType : 'json',		
        contentType :'application/json',								    
        error: function(jqXHR,status,error){
        	portletLoadComplete($(target).find("div.po_content"));
	    	dms.notification.info(jqXHR.statusText, "error");
	    }
	
    }).done(function(viewData) {
    	if(viewData == null || viewData.viewUrl == null || viewData.viewUrl == "" ){
    		dms.notification.info("더보기 화면 정보가 올바르지 않습니다.", "error");
    		return;
    	}

    	location.href = _contextPath + viewData.viewUrl + "?subTemplate=subTemplateOK&title=" + encodeURIComponent(viewData.viewNm);
    });		
}

//포틀릿 새로고침 버튼 클릭시
viewReflash = function(obj){
	
	var target = "#"+$(obj).closest("article").prop("id");
	
	
	if($(obj).closest("article").prop("id") == "portlet_11"){
		targetData = portlet_11;
	}else if($(obj).closest("article").prop("id") == "portlet_12"){
		targetData = portlet_12;
	}else if($(obj).closest("article").prop("id") == "portlet_13"){
		targetData = portlet_13;
	}else if($(obj).closest("article").prop("id") == "portlet_14"){
		targetData = portlet_14;
	}else if($(obj).closest("article").prop("id") == "portlet_21"){
		targetData = portlet_21;
	}else if($(obj).closest("article").prop("id") == "portlet_22"){
		targetData = portlet_22;
	}else if($(obj).closest("article").prop("id") == "portlet_23"){
		targetData = portlet_23;
	}else if($(obj).closest("article").prop("id") == "portlet_24"){
		targetData = portlet_24;
	}
	
	loadPortlet(targetData, target);		
}

//포틀릿 설정 버튼 클릭시
viewPortletLayer = function(obj){
	var target = "#"+$(obj).closest("article").prop("id");
	var targetData;
	
	if($(obj).closest("article").prop("id") == "portlet_11"){
		targetData = portlet_11;
	}else if($(obj).closest("article").prop("id") == "portlet_12"){
		targetData = portlet_12;
	}else if($(obj).closest("article").prop("id") == "portlet_13"){
		targetData = portlet_13;
	}else if($(obj).closest("article").prop("id") == "portlet_14"){
		targetData = portlet_14;
	}else if($(obj).closest("article").prop("id") == "portlet_21"){
		targetData = portlet_21;
	}else if($(obj).closest("article").prop("id") == "portlet_22"){
		targetData = portlet_22;
	}else if($(obj).closest("article").prop("id") == "portlet_23"){
		targetData = portlet_23;
	}else if($(obj).closest("article").prop("id") == "portlet_24"){
		targetData = portlet_24;
	}

	dialogTmpl.setOptions({
		content : {
			url : _contextPath+"/cmm/popup/portlet/layerMain.do",
			data: {
				"target" : target,
				"curPortletObj" : targetData,
				"callbackFunc" : "setPortlet"
			},
			iframe:true
		},
		width: 800,
		height: 480,
		title : "포틀릿 목록"
	});
	
	dialogTmpl.content("");
	dialogTmpl.refresh();
	dialogTmpl.open().center();	
}

