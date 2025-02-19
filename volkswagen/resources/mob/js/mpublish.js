$(window).resize(function(){
    gnbMenu();
});

/* publish js */
$(document).ready(function(){
    gnbMenu();

    // icon toggle
    $('.circleWrap').on('click', function(){
    	$(this).toggleClass('opened');
	});
    
	// top 버튼
	$('#topBtn').hide();
	$(window).scroll(function () {
		if ($(this).scrollTop() > 50) {
			$('#topBtn').fadeIn();
		} else {
			$('#topBtn').fadeOut();
		}
	});
	
	$('#topBtn').click(function () {
		$('body,html').animate({
			scrollTop: 0
		}, 400);
		return false;
	});
    
    // 즐겨찾기 toggle
    $("#gnb .btn_favorites").click(function(){
        $(this).toggleClass("active");
    });



    // 폼 포커스 이벤트
    $("input, select").focus(function(){ $(this).parent("div").addClass("f_focus");}).blur(function(){  $(this).parent("div").removeClass("f_focus"); });

    /*  $(".f_text>input[disabled], .f_item01>input[disabled], .f_item02>input[disabled], .f_select select[disabled]").parent().addClass("f_disabled");
        $(".f_text>input[readonly], .f_item01>input[readonly], .f_item02>input[readonly], .f_select select[readonly]").parent().addClass("f_disabled"); */

    // 컨텐츠 열기 접기
    $(".content_title > .title_btn > span.co_open").click(function(){
    	//20190411 안되서 임시로 막음: pjo publisher담당자분 봐 주세요!!!!
        //$(this).parent().parent().next(".co_view").toggle();
        $(this).toggleClass('co_close');
    });

    // 조회값 삭제시 iframe 높이값 재설정
    $(".skeyarea .btnarea .sbtn").click(function(){
        $(".skeyarea").hide();
        iframeHeightset();
    });

    // 전체조회값 삭제시 iframe 높이값 재설정
    $(".skeyarea .slist01 .btn_delete").click(function(){
        $(this).parents("tr").hide();
        iframeHeightset();
    });

    // iframe 높이값 설정
    iframeHeightset();

    // 제목 클릭시 조회화면 보여주기
    $("#header h1").click(function(){
        if( $(this).children("span").hasClass("search_close") === true){
            contentlist();
        }else if( $(this).children("span").hasClass("search_open") === true ){
            contentSearch();
        }
    });

    /* 제목 체크하기 - 이전버튼이 들어가는 여백 부분  */
    $(".content_title:first").addClass("conttitlePrev");
    $("#content_search > .content_title").addClass("conttitlePrev");

    //추가정보 더보기
    $("div.btn_viewMore>.btnView").click(function(){
        if($(this).hasClass("active")){
            $(this).parent().prev("table.flist01_viewMore").hide();
            $(this).removeClass("active").find("span").text("추가정보 더보기");
        }else{
            $(this).parent().prev("table.flist01_viewMore").show();
            $(this).addClass("active").find("span").text("추가정보 접기");
        }
    });
});


function gnbMenu(){
    // menu UI
    var winHeight = $(window).height();
    $("#gnb").height(winHeight - 60);
    $("#gnbarea").height(winHeight - 60);

    // menu slider
    $(".allmenu").click(function(){
        $("body").append("<div class='mblind' onclick='allmenuClose()'></div>");
        $(".mblind").show().animate({opacity:'0.8'},500);
        $("#nav").show().animate({left:'0'},500);
        $('body').css({overflow:'hidden'}).bind("touchmove", function(e){e.preventDefault();}); // 부모스크롤 막기
        $("iframe").load(function(){
            $(this).contents().find('body').unbind('touchmove'); // iframe 스크롤은 진행
         });
    });
    $(".closeallmenu").click(function(){
        allmenuClose();
    });

    // menu active
    $("#gnb > li > span, #gnb > li.nav_allmenu > ul > li > ul > li > span").click(function(){
        $(this).parent().toggleClass("active");
    });
    $("#gnb > li.nav_allmenu > ul > li > span").click(function(){
        if($(this).parent().hasClass("active") === true){
            $(this).parent().removeClass("active");
        }
        else{
            $(this).parent().siblings().removeClass("active");
            $(this).parent().addClass("active");
        }
    });
}

/* 메인메뉴 닫기 */
function allmenuClose(){
    $(".mblind").animate({opacity:'0'},200).queue(function(){$(".mblind").remove();});
    $("#nav").hide().animate({left:'-350px'},500);
    jQuery('body').css({overflow:''}).unbind('touchmove'); // 부모 스크롤 해제
}

/*
// iframe 컨텐츠 높이만큼 설정하기
$("#mainList2").load(function() {
    var h = $(this).contents().height();
    $(this).height( h );
}); */

//iframe 높이값 계산
function iframeHeightset(){
    var lsitareaHeight = $(window).height() - $("#header").outerHeight() - $("#content_list > .content_title").outerHeight() - 10;
    if( $(".skeyarea").is(':visible') ){ lsitareaHeight -= $(".skeyarea").outerHeight(); }
    if( $(".btnfixed").is(':visible') ){ lsitareaHeight -= $(".btnfixed").outerHeight(); }
    if( $(".removeArea_ifr").is(':visible') ){ lsitareaHeight -= $(".removeArea_ifr").outerHeight(); }
    $("#mainList").parent(".listarea").css("height",lsitareaHeight);
    $("#mainList").css("height", lsitareaHeight - $("#mainList").prev(".listhead").outerHeight());
}

// 레이어팝업 열기
function pushLayer(layerName){
    var layerName = $(layerName);
    var layWidth = layerName.width();
    var layHeight = layerName.height();
    var left=($(window).width()-layWidth)/2;
    var sctop=$(window).scrollTop()*2;
    var top=($(window).height()-layHeight+sctop)/2;
    var height=document.getElementsByTagName("body")[0].scrollHeight;
    $("body").append("<div class='blind' onclick='layerClose("+layerName+")'></div>");
    $(".blind").show().animate({opacity:'0.4'},500);
    $(layerName).css({"left":left,"top":top,"display":"block"});
}
function layerClose(layerName){
    $(layerName).css("display","none");
    $(".lay_pop").css("display","none"); // 레이어팝업 모두 닫힘. 삭제해야함.
    $(".blind").animate({opacity:'0'},200).queue(function(){$(".blind").remove();});
}

//캘린더 팝업 호출 - pushLayer로 통합
function calpicker(){
 var pickerWidth = $(".m_calpicker").innerWidth();
 var pickerHeight = $(".m_calpicker").innerHeight();
 var left=($(window).width()-pickerWidth)/2;
 var sctop=$(window).scrollTop()*2;
 var top=($(window).height()-pickerHeight+sctop)/2;
 var height=document.getElementsByTagName("body")[0].scrollHeight;
 $("body").append("<div class='blind' onclick='pickerClose()'></div>");
 $(".blind").show().animate({opacity:'0.4'},500);
 $(".m_calpicker").css({"left":left,"top":top,"display":"block"});
}

//날짜 팝업 호출 - pushLayer로 통합
function datepicker(){
 var pickerWidth = $(".m_datepicker").innerWidth();
 var pickerHeight = $(".m_datepicker").innerHeight();
 var left=($(window).width()-pickerWidth)/2;
 var sctop=$(window).scrollTop()*2;
 var top=($(window).height()-pickerHeight+sctop)/2;
 var height=document.getElementsByTagName("body")[0].scrollHeight;
 $("body").append("<div class='blind' onclick='pickerClose()'></div>");
 $(".blind").show().animate({opacity:'0.4'},500);
 $(".m_datepicker").css({"left":left,"top":top,"display":"block"});
}

//시간 팝업 호출 - pushLayer로 통합
function timepicker(){
 var pickerWidth = $(".m_timepicker").innerWidth();
 var pickerHeight = $(".m_timepicker").innerHeight();
 var left=($(window).width()-pickerWidth)/2;
 var sctop=$(window).scrollTop()*2;
 var top=($(window).height()-pickerHeight+sctop)/2;
 var height=document.getElementsByTagName("body")[0].scrollHeight;
 $("body").append("<div class='blind' onclick='pickerClose()'></div>");
 $(".blind").show().animate({opacity:'0.4'},500);
 $(".m_timepicker").css({"left":left,"top":top,"display":"block"});
}

//목록 보기
function contentlist() {
$("#header h1 > span").removeClass("search_close");
$("#content_list").css("display","block");
$("#content_search").css("display","none");
$("#content_detail").css("display","none");
}

//검색페이지 보기
function contentSearch() {
$("#header h1 > span").addClass("search_close");
$("#content_list").css("display","none");
$("#content_detail").css("display","none");
$("#content_search").css("display","block");
}

//상세페이지 보기
function contentDetail(key) {
$("#content_list").css("display","none");
$("#content_search").css("display","none");
$("#content_detail").css("display","block");
}