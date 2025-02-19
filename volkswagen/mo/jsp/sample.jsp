<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="ko" class="k-webkit k-webkit128 k-mobile">
<head>
    <jsp:include page="./common/header.jsp" flush="true" />

</head>
<body>
    <div class="modal show">
        <div class="modal-content bg scroll-hidden" id="vwBody">
            <div class="modal-header">
                <h1 class="header-title">팝업타이틀</h1>
                <div class="header-left">
                    <button class="btn btn-util close btn-close-modal km-widget km-button" onclick="btnCancel()"
                        data-role="button">
                        <span class="sr-only km-text"></span>
                    </button>
                </div>
            </div>
            <div class="modal-body mo-body type2">
                <div class="info-wrap">
                    <div class="user-info-area">
                        <div class="user-info-detail pd14">
                            <div class="info-dl">
                                <dl class="info-dl-item">
                                    <dt>RO번호</dt>
                                    <dd>RO2409000023</dd>
                                </dl>
                                <dl class="info-dl-item">
                                    <dt>예약번호</dt>
                                    <dd>SB2409000022</dd>
                                </dl>
                            </div>
                        </div>
                        <div class="info-sec">
                            <div class="title-area">
                                <div class="title-left">
                                    <p class="title">버튼영역</p>
                                </div>
                            </div>
                            <!--N : footer-btn -> content-btn 클래스 변경 -->
                            <span class="sample-tit">버튼 두개 이상일경우</span>
                            <div class="content-btn" id="svcTpCdBtn">
                                <button id="06" type="button" class="btn-Selected">button(select)</button>
                                <button id="07" type="button">btn name</button>
                                <button id="08" type="button">btn name</button>
                                <button id="99" type="button">btn name</button>
                            </div>
                            <span class="sample-tit"> 버튼 크기가 100% 일경우</span>
                            <div class="content-btn full" id="svcTpCdBtn">
                                <button id="06" type="button" class="btn-Selected">button(select)</button>
                                <button id="06" type="button">button</button>
                                <button id="06" type="button" class="btn-disabled">button(disabled)</button>
                            </div>
                            <span class="sample-tit">하단버튼 1개일경우</span>
                            <div class="footer-btn">
                                <button type="button" class="btn btn-primary">btn name</button>
                            </div>
                            <span class="sample-tit">하단버튼 2개일경우 - alert샘플(켄도)</span>
                            <div class="footer-btn">
                                <button id="alertBtn1" type="button" class="btn btn-secondary">버튼2개생성</button>
                                <button id="alertBtn2" type="button" class="btn btn-primary">버튼1개생성</button>
                            </div>
                            <span class="sample-tit">하단버튼 2개일때 버튼크기가 동일한 경우</span>
                            <div class="footer-btn half">
                                <button type="button" class="btn btn-secondary">btn name</button>
                                <button type="button" class="btn btn-primary">btn name</button>
                            </div>
                        </div>
                        <div class="info-sec">
                            <div class="title-area">
                                <div class="title-left">
                                    <p class="title">폼영역</p>
                                </div>
                            </div>
                            <span class="sample-tit">input</span>
                            <div class="search-body-title">
                                <div class="input-area">
                                    <input type="search" class="basic-input" id="" placeholder="기본">
                                </div>
                                <div class="input-area">
                                    <input type="text" class="basic-input" id="">
                                    <span>km</span>
                                </div>
                                <div class="input-area">
                                    <input type="search" class="basic-input" id="" placeholder="검색폼">
                                    <button class="btn btn-util search">검색</button>
                                </div>
                                <div class="input-area">
                                    <input type="text" class="basic-input" id="" placeholder="" value="2024-01-01 11:11(readonly)" readonly>
                                    <button class="btn btn-util date">날짜</button>
                                </div>
                                <div class="input-area">
                                    <input type="text" class="basic-input" id="" placeholder="" value="2024-01-01 11:11">
                                    <button class="btn btn-util date">날짜</button>
                                </div>
                            </div>
                            <span class="sample-tit">select</span>
                            <div class="form-group">
                                <div class="form-item select">
                                    <select id="selectInput"></select>
                                    <script>
                                        // select
                                        $("#selectInput").kendoExtDropDownList({
                                            optionLabel: "selectbox를 선택하세요",
                                            autoBind: false,
                                            dataTextField: "text",
                                            dataValueField: "value",
                                            dataSource: [
                                                { text: "item1", value: "1" },
                                                { text: "item2", value: "2" },
                                                { text: "item3", value: "3" },
                                            ]
                                        });
                                    </script>
                                </div>
                            </div>

                            <span class="sample-tit">textarea</span>
                            <div class="form-group">
                                <div class="form-item">
                                    <textarea class="form-textarea" rows="4" placeholder="텍스트를 입력해주세요."></textarea>
                                </div>
                            </div>
                            <span class="sample-tit">체크박스</span>
                            <ul class="form-checkbox-group normal">
                                <li>
                                    <input type="checkbox" id="checkboxBtn1" class="k-checkbox" checked="">
                                    <label class="k-checkbox-label" for="checkboxBtn1">noraml</label>
                                </li>
                                <li>
                                    <input type="checkbox" id="checkboxBtn3" class="k-checkbox">
                                    <label class="k-checkbox-label" for="checkboxBtn3">check</label>
                                </li>
                                <li>
                                    <input type="checkbox" id="checkboxBtn4" class="k-checkbox" disabled>
                                    <label class="k-checkbox-label" for="checkboxBtn4">disabled</label>
                                </li>
                            </ul>
                        </div>
                        <!-- 작업내용 -->
                        <div class="info-sec">
                            <div class="title-area">
                                <div class="title-left">
                                    <p class="title">사진촬영 리스트</p>
                                </div>
                            </div>
                            <div class="card-list">
                                <ul id="listview2" class="list-group" data-role="listview"></ul>
                                <script id="tmp2" type="text/x-kendo-template">
                                    <div class="item-area">
                                        <div class="item-left">
                                            <p class="item-text bold">#: title #</p>
                                        </div>
                                        <div class="item-right item-flex">
                                            <p class="item-md-text">#: date #</p>
                                            <div class="item-icon-group">
                                                <a href="javascript:;" class="btn-util photo">
                                                    <span class="sr-only">사진 촬영</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </script>
                                <script>
                                    // 사진촬영 data
                                    var groupedData2 = [
                                        {
                                            title: "차량외관", 
                                            date: "",
                                        },
                                        {
                                            title: "사고부위", 
                                            date: "2021-07-21 15:30:00",
                                        },
                                    ];
                                    $(document).ready(function () { 
                                        // 사진촬영
                                        $("#listview2").kendoMobileListView({
                                            dataSource: kendo.data.DataSource.create({data: groupedData2}),
                                            template: kendo.template($("#tmp2").html()),
                                        });
                            
                                    });
                                </script>
                            </div>
                        </div>
                        <!--아코디언-->
                        <div class="info-sec">
                            <div class="title-area">
                                <div class="title-left">
                                    <p class="title">아코디언</p>
                                </div>
                            </div>
                            <!-- 아코디언1 -->
                            
                            <ul class="accordion" id="accordion1">
                                <li class="accordion-item">
                                    <div class="accordion-header">
                                        <div class="accordion-title title-flex">
                                            <div class="title-left">
                                                <p class="title">Insert text</p>
                                            </div>
                                        </div>
                                        <button class="accordion-btn">
                                            <span class="sr-only">펼침</span>
                                        </button>
                                    </div>
                                    <div class="accordion-panel">
                                        <div class="item-text-group chk-list-tit">
                                            <div class="tit">점검 리스트</div>
                                            <div>
                                                <p class="item-text">OK</p>
                                                <p class="item-text">N.OK</p>
                                            </div>
                                        </div>
                                        <div class="agreement-area-wrap">
                                            <ul id="listview3" class="list-group" data-role="listview"></ul>
                                            <script id="tmp3" type="text/x-kendo-template">
                                                <div class="item-area">
                                                    <div class="item-left item-flex">
                                                        <div class="item-left">
                                                            # if (title) { #
                                                            <p class="item-text tit">#: title #</p>
                                                            # } #
                                                            # if (txt) { #
                                                            <p class="item-text">#: txt #</p>
                                                            # } #
                                                            # if (stxt) { #
                                                            <p class="item-text stxt">#: stxt #</p>
                                                            # } #
                                                        </div>
                                                    </div>
                                                    <div class="item-right">
                                                        <ul class="form-checkbox-group">
                                                            <li>
                                                                <input type="checkbox" name="" id="" class="k-checkbox" data-check-row="" checked="">
                                                                <label class="k-checkbox-label" for="06_01_001_Y"></label>
                                                            </li>
                                                            <li>
                                                                <input type="checkbox" name="" id="" class="k-checkbox" data-check-row="" >
                                                                <label class="k-checkbox-label" for="06_01_001_N"></label>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    # if (next && date) { #
                                                    <div class="date-text unit-icon date">
                                                        <span class="item-sub-text">#: next #</span>
                                                        <span class="item-text">#: date #</span>
                                                    </div>
                                                    # } #
                                                    <div class="form-item">
                                                        <div class="form-item-inner">
                                                            <textarea class="form-textarea" placeholder="상세내역 및 권장사항(fix)"></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            </script>
                                            <script>
                                                var groupedData3 = [
                                                    {
                                                        title: "main title", 
                                                        txt: "sub title",
                                                        stxt: "text",
                                                        next: "NEXT SVC",
                                                        date: "0000.00.00",
                                                    },
                                                    {
                                                        title: "", 
                                                        txt: "sub title",
                                                        stxt: "text",
                                                        next: "",
                                                        date: "",
                                                    },
                                                    {
                                                        title: "main title", 
                                                        txt: "",
                                                        stxt: "",
                                                        next: "",
                                                        date: "",
                                                    },
                                                ];
                                                $(document).ready(function () { 
                                                    // 사진촬영
                                                    $("#listview3").kendoMobileListView({
                                                        dataSource: kendo.data.DataSource.create({data: groupedData3}),
                                                        template: kendo.template($("#tmp3").html()),
                                                    });
                                        
                                                });
                                            </script>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <!-- 아코디언2-->
                            <ul class="accordion" id="accordion2">
                                <li class="accordion-item">
                                    <div class="accordion-header">
                                        <div class="accordion-title title-flex">
                                            <div class="title-left">
                                                <p class="title">Insert text</p>
                                            </div>
                                        </div>
                                        <button class="accordion-btn">
                                            <span class="sr-only">펼침</span>
                                        </button>
                                    </div>
                                    <div class="accordion-panel">
                                        <div class="item-text-group chk-list-tit">
                                            <div class="tit">점검 리스트</div>
                                             <!-- 체크박스가 3개일경우 chk03추가 -->
                                            <div class="chk03">
                                                <p class="item-text">교환요망</p>
                                                <p class="item-text">추가확인</p>
                                                <p class="item-text">정&nbsp;&nbsp;상</p>
                                            </div>
                                        </div>
                                        <div class="agreement-area-wrap">
                                            <ul id="listview4" class="list-group" data-role="listview"></ul>
                                            <script id="tmp4" type="text/x-kendo-template">
                                                <div class="item-area">
                                                    <div class="item-left item-flex">
                                                        <div class="item-left">
                                                            # if (title) { #
                                                            <p class="item-text tit">#: title #</p>
                                                            # } #
                                                            # if (txt) { #
                                                            <p class="item-text">#: txt #</p>
                                                            # } #
                                                            # if (stxt) { #
                                                            <p class="item-text stxt">#: stxt #</p>
                                                            # } #
                                                        </div>
                                                    </div>
                                                    <!-- 체크박스가 3개일경우 chk03추가 -->
                                                    <div class="item-right chk03">
                                                        <ul class="form-checkbox-group">
                                                            <li>
                                                                <input type="checkbox" name="" id="" class="k-checkbox" data-check-row="">
                                                                <label class="k-checkbox-label" for="06_01_001_Y"></label>
                                                            </li>
                                                            <li>
                                                                <input type="checkbox" name="" id="" class="k-checkbox" data-check-row="" checked="">
                                                                <label class="k-checkbox-label" for="06_01_001_Y"></label>
                                                            </li>
                                                            <li>
                                                                <input type="checkbox" name="" id="" class="k-checkbox" data-check-row="" >
                                                                <label class="k-checkbox-label" for="06_01_001_N"></label>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    # if (next && date) { #
                                                    <div class="date-text unit-icon date">
                                                        <span class="item-sub-text">#: next #</span>
                                                        <span class="item-text">#: date #</span>
                                                    </div>
                                                    # } #
                                                    <div class="form-item">
                                                        <div class="form-item-inner">
                                                            <textarea class="form-textarea" placeholder="상세내역 및 권장사항(fix)"></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            </script>
                                            <script>
                                                var groupedData4 = [
                                                    {
                                                        title: "main title", 
                                                        txt: "sub title",
                                                        stxt: "text",
                                                        next: "NEXT SVC",
                                                        date: "0000.00.00",
                                                    },
                                                    {
                                                        title: "main title", 
                                                        txt: "",
                                                        stxt: "",
                                                        next: "",
                                                        date: "",
                                                    },
                                                    {
                                                        title: "", 
                                                        txt: "text",
                                                        stxt: "",
                                                        next: "",
                                                        date: "",
                                                    },
                                                ];
                                                $(document).ready(function () { 
                                                    // 사진촬영
                                                    $("#listview4").kendoMobileListView({
                                                        dataSource: kendo.data.DataSource.create({data: groupedData4}),
                                                        template: kendo.template($("#tmp4").html()),
                                                    });
                                        
                                                });
                                            </script>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <!--아코디언3-->
                            <span class="sample-tit">Time cloking</span>
                            <ul class="accordion time-cloking" id="accordion3">
                                <li class="accordion-item">
                                    <div class="accordion-header">
                                        <div class="accordion-title title-flex">
                                            <div class="title-left">
                                                <!--N : title 색상 추가시 fc-point -->
                                                <p class="title fc-point">[경] RO2829020009</p>
                                                <!--<div class="text-link-view">
                                                    <a href="javascript:;" class="icon-view">
                                                        <span class="sr-only">문서보기</span>
                                                    </a>
                                                </div>-->
                                            </div>
                                            <div class="title-right">
                                                <p class="text bold">923가6234</p>
                                                <p class="text">09-20 22:40</p>
                                            </div>
                                        </div>
                                        <button class="accordion-btn">
                                            <span class="sr-only">펼침</span>
                                        </button>
                                    </div>
                                    <div class="accordion-panel">
                                        <div class="agreement-area-wrap">
                                            <div class="card-list">
                                                <!-- s : 전체 체크 버튼-->
                                                <div class="list-header dis-block">
                                                    <!--
                                                        <div class="list-header-left">
                                                            <p class="total-count-area">총 <span class="num">6</span>건</p>
                                                        </div>
                                                    -->
                                                        <!--N : list-header-center -> content-btn-sgroup로 클래스 변경 및 btn-secondary 클래스 삭제, 스타일제거 -->
                                                        <div class="content-btn-sgroup">
                                                            <button type="button" class="btn btn-sm btn-sub btn-util document">
                                                                <span>작업지시서</span>
                                                            </button>
                                                            <button type="button" class="btn btn-sm btn-sub btn-util write">
                                                                <span>작업자의견</span>
                                                            </button>
                                                            <button type="button" class="btn btn-sm btn-sub btn-util time">
                                                                <span>타임클락킹취소</span>
                                                            </button>
                                                        </div>
                                                        <!--N : agreement-btn -> content-btn-sgroup로 클래스 변경-->
                                                        <div class="content-btn-sgroup">
                                                            <!--작업종료 일경우 : end, 완료 : complete, 진행중 : ing-->
                                                            <button type="button" class="btn btn-secondary btn-list-chk">
                                                                <strong>10000</strong>
                                                                <strong>작업내용<span>[총5건]</span></strong>
                                                                <span class="pos-abs label end">작업종료</span>
                                                            </button>
                                                        </div>
                                                </div>
                                                <!--e : 전체 체크 버튼-->
                                                <ul id="listview1B" class="list-group check-list" data-role="listview"></ul>
                                                <script id="tmp5" type="text/x-kendo-template">
                                                    <div>
                                                        <input type="checkbox" id="#: checkbox.checkId #" class="list-checkbox" #: checkbox.option #>
                                                        <label for="#: checkbox.checkId #" class="list-checkbox-label">
                                                            <div class="item-area">
                                                                <div class="item-area-con">
                                                                    <div class="item-link-group #: status #">
                                                                        <a href="#: link #" class="link-arr-text aDetail">공임상세</a>
                                                                        <span class="status-text #: status #"></span>
                                                                    </div>
                                                                    <div class="item-text-group">
                                                                        <p class="item-text">#: title #</p>
                                                                    </div>
                                                                    <div class="item-md-text-group">
                                                                        <p class="item-md-text">#: text1 #</p>
                                                                        <p class="item-md-text">#: text2 #</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </label>
                                                    </div>
                                                </script>
                                                <script>
                                                    /** status 에서 작업종료 : end, 작업완료 : complet, 진행중 : ing 사용**/
                                                    var groupedData1B = [
                                                        {
                                                            link: "javascript:;",
                                                            status: "ing",
                                                            title: "액티브 스태빌라이저 액티브 스태빌라이저 텍스트 테스트 테스트", 
                                                            text1: "10FRU",
                                                            text2: "15:10~15:30",
                                                            checkbox : {checkId : "checkB1", option: "checked"}
                                                        },
                                                        {
                                                            link: "javascript:;",
                                                            status: "",
                                                            title: "엔진오일교체", 
                                                            text1: "10FRU",
                                                            text2: "15:10~15:30",
                                                            checkbox : {checkId : "checkB2", option: ""}
                                                        },
                                                        {
                                                            link: "javascript:;",
                                                            status: "",
                                                            title: "엔진오일교체 및 기타", 
                                                            text1: "10FRU",
                                                            text2: "15:10~15:30",
                                                            checkbox : {checkId : "checkB3", option: ""}
                                                        },
                                                    ];
                                                    $(document).ready(function () { 
                                                        $("#listview1B").kendoMobileListView({
                                                            dataSource: kendo.data.DataSource.create({data: groupedData1B}),
                                                            template: kendo.template($("#tmp5").html()),

                                                        });
                                                        //s : 퍼블용 버튼 클릭이벤트
                                                        $(".btn-list-chk").click(function () {
                                                            var isActive = $(this).hasClass("active");
                                                            
                                                            if (isActive) {
                                                                $(this).removeClass("active"); 
                                                                $("#listview1B input[type='checkbox']").prop("checked", false);
                                                            } 
                                                            else {
                                                                $(this).addClass("active"); 
                                                                
                                                                $("#listview1B input[type='checkbox']").prop("checked", true);
                                                            }
                                                        });

                                                        $("#listview1B").on("change", "input[type='checkbox']", function () {
                                                            var totalCheckboxes = $("#listview1B input[type='checkbox']").length;
                                                            var checkedCheckboxes = $("#listview1B input[type='checkbox']:checked").length;
                                                            
                                                            if (totalCheckboxes === checkedCheckboxes) {
                                                                $(".btn-list-chk").addClass("active"); 
                                                            } 
                                                            else {
                                                                $(".btn-list-chk").removeClass("active");
                                                            }
                                                        });
                                                        //e : 퍼블용 버튼 클릭이벤트

                                                    });
                                                </script>
                                            </div><!--//card-list-->
                                            <div class="agreement-btn">
                                                <button type="button" class="btn btn-secondary btn-sm">추가작업승인요청</button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                
                            </ul>
                             <!--아코디언3-->
                             <span class="sample-tit">고객서명</span>
                             <ul class="accordion time-cloking" id="accordion4">
                                 <li class="accordion-item">
                                     <div class="accordion-header">
                                         <div class="accordion-title title-flex">
                                             <div class="title-left">
                                                 <p class="title">작업내용</p>
                                             </div>
                                         </div>
                                         <button class="accordion-btn">
                                             <span class="sr-only">펼침</span>
                                         </button>
                                     </div>
                                     <div class="accordion-panel">
                                        <div class="agreement-area-wrap">
                                            <ul id="" class="list-group type2" data-role="listview">
                                                <li>
                                                    <div class="group-header bp">
                                                        <div class="item-link-group">
                                                            <div class="label-thirds horizontal">
                                                                <span class="label-con">10000</span>
                                                                <span class="label-con">BP-INS</span>
                                                                <span class="label-con">AXA손해보험</span>
                                                            </div>
                                                        </div>
                                                        <div class="text">
                                                            <span>90,000km 정기 점검/엔진오일 오일필터 포함</span>
                                                            <span>상세 내용을 입력하는 란 입니다. 
                                                                90,000km 정기 점검/엔진오일 오일필터 포함</span>
                                                        </div>
                                                     </div><!--//group-header-->
                                                    <ol class="listnum">
                                                        <li>
                                                            <div class="item-area">
                                                                <div class="item-area-con">
                                                                    <div class="item-md-text-group">
                                                                        <p class="item-md-text">STICKER</p>
                                                                        <p class="item-md-text">000010006E</p>
                                                                    </div>
                                                                    <div class="item-md-text-group">
                                                                        <p class="item-md-text">1.00TU</p> <!-- 수량 -->
                                                                        <p class="item-md-text">1,400</p>  <!-- 단가 -->
                                                                        <p class="item-md-text">1,400</p>   <!-- 금액 -->
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ol>
                                                </li>
    
                                            </ul>
                                            
                                        </div>
                                    </div>
                                 </li>
                             </ul>
                        </>
                        <div class="info-sec">
                            <ul id="listview_TC" class="list-agreement" data-role="listview">
                                <li>
                                <!--N : div class="main" 부분 태그 구조 변경-->
                                <div class="item-text-group chk-list-tit">
                                    <div class="tit">정비 최종 기술 검사</div>
                                    <div>
                                        <p class="item-text">OK</p>
                                        <p class="item-text">N.OK</p>
                                    </div>
                                </div>
                                <div class="card-list">
                                    <ul id="sublistview_01" class="list-group check-list" data-role="listview"></ul>
                                    <script id="tmp7" type="text/x-kendo-template">
                                        <div class="item-area">
                                            <div class="item-left break">
                                                <!--N : bold - tit로 변경 -->
                                                <p class="item-text tit">지침에 따라 모든 작업이 완료되었는가? 주문 상의 서명, 점검하였는가?</p>
                                                <p class="item-md-text"></p>
                                            </div>
                                            <!-- form-radio-group -> form-checkbox-group 클래스 변경 -->
                                            <div class="item-right">
                                                <ul class="form-checkbox-group">
                                                    <li>
                                                        <input type="radio" class="form-radio" name="01_001" id="01_001_Y" value="Y">
                                                        <label class="form-radio-label" for="01_001_Y"></label>
                                                    </li>
                                                    <li>
                                                        <input type="radio" class="form-radio" name="01_001" id="01_001_N" value="N">
                                                        <label class="form-radio-label" for="01_001_N"></label>
                                                    </li>
                                                </ul>
                                            <div>
                                        </div>		
                                    </script>
                                    <script>
                                        // 사진촬영 data
                                        var groupedData = [
                                            {
                                                title: "차량외관", 
                                                date: "",
                                            },
                                            {
                                                title: "사고부위", 
                                                date: "2021-07-21 15:30:00",
                                            },
                                        ];
                                        $(document).ready(function () { 
                                            // 사진촬영
                                            $("#sublistview_01").kendoMobileListView({
                                                dataSource: kendo.data.DataSource.create({data: groupedData}),
                                                template: kendo.template($("#tmp7").html()),
                                            });
                                
                                        });
                                    </script>
                                    
                                </div>
                                <!--
                                <div class="card-list">
                                    <ul id="listview2" class="list-group check-list" data-role="listview"></ul>
                                    <div class="km-listview-wrapper">
                                        <ul id="sublistview_01"
                                            class="list-group check-list km-widget km-listview km-list"
                                            data-role="listview">
                                            <li data-uid="a56c5042-50d0-4848-a8c2-636c5668c551">
                                                <div class="item-area">
                                                    <div class="item-left break">
                                                        <p class="item-text bold">지침에 따라 모든 작업이 완료되었는가? 주문 상의 서명,
                                                            점검하였는가?</p>
                                                        <p class="item-md-text"></p>
                                                    </div>


                                                    <ul class="form-radio-group">
                                                        <li>
                                                            <input type="radio" class="form-radio" name="01_001"
                                                                id="01_001_Y" value="Y">
                                                            <label class="form-radio-label" for="01_001_Y"></label>
                                                        </li>
                                                        <li>
                                                            <input type="radio" class="form-radio" name="01_001"
                                                                id="01_001_N" value="N">
                                                            <label class="form-radio-label" for="01_001_N"></label>
                                                        </li>
                                                    </ul>

                                                </div>
                                            </li>
                                            <li data-uid="aee0536c-f3ce-48b7-9b3c-eb819d05d89e">
                                                <div class="item-area">
                                                    <div class="item-left break">
                                                        <p class="item-text bold">작업완료 시간을 준수하였는가?</p>
                                                        <p class="item-md-text"></p>
                                                    </div>


                                                    <ul class="form-radio-group">
                                                        <li>
                                                            <input type="radio" class="form-radio" name="01_002"
                                                                id="01_002_Y" value="Y">
                                                            <label class="form-radio-label" for="01_002_Y"></label>
                                                        </li>
                                                        <li>
                                                            <input type="radio" class="form-radio" name="01_002"
                                                                id="01_002_N" value="N">
                                                            <label class="form-radio-label" for="01_002_N"></label>
                                                        </li>
                                                    </ul>

                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>-->
                                </li>
                            </ul>
                        </div>
                        <div class="info-sec">
                            <div class="title-area">
                                <div class="title-left">
                                    <p class="title">작업항목</p>
                                </div>
                            </div>
                            <div class="card-list">
                                <ul id="listview1" class="list-group check-list type3" data-role="listview"></ul>
                                <script id="tmp1" type="text/x-kendo-template">
                                    <input type="checkbox" id="#: checkbox.checkId #" class="list-checkbox" #: checkbox.option #>
                                    <label for="#: checkbox.checkId #" class="list-checkbox-label">
                                        <div class="item-area">
                                            <div class="item-area-con item-flex">
                                                <div class="item-left">
                                                    <!-- label 클래스 
                                                        상담완료 : label-half color1
                                                        검사완료 : label-half color2
                                                    -->
                                                    <div class="label-half horizontal #: label1.color #">
                                                        <span class="label-con label-text1">#: label1.text1 #</span>
                                                        <span class="label-con label-text1">#: label1.text2 #</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="item-area-con">
                                                <div class="item-text-group">
                                                    <p class="item-text">#: textInfo #</p>
                                                </div>
                                            </div>
                                            <div class="item-area-con text-group-flex item-flex flex-end">
                                                <div class="item-left">
                                                    <p class="item-text"></p>
                                                </div>
                                                <div class="item-right item-flex">
                                                    <div class="item-text-group">
                                                        <p class="item-text">작업자</p>
                                                        <p class="item-text">#: user #</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                    <!-- nodata 일 때 -->
                                    <!-- <div class="item-area">
                                        <p class="nodata">조회된 데이터가 없습니다.</p>
                                    </div> -->
                                    <!-- nodata 일 때 -->
                                </script>
                                <!-- // list template -->
                            
                                <script>
                                    // 작업항목 data
                                    var groupedData1 = [
                                    {
                                            label1: { text1: "상담완료", text2: "일반", color: "color1"},
                                            textInfo: "작업내용",
                                            user: "홍길동",
                                            checkbox : {checkId : "check1B1", option: ""}
                                        },
                                        {
                                            label1: { text1: "검사완료", text2: "사고", color: "color2"},
                                            textInfo : "작업내용",
                                            user: "홍길동",
                                            checkbox : {checkId : "check1B2", option: ""}
                                        }
                                    ];
                                    
                            
                                    $(document).ready(function () { 
                                        // listview
                                        // 판매기회
                                        $("#listview1").kendoMobileListView({
                                            dataSource: kendo.data.DataSource.create({data: groupedData1}),
                                            template: kendo.template($("#tmp1").html()),
                                        });
                            
                                    });
                                </script>
                            </div>
                        </div>
                        <!--서명-->
                        <div class="info-sec">
                            <div class="title-area">
                                <div class="title-left">
                                    <p class="title">서명</p>
                                </div>
                            </div>
                            <div class="agreement-area-wrap">
                                <div class="agreement-area">
                                    <div class="agreement-body">
                                        <div class="customer-sign">
                                            <a href="javascript:;" class="sign-area">
                                                <!-- 이미지 없을 때 '서명하기' 디폴트 문구 출력 -->
                                                <!-- <div class="sign-img-con"></div> -->
                                                <!-- // 이미지 없을 때 '서명하기' 디폴트 문구 출력 -->
                                                <div class="sign-img-con">
                                                    <img src="../../../images/temp/@signature_img.png" alt="">
                                                </div>
                                                <div class="sign-info-group">
                                                    <p class="sign-info-date">2021년 12월 20일</p>
                                                    <p class="sign-info-name">
                                                        <span class="sign-title">이름</span>
                                                        <span class="sign-name">홍길동</span>
                                                    </p>
                                                </div>
                                            </a>
                                        </div>  
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--하단버튼 영역-->
            <div class="modal-footer">
    
            </div>
        </div>

        <div class="modal-confirm alert">
            <div class="modal-content">
                <div id="alert"></div>
                <script id="tmpAlert" type="text/x-kendo-template">
                    <div class="modal-body mo-body">
                        <p class="modal-title">#: title #</p>
                        <p class="modal-text">#: text #</p>
                    </div>
                    <div class="modal-footer">
                        <div class="footer-btn">
                            # if (showCancelButton) { #
                                <button type="button" class="btn btn-secondary cancelButton">취소</button>
                            # } #
                            # if (showConfirmButton) { #
                                <button type="button" class="btn btn-primary confirmButton">확인</button>
                            # } #
                        </div>
                    </div>
                </script>
            </div>
        </div>
        
        <script>
            $(document).ready(function () { 
                // 알럿 데이터 정의
                var dataSets = {
                    button1: { title: "Main title", text: "내용을 입력하는 란 입니다. ", showCancelButton: true, showConfirmButton: true },
                    button2: { title: "Main title", text: "내용을 입력하는 란 입니다.<br> 길이에 따라 늘어나요 ", showCancelButton: false, showConfirmButton: true },
                };
    
                // 각각의 버튼 클릭 시 알림창 표시
                $("#alertBtn1").click(function() {
                    showModal(dataSets.button1);
                });
    
                $("#alertBtn2").click(function() {
                    showModal(dataSets.button2);
                });

                function showModal(data) {
                    $(".modal-confirm").addClass("show");
                    var template = kendo.template($("#tmpAlert").html());
                    $("#alert").html(template(data));
    
                    $(".cancelButton").click(function() {
                        $(".modal-confirm").removeClass("show");
                    });
    
                    $(".confirmButton").click(function() {
                        $(".modal-confirm").removeClass("show");
                    });
                }
            });
        </script>

        <script>
            // 아코디언
            var acc1 = document.querySelector("#accordion1");
            var acc2 = document.querySelector("#accordion2");
            var acc3 = document.querySelector("#accordion3");
            var acc4 = document.querySelector("#accordion4");
            accordionEvent(acc1);
            accordionEvent(acc2);
            accordionEvent(acc3);
            accordionEvent(acc4);

        </script>



</body>
</html>

