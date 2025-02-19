(function(window, document, $) {

	'use strict';

	var serviceJs = {
	};

	serviceJs = {

        /**
         * 서비스캠페인, 일괄캠페인, 고객요구사항, 고장설명, 기타사항 초기화
         */
        commonInit : function(preFixId) {
            $("#dmsForm").get(0).reset();
            $("#allCampaignGrid").data("kendoExtGrid").dataSource.data([]);
            $("#serCampaignGrid").data("kendoExtGrid").dataSource.data([]);
            $("#partGrid").data('kendoExtGrid').dataSource.data([]);
            if(preFixId != 'PRE'){
                $("#lbrGrid").data('kendoExtGrid').dataSource.data([]);
            }
            $("#custRemarkGrid").data('kendoExtGrid').dataSource.data([]);
            $(".btn_s.btn_s_v4.troble").removeClass("btn_active");
            $("#etcIssueGrid").data('kendoExtGrid').dataSource.data([]);

            /**
             * 서비스 알람 초기화
            */
            if(preFixId != undefined){
                //예약 그리드
                $("#resvKanbanGrid").data('kendoExtGrid').dataSource.data([]);
                //부품 그리드
                $("#partResvKanbanGrid").data('kendoExtGrid').dataSource.data([]);
                //견적 그리드
                $("#estKanbanGrid").data('kendoExtGrid').dataSource.data([]);
                ////구원서비스 그리드
                $("#helpSvcKanbanGrid").data('kendoExtGrid').dataSource.data([]);
            }


        },

        commonListInit : function(preFixId) {
            $("#partGrid").data('kendoExtGrid').dataSource.data([]);
            if(preFixId != 'PRE'){
                $("#lbrGrid").data('kendoExtGrid').dataSource.data([]);
            }
            $("#custRemarkGrid").data('kendoExtGrid').dataSource.data([]);
            $(".btn_s.btn_s_v4.troble").removeClass("btn_active");
            $("#etcIssueGrid").data('kendoExtGrid').dataSource.data([]);
        },

        setRpirRate : function(arr, roTp, rpirCd){

         // 임률 데이터 배열을 맵으로 변환한다.
            var rateMap = arr.reduce( function(map , obj){
                map[obj.rpirTp] = obj;
                return map;
              } ,{});

            var resultVal = "0";
            if(rpirCd == "" || rpirCd == null){
                return resultVal = eval("rateMap['01'].rpir"+roTp);
            }

            /**
              수리유형
              01 : 검사조정
              02 : 정기점검
              03 : 기계수리
              04 : 판금페인트
              05 : 악세사리
            **/

            if(rateMap[rpirCd] != undefined){ // 일반
                resultVal = eval("rateMap[rpirCd].rpir"+roTp);
            }else{ // 클레임 일경우
                var claimTp = "01";

                if(rpirCd == "P") claimTp ="04"; //판금페인트
                if(roTp == "02"){
                    resultVal = eval("rateMap[claimTp].rpir"+roTp);
                }else{//일반수리
                    resultVal = eval("rateMap[claimTp].rpir"+roTp);
                }
            }
            return resultVal;


        }



    };

	window.serviceJs = serviceJs;

}(window, document, jQuery));
