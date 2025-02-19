
var groupBy = ({ Group: array, By: props }) => {
	getGroupedItems = (item) => {
		returnArray = [];
		let i;
		for (i = 0; i < props.length; i++) {
			returnArray.push(item[props[i]]);
		}
		return returnArray;
	};

	let groups = {};
	let i;

	for (i = 0; i < array.length; i++) {
		const arrayRecord = array[i];
		const group = JSON.stringify(getGroupedItems(arrayRecord));
		groups[group] = groups[group] || [];
		groups[group].push(arrayRecord);
	}
	return Object.keys(groups).map((group) => {
		return groups[group];
	});
};



(function(window, document, $) {

	'use strict';

	var sal = window.sal? window.sal:{};

	sal.car = {

		/*
        ---------------------------------------------------------
            메모리에 있는 차량 이미지를 불러온다..
            Ex) sal.car.bodyImgSetting(sBrandCd, sSeries1Cd , sBodyCd);
         ---------------------------------------------------------
        */

		bodyImgSetting : function(sBrandCd, sSeries1Cd , sBodyCd){
			var content = "";
			var delimeter ="_";

			var imgList = [{"imgTp":"THUMB"},{"imgTp":"EX"},{"imgTp":"INT"}];

			imgList.forEach(function( obj , idx ){
				content += "<div class='slick-slide'>";
				content += "<img src=\'"+'/resources/images/spec/'+obj.imgTp +delimeter+sBrandCd+delimeter+sSeries1Cd+delimeter+sBodyCd+".jpg\' >";
				content += "</div>";
			});

			if(content != ""){
				$(".slick-evt").html(content);
				$(".slick-evt").show();
				$(".slick-area-nav").show();
				$(".nodata").hide();
			}

			// 21.11.08 추가 : slide - slick
			$(".slick-evt").slick({
				dots: true,
				appendDots: $('.slick-area-nav-dots'),
				infinite: true,
				customPaging: function(slick,index) {
					return '<span class="slick-dots-num">' + (index + 1) + '</span>';
				},
				prevArrow: $('.slick-area-prev'),
				nextArrow: $('.slick-area-next')
			});

		},
		/*
        ---------------------------------------------------------
            차량 이미지를 불러온다..
            Ex) sal.car.imageSetting(sBrandCd, sSeries1Cd , sModelCd , docType);
         ---------------------------------------------------------
        */

		imageSetting : function(sBrandCd, sSeries1Cd , sModelCd , docType, from){

			var param = {};
			param["sBrandCd"] = sBrandCd;
			param["sSeries1Cd"] = sSeries1Cd;
			param["sModelCd"] = sModelCd;

			var content = "";
			var sDocType= "";
			if(dms.string.isEmpty(docType)){
				sDocType = "sal";
			}else{
				sDocType = docType;
			}

			$.ajax({
				url:"/sal/carMng/selectCarImgFileDocNo.do"
				,data:JSON.stringify(param)
				,type:'POST'
				,dataType:'json'
				,contentType:'application/json'
				,error:function(jqXHR,status,error){
					//dms.notification.warning(jqXHR.responseJSON.errors[0].errorMessage);
				}
				,success:function(result){
					//썸네일

					if (dms.string.isNotEmpty(result.thumbFileDocNo)) { ////썸네일
						var fileUrl = "";
						fileUrl = "/cmm/sci/fileUpload/link.do?fileDocNo="+result.thumbFileDocNo+"&fileNo=1&inline=true&docNoYn=true&downloadDocType="+sDocType+"";
						content += "<div class='slick-slide'>";
						content += "<img src=\'"+fileUrl+"\' >";
						content += "</div>";

					}
					if (dms.string.isNotEmpty(result.exFileDocNo)) { //외장
						var fileUrl = "";
						fileUrl = "/cmm/sci/fileUpload/link.do?fileDocNo="+result.exFileDocNo+"&fileNo=1&inline=true&docNoYn=true&downloadDocType="+sDocType+"";
						content += "<div class='slick-slide'>";
						content += "<img src=\'"+fileUrl+"\' >";
						content += "</div>";
					}
					if (dms.string.isNotEmpty(result.intFileDocNo)) { //내장
						var fileUrl = "";
						fileUrl = "/cmm/sci/fileUpload/link.do?fileDocNo="+result.intFileDocNo+"&fileNo=1&inline=true&docNoYn=true&downloadDocType="+sDocType+"";
						content += "<div class='slick-slide'>";
						content += "<img src=\'"+fileUrl+"\' >";
						content += "</div>";
					}

					if(dms.string.isNotEmpty(content)){
						$(".slick-evt").html(content);
						$(".slick-evt").show();
						$(".slick-area-nav").show();
						$(".nodata").hide();
					}


					if(from != undefined && from == 'untact'){
						// 21.11.08 추가 : slide - slick
						$(".slick-evt").slick({
							dots: true,
							appendDots: $('.slick-area-nav-dots'),
							infinite: false,
							customPaging: function(slick,index) {
								return '<span class="slick-dots-num">' + (index + 1) + '</span>';
							},
							prevArrow: $('.slick-area-prev'),
							nextArrow: $('.slick-area-next'),
						});
					}else{
						// 21.11.08 추가 : slide - slick
						$(".slick-evt").slick({
							dots: true,
							appendDots: $('.slick-area-nav-dots'),
							infinite: true,
							customPaging: function(slick,index) {
								return '<span class="slick-dots-num">' + (index + 1) + '</span>';
							},
							prevArrow: $('.slick-area-prev'),
							nextArrow: $('.slick-area-next'),
							// 21.12.15 수정 : slick adaptiveHeight: true 옵션 추가
							adaptiveHeight: true
						});
					}



					/*
                    $.ajax({
                        url:"/cmm/sci/fileUpload/selectFiles.do"
                        ,data:JSON.stringify({"sFileDocNo":result.thumbFileDocNo})
                        ,type:'POST'
                        ,dataType:'json'
                        ,async: false
                        ,contentType:'application/json'
                        ,error:function(jqXHR,status,error){
                            //dms.notification.warning(jqXHR.responseJSON.errors[0].errorMessage);
                        }
                        ,success:function(result){
                            var fileUrl = "";

                            for(var i=0;i<result.data.length;i++){//_contextPath+
                                fileUrl = "/cmm/sci/fileUpload/link.do?fileDocNo="+result.data[i].fileDocNo+"&fileNo="+result.data[i].fileNo+"&inline=true&downloadDocType="+result.data[i].remark+"";
                                content += "<div class='slick-slide'>";
                                content += "<img src=\'"+fileUrl+"\' >";
                                content += "</div>";
                            }
                        }
                    });


                    //썸네일

                    //외장사진
                    $.ajax({
                        url:"/cmm/sci/fileUpload/selectFiles.do"
                        ,data:JSON.stringify({"sFileDocNo":result.exFileDocNo})
                        ,type:'POST'
                        ,dataType:'json'
                        ,async: false
                        ,contentType:'application/json'
                        ,error:function(jqXHR,status,error){
                            //dms.notification.warning(jqXHR.responseJSON.errors[0].errorMessage);
                        }
                        ,success:function(result){
                            var fileUrl = "";

                            for(var i=0;i<result.data.length;i++){//_contextPath+
                                fileUrl = "/cmm/sci/fileUpload/link.do?fileDocNo="+result.data[i].fileDocNo+"&fileNo="+result.data[i].fileNo+"&inline=true&downloadDocType="+result.data[i].remark+"";
                                content += "<div class='slick-slide'>";
                                content += "<img src=\'"+fileUrl+"\' >";
                                content += "</div>";
                            }
                        }
                    });
                    //외장사진

                    //내장사진
                    $.ajax({
                        url:"/cmm/sci/fileUpload/selectFiles.do"
                        ,data:JSON.stringify({"sFileDocNo":result.intFileDocNo})
                        ,type:'POST'
                        ,dataType:'json'
                        ,async: false
                        ,contentType:'application/json'
                        ,error:function(jqXHR,status,error){
                            //dms.notification.warning(jqXHR.responseJSON.errors[0].errorMessage);
                        }
                        ,success:function(result){
                            var fileUrl = "";

                            for(var i=0;i<result.data.length;i++){//_contextPath+
                                fileUrl = "/cmm/sci/fileUpload/link.do?fileDocNo="+result.data[i].fileDocNo+"&fileNo="+result.data[i].fileNo+"&inline=true&downloadDocType="+result.data[i].remark+"";
                                content += "<div class='slick-slide'>";
                                content += "<img src=\'"+fileUrl+"\' >";
                                content += "</div>";
                            }

                            if(content != ""){
                                $(".slick-evt").html(content);
                                $(".slick-evt").show();
                                $(".slick-area-nav").show();
                                $(".nodata").hide();
                            }

                            // 21.11.08 추가 : slide - slick
                            $(".slick-evt").slick({
                                dots: true,
                                appendDots: $('.slick-area-nav-dots'),
                                infinite: true,
                                customPaging: function(slick,index) {
                                    return '<span class="slick-dots-num">' + (index + 1) + '</span>';
                                },
                                prevArrow: $('.slick-area-prev'),
                                nextArrow: $('.slick-area-next')
                            });
                        }
                    });
                    //내장사진

                    */
				}
			});

		},
		/*
        ---------------------------------------------------------
            차량 이미지를 불러온다..
            Ex) sal.car.vehImageInfo(sBrandCd, sSeries1Cd , sModelCd , sExColorCd, sIntColorCd, docType,thumYn);
         ---------------------------------------------------------
        */
		vehImageInfo : function(sBrandCd, sSeries1Cd , sModelCd, sPkgGrpCd , sExColorCd, sIntColorCd ,thumYn, docType){

			let sThumYn="Y";
			let param = {};
			param["sBrandCd"] 		= sBrandCd;
			param["sSeries1Cd"] 	= sSeries1Cd;
			param["sModelCd"] 		= sModelCd;
			param["sPkgGrpCd"] 		= sPkgGrpCd;
			param["sExColorCd"] 	= sExColorCd;
			param["sIntColorCd"] 	= sIntColorCd;
			param["sReTryImgYn"] 	= "N";

			if(dms.string.isEmpty(thumYn)){
				sThumYn = "N";
			}
			param["sThumbYn"] 		= sThumYn;

			let content = "";
			let sDocType= "";
			if(dms.string.isEmpty(docType)){
				sDocType = "sal";
			}else{
				sDocType = docType;
			}

			$.ajax({
				url:"/sal/vehImg/selectVehicleImageInfo.do"
				,data:JSON.stringify(param)
				,type:'POST'
				,dataType:'json'
				,contentType:'application/json'
				,error:function(jqXHR,status,error){
					//dms.notification.warning(jqXHR.responseJSON.errors[0].errorMessage);
				}
				,success:function(result){

					if($(".slick-evt").children().length > 0){
						$(".slick-evt").empty();
						$('.slick-evt').slick('slickRemove', null, null, true);
						$('.slick-evt').slick("unslick");
						$(".slick-evt").hide();
						$(".slick-area-nav").hide();
						$(".nodata").show();
					}
					result.forEach(function(data, idx){

						if (dms.string.isNotEmpty(data.fileDocNo) ) { //썸네일 제외
							if( (sThumYn == "N" && data.fileTp == "TH") ) return;

							let fileUrl = "";
							fileUrl = "/cmm/sci/fileUpload/link.do?fileDocNo="+data.fileDocNo+"&fileNo=1&inline=true&docNoYn=true&downloadDocType="+sDocType+"";
							content += "<div class='slick-slide'>";
							content += "<img src=\'"+fileUrl+"\' >";
							content += "</div>";

						}
					});

					if(dms.string.isNotEmpty(content)){
						$(".slick-evt").html(content);
						$(".slick-evt").show();
						$(".slick-area-nav").show();
						$(".nodata").hide();
					}

					// 21.11.08 추가 : slide - slick
					$(".slick-evt").slick({
						dots: true,
						appendDots: $('.slick-area-nav-dots'),
						infinite: true,
						customPaging: function(slick,index) {
							return '<span class="slick-dots-num">' + (index + 1) + '</span>';
						},
						prevArrow: $('.slick-area-prev'),
						nextArrow: $('.slick-area-next'),
						// 21.12.15 수정 : slick adaptiveHeight: true 옵션 추가 ->  삭제
						//adaptiveHeight: true
					});
				}
			});

		},

		downloadImgDoc:function(fileDocNo, fileNo, downloadDocType){
			location.href = "/cmm/sci/fileUpload/download.do?fileDocNo=" + fileDocNo + "&fileNo=" + fileNo+ "&downloadDocType=" + downloadDocType;
		}
		,download:function(fileDocNo, fileNo,downloadDocType){
			if(!sal.car.exist(fileDocNo, fileNo,downloadDocType)){
				dms.notification.error(dms.settings.defaultMessage.fileNotFound);
				return;
			}

			location.href =  "/cmm/sci/fileUpload/link.do?fileDocNo=" + fileDocNo + "&fileNo=" + fileNo+ "&downloadDocType=" + downloadDocType;
		}
		,preview:function(fileDocNo, fileNo,downloadDocType, popupWidth, popupHeight, popupTitle){
			if(!sal.car.exist(fileDocNo, fileNo,downloadDocType)){
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
					url:_contextPath + "/cmm/sci/fileUpload/link.do?fileDocNo=" + fileDocNo + "&fileNo=" + fileNo + "&inline=true"+ "&downloadDocType=" + downloadDocType
				}
			});
		}
		,exist:function(fileDocNo, fileNo,downloadDocType){
			var result = false;
			$.ajax({
				url:"/cmm/sci/fileUpload/selectExistFile.do?"+"fileDocNo="+fileDocNo+"&fileNo="+fileNo+ "&downloadDocType=" + downloadDocType
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

	};

	sal.fileView = {
		imageSetting: function(dlrCd, tdrvNo, docType){
			docType=dms.string.isEmpty(docType) ? "crm" : docType;

			var params = {
				"dlrCd": dlrCd,
				"tdrvNo": tdrvNo,
				"fileTp": ATCH
			};

			$.ajax({
				url:"/crm/tdrvReq/selectAttachmentFileList.do"
				,data:JSON.stringify(params)
				,type:'POST'
				,dataType:'json'
				,async:false
				,contentType:'application/json'
				,success:function(result){
					const fileList = result.data;

					let fileUrl = "";
					let content = "";

					if(fileList.length > 0) {
						fileList.forEach(item => {
							fileUrl = "/cmm/sci/fileUpload/link.do?fileDocNo=" + item.fileDocNo + "&fileNo=1&inline=true&docNoYn=true&downloadDocType=" + docType + "";

							content += "<div class='slick-slide'>";
							content += "<img src=\'" + fileUrl + "\' " + "style=width:358px;height:322px;" + ">";
							content += "</div>";
						})

						if(dms.string.isNotEmpty(content)){
							$(".slick-evt").html(content);
							$(".slick-evt").show();
							$(".slick-area-nav").show();
							$(".nodata").hide();
						}
					}

					$(".slick-evt").slick({
						dots: true,
						appendDots: $('.slick-area-nav-dots'),
						infinite: true,
						customPaging: function(slick,index) {
							return '<span class="slick-dots-num">' + (index + 1) + '</span>';
						},
						prevArrow: $('.slick-area-prev'),
						nextArrow: $('.slick-area-next'),
						adaptiveHeight: true
					});

				}
			});
		}
		, download: function (fileDocNo, fileNo, downloadDocType) {
			if (!sal.car.exist(fileDocNo, fileNo, downloadDocType)) {
				dms.notification.error(dms.settings.defaultMessage.fileNotFound);
				return;
			}

			location.href = "/cmm/sci/fileUpload/link.do?fileDocNo=" + fileDocNo + "&fileNo=" + fileNo + "&downloadDocType=" + downloadDocType;
		}
		, preview: function (fileDocNo, fileNo, downloadDocType, popupWidth, popupHeight, popupTitle) {
			if (!sal.car.exist(fileDocNo, fileNo, downloadDocType)) {
				dms.notification.error(dms.settings.defaultMessage.fileNotFound);
				return;
			}

			var title = popupTitle || dms.settings.defaultMessage.preview;
			var width = popupWidth || 950;
			var height = popupHeight || 500;

			dms.window.popup({
				windowId: "filePreviewPopup"
				, width: width
				, height: height
				, title: title
				, modal: true
				, content: {
					url: _contextPath + "/cmm/sci/fileUpload/link.do?fileDocNo=" + fileDocNo + "&fileNo=" + fileNo + "&inline=true" + "&downloadDocType=" + downloadDocType
				}
			});
		}
		, exist: function (fileDocNo, fileNo, downloadDocType) {
			var result = false;
			$.ajax({
				url: "/cmm/sci/fileUpload/selectExistFile.do?" + "fileDocNo=" + fileDocNo + "&fileNo=" + fileNo + "&downloadDocType=" + downloadDocType
				, type: 'GET'
				, async: false
				, success: function (data) {
					result = data;
				}
			});

			return result;
		}
	};

	sal.list = {

		/*
        ---------------------------------------------------------
            리스트를 Group By 한다.
            Ex) sal.list.groupBy(paramList, [ "seriesCd", "modelCd", "pkgGrpCd"]);
         ---------------------------------------------------------
        */
		groupBy : function(paramList, paramCdArr){

			var groupByList = groupBy( {Group: paramList, By: paramCdArr} );
			var returnList = [];


			$.each(groupByList, function(idx, data) {
				returnList.push(data[0]);
			});

			return returnList;
		}


		/*
        ---------------------------------------------------------
            리스트에서 해당하는 필드의 코드값으로 조회한다.
            Ex) sal.list.list(paramList, "1", "seriesCd" );
         ---------------------------------------------------------
        */
		,filter : function(paramList, paramCd, paramField){

			return paramList.filter(
				function(data){
					return data[paramField] == paramCd;

				}
			);
		}

	};

	sal.signature = {

		/*
        ---------------------------------------------------------
            해당하는 옵션의 서명 이미지 파일번호를 리턴한다.
            Ex) sal.signature.image(dlrCd, contNo, contStepTp, contSignTp);
         ---------------------------------------------------------
        */
		image : function(dlrCd,contNo, contStepTp, contSignTp){

			var responseJson = dms.ajax.getJson({
				url :"/sal/nextCont/selectContSignInfo.do"
				,data :JSON.stringify({"sDlrCd":dlrCd,"sContNo":contNo, "sContStepTp":contStepTp, "sContSignTp":contSignTp})
				,async :false
			});

			if(responseJson == null){
				responseJson = null;
			}

			return responseJson.contSignFileDocNo;
		}

		/*
        ---------------------------------------------------------
            해당하는 옵션의 서명 이미지 파일번호를 리턴한다.
            Ex) sal.signature.bpsImage(dlrCd,usedContNo, contStepTp, contSignTp);
         ---------------------------------------------------------
        */
		,bpsImage : function(dlrCd,usedContNo, contStepTp, contSignTp){

			var responseJson = dms.ajax.getJson({
				url :"/sal/bps/selectBpsContSignInfo.do"
				,data :JSON.stringify({"sDlrCd":dlrCd, "sUsedContNo":usedContNo, "sContStepTp":contStepTp, "sContSignTp":contSignTp})
				,async :false
			});

			if(responseJson == null){
				responseJson = null;
			}

			return responseJson.contSignFileDocNo;
		}

	};

	sal.esti = {

		/*
        ---------------------------------------------------------
            공채비용 계산 : 지역에 따른 공채비용 계산 함수 (인자 : 공채비용, 지역)
            Ex) sal.esti.getBondCost(val, bonTp);
         ---------------------------------------------------------
        */
		getBondCost : function(val,a){

			var rtnVal = 0;

			if(val == 0){
				rtnVal = 0;
			} else {
				//공채지역 : 서울(02), 부산(051), 대구(053)
				if(a == bondAreaTpSeoul ||
					a == bondAreaTpBusan ||
					a == bondAreaTpDaegu){
					var modVal = val % 10000;
					if(modVal < 2500){
						rtnVal = val - modVal;
					} else if(2500 <= modVal  && modVal < 7500){
						rtnVal = val - modVal + 5000;
					} else {
						rtnVal = Math.ceil(val/10000)* 10000;
					}
				} else if(a == bondAreaTpDaejeon ||
					a == bondAreaTpUlsan ||
					a == bondAreaTpGyeonggi ||
					a == bondAreaTpChungnam ||
					a == bondAreaTpJeonbuk ||
					a == bondAreaTpJeonnam){  //공채지역 : 대전(042), 울산(052), 경기(031), 충남(041), 전북(063), 전남(061)
					rtnVal = rtnVal = Math.round(val/10000)* 10000;
				} else if(a == bondAreaTpGwangju ||
					a == bondAreaTpJeju){  //공채지역 : 광주(062), 제주(064)
					var modVal = val % 10000;
					if(modVal < 5000){
						rtnVal = Math.floor(val/10000)* 10000;
					} else {
						rtnVal = (Math.floor(val/10000)* 10000) + 5000;
					}
				} else {  //공채지역 : 인천(032), 강원(033), 충북(043), 경북(054), 경남(055)
					rtnVal = Math.floor(val/5000)*5000;
				}
			}

			return rtnVal;
		}

		,fcaResMsg : function(resData){

			//4001 : Unauthorized Request
			//4002 : Missing Required Input (KEY,KEY,...)
			//4003 : Validation error (KEY,value)
			//       최소 대출금액은 20,000,000원 입니다
			//       선납금 최대치(100000%)를 초과하였습니다.
			//       이자율은 0% 이하로 내려갈 수 없습니다.
			//4004 : Product Not Found error
			//9998 : 고객 이자율 0% 이상일 경우에만 견적가능. 재 견적 진행 요청.

			if(resData.result_code == "500"){
				//FCA 서버로부터 응답을 받지 못했습니다.
				dms.notification.error("FCA 서버로부터 응답을 받지 못했습니다.");
				return false;
			}else if(resData.result_code == "200"){
				return true;
			}else{
				//FCA 에러응답값 : 에러문구
				dms.notification.error("FCA 에러응답값 : "+resData.result_msg);
				return false;
			}
		}
	};

    sal.contAppr = {

        /*
        ---------------------------------------------------------
            input데이터가 숫자일때 날짜형식인지 체크
            Ex) sal.contAppr.isPossibleDate(val, bonTp);
         ---------------------------------------------------------
        */
        isPossibleDate : function(number){
            // 2000년 1월 1일과 2070년 1월 1일 사이의 타임스탬프 범위
            const minDate = new Date('2000-01-01').getTime();
            const maxDate = new Date('2070-01-01').getTime();
            const numberOnlyRegex = /^\d+$/;

            if (numberOnlyRegex.test(number)) {
                if (number < minDate || number > maxDate) {
                    return false;
                }

                const date = new Date(number);
                return !isNaN(date.getTime());
            }else{
                return false;
            }
        }

        /*
        ---------------------------------------------------------
            날짜 24시간형식으로 변경
            Ex) sal.contAppr.cmmFormatDate(date);
         ---------------------------------------------------------
        */
        ,cmmFormatDate : function(date){
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
        }
    };

	sal.dropDownList = {

		/*
        ---------------------------------------------------------
            series1Cd 리스트를 가지고 온다.
            Ex) sal.dropDownList.series1Cd(asyncType,brandCd,useYn);
         ---------------------------------------------------------
        */
		series1Cd : function(asyncType,brandCd,useYn){
			var responseJson = dms.ajax.getJson({
				url :"/sal/cmm/selectSeries1CdDropDownList.do"
				,data :JSON.stringify({"brandCd":brandCd,
					"useYn":useYn})
				,async :asyncType
			});

			if(responseJson == null || responseJson.data == null){
				responseJson.data = null;
				if(responseJson.errors[0].errorCode == "403"){
					dms.notification.error(responseJson.errors[0].errorMessage);
					return responseJson;
				}
			}

			return responseJson;
		}

		/*
        ---------------------------------------------------------
            bps series1Cd 리스트를 가지고 온다.
            Ex) sal.dropDownList.bpsSeries1Cd(asyncType,brandCd);
         ---------------------------------------------------------
        */
		, bpsSeries1Cd: function (asyncType, brandCd) {
			var responseJson = dms.ajax.getJson({
				url: "/sal/cmm/selectBpsSeries1CdDropDownList.do"
				, data: JSON.stringify({
					"brandCd": brandCd
				})
				, async: asyncType
			});

			if (responseJson == null || responseJson.data == null) {
				responseJson.data = null;
				if(responseJson.errors[0].errorCode == "403"){
					dms.notification.error(responseJson.errors[0].errorMessage);
					return responseJson;
				}
			}

			return responseJson;
		}

		/*
        ---------------------------------------------------------
            series2Cd 리스트를 가지고 온다.
            Ex) sal.dropDownList.series2Cd(asyncType,brandCd,useYn);
         ---------------------------------------------------------
        */
		,series2Cd : function(asyncType,brandCd,useYn){
			var responseJson = dms.ajax.getJson({
				url :"/sal/cmm/selectSeries2CdDropDownList.do"
				,data :JSON.stringify({"brandCd":brandCd,
					"useYn":useYn})
				,async :asyncType
			});

			if(responseJson == null || responseJson.data == null){
				responseJson.data = null;
				if(responseJson.errors[0].errorCode == "403"){
					dms.notification.error(responseJson.errors[0].errorMessage);
					return responseJson;
				}
			}

			return responseJson;
		}

		/*
        ---------------------------------------------------------
            관심차량용 시리즈코드 리스트를 가지고 온다.
            Ex) sal.dropDownList.crmSeriesCd(asyncType,brandCd);
         ---------------------------------------------------------
        */
		,crmSeriesCd : function(asyncType,brandCd){
			var responseJson = dms.ajax.getJson({
				url :"/sal/cmm/selectCrmSeriesCdDropDownList.do"
				,data :JSON.stringify({"brandCd":brandCd})
				,async :asyncType
			});

			if(responseJson == null || responseJson.data == null){
				responseJson.data = null;
				if(responseJson.errors[0].errorCode == "403"){
					dms.notification.error(responseJson.errors[0].errorMessage);
					return responseJson;
				}
			}

			return responseJson;
		}

		/*
        ---------------------------------------------------------
            modelCd 리스트를 가지고 온다.
            Ex) sal.dropDownList.modelCd(bpsYn,asyncType,brandCd,series1Cd);
         ---------------------------------------------------------
        */
		,modelCd : function(bpsYn,asyncType,brandCd,series1Cd){

			var responseJson = dms.ajax.getJson({
				url :"/sal/cmm/selectModelDropDownList.do"
				,data :JSON.stringify({"bpsYn":bpsYn,"brandCd":brandCd,"series1Cd":series1Cd})
				,async :asyncType
			});

			if(responseJson == null || responseJson.data == null){
				responseJson.data = null;
				if(responseJson.errors[0].errorCode == "403"){
					dms.notification.error(responseJson.errors[0].errorMessage);
					return responseJson;
				}
			}

			return responseJson;
		}

		/*
    ---------------------------------------------------------
        modelCd 리스트를 가지고 온다.
        Ex) sal.dropDownList.modelCd(asyncType,brandCd,series1Cd);
     ---------------------------------------------------------
    */
		, bpsModelCd: function (asyncType, brandCd, series1Cd) {

			var responseJson = dms.ajax.getJson({
				url: "/sal/cmm/selectBpsModelDropDownList.do"
				, data: JSON.stringify({"brandCd": brandCd, "series1Cd": series1Cd})
				, async: asyncType
			});

			if (responseJson == null || responseJson.data == null) {
				responseJson.data = null;
				if(responseJson.errors[0].errorCode == "403"){
					dms.notification.error(responseJson.errors[0].errorMessage);
					return responseJson;
				}
			}

			return responseJson;
		}

		/*
        ---------------------------------------------------------
            modelCd2 리스트를 가지고 온다. (series2Cd)
            Ex) sal.dropDownList.modelCd(bpsYn,asyncType,brandCd,series2Cd);
         ---------------------------------------------------------
        */
		,modelCd2 : function(bpsYn,asyncType,brandCd,series2Cd){

			var responseJson = dms.ajax.getJson({
				url :"/sal/cmm/selectModelDropDownList.do"
				,data :JSON.stringify({"bpsYn":bpsYn,"brandCd":brandCd,"series2Cd":series2Cd})
				,async :asyncType
			});

			if(responseJson == null || responseJson.data == null){
				responseJson.data = null;
				if(responseJson.errors[0].errorCode == "403"){
					dms.notification.error(responseJson.errors[0].errorMessage);
					return responseJson;
				}
			}

			return responseJson;
		}

		/*
        ---------------------------------------------------------
            관심차량 모델리스트를 가지고 온다. (series2Cd)
            Ex) sal.dropDownList.crmModelCd(asyncType,brandCd,series2Cd);
         ---------------------------------------------------------
        */
		,crmModelCd : function(asyncType,brandCd,series2Cd){

			var responseJson = dms.ajax.getJson({
				url :"/sal/cmm/selectCrmModelDropDownList.do"
				,data :JSON.stringify({"brandCd":brandCd,"series2Cd":series2Cd})
				,async :asyncType
			});

			if(responseJson == null || responseJson.data == null){
				responseJson.data = null;
				if(responseJson.errors[0].errorCode == "403"){
					dms.notification.error(responseJson.errors[0].errorMessage);
					return responseJson;
				}
			}

			return responseJson;
		}

		/*
        ---------------------------------------------------------
            modelYear 리스트를 가지고 온다.
            Ex) sal.dropDownList.modelYear(asyncType,brandCd,series1Cd,modelCd);
         ---------------------------------------------------------
        */
		,modelYear : function(asyncType,brandCd,series1Cd,modelCd){

			var responseJson = dms.ajax.getJson({
				url :"/sal/cmm/selectYearDropDownList.do"
				,data :JSON.stringify({"brandCd":brandCd,"series1Cd":series1Cd,"modelCd":modelCd})
				,async :asyncType
			});

			if(responseJson == null || responseJson.data == null){
				responseJson.data = null;
				if(responseJson.errors[0].errorCode == "403"){
					dms.notification.error(responseJson.errors[0].errorMessage);
					return responseJson;
				}
			}

			return responseJson;
		}

		/*
        ---------------------------------------------------------
            modelYear 리스트를 가지고 온다.
            Ex) sal.dropDownList.bpsModelYear(asyncType,brandCd,series1Cd,modelCd);
         ---------------------------------------------------------
        */
		, bpsModelYear: function (asyncType, brandCd, series1Cd, modelCd) {

			var responseJson = dms.ajax.getJson({
				url: "/sal/cmm/selectBpsYearDropDownList.do"
				, data: JSON.stringify({"brandCd": brandCd, "series1Cd": series1Cd, "modelCd": modelCd})
				, async: asyncType
			});

			if (responseJson == null || responseJson.data == null) {
				responseJson.data = null;
				if(responseJson.errors[0].errorCode == "403"){
					dms.notification.error(responseJson.errors[0].errorMessage);
					return responseJson;
				}
			}

			return responseJson;
		}

		/*
        ---------------------------------------------------------
            description 리스트를 가지고 온다.
            Ex) sal.dropDownList.description(asyncType,brandCd,series1Cd,modelCd,modelYearCd);
         ---------------------------------------------------------
        */
		,description : function(asyncType,brandCd,series1Cd,modelCd,modelYearCd){

			var responseJson = dms.ajax.getJson({
				url :"/sal/cmm/selectDescriptionDropDownList.do"
				,data :JSON.stringify({"brandCd":brandCd,"series1Cd":series1Cd,"modelCd":modelCd,"modelYearCd":modelYearCd})
				,async :asyncType
			});

			if(responseJson == null || responseJson.data == null){
				responseJson.data = null;
				if(responseJson.errors[0].errorCode == "403"){
					dms.notification.error(responseJson.errors[0].errorMessage);
					return responseJson;
				}
			}

			return responseJson;
		}

		/*
        ---------------------------------------------------------
            description 리스트를 가지고 온다.
            Ex) sal.dropDownList.bpsDescription(asyncType,brandCd,series1Cd,modelCd,modelYearCd);
         ---------------------------------------------------------
        */
		, bpsDescription: function (asyncType, brandCd, series1Cd, modelCd, modelYearCd) {

			var responseJson = dms.ajax.getJson({
				url: "/sal/cmm/selectBpsDescriptionDropDownList.do"
				,
				data: JSON.stringify({
					"brandCd": brandCd,
					"series1Cd": series1Cd,
					"modelCd": modelCd,
					"modelYearCd": modelYearCd
				})
				,
				async: asyncType
			});

			if (responseJson == null || responseJson.data == null) {
				responseJson.data = null;
				if(responseJson.errors[0].errorCode == "403"){
					dms.notification.error(responseJson.errors[0].errorMessage);
					return responseJson;
				}
			}

			return responseJson;
		}

		/*
        ---------------------------------------------------------
            country 리스트를 가지고 온다.
            Ex) sal.dropDownList.country(asyncType,brandCd,series1Cd,modelCd,modelYear,pkgGrpCd);
         ---------------------------------------------------------
        */
		,country : function(asyncType,brandCd,series1Cd,modelCd,modelYear,pkgGrpCd){

			var responseJson = dms.ajax.getJson({
				url :"/sal/cmm/selectCountryDropDownList.do"
				,data :JSON.stringify({"brandCd":brandCd,"series1Cd":series1Cd,"modelCd":modelCd,"modelYear":modelYear,"pkgGrpCd":pkgGrpCd})
				,async :asyncType
			});

			if(responseJson == null || responseJson.data == null){
				responseJson.data = null;
				if(responseJson.errors[0].errorCode == "403"){
					dms.notification.error(responseJson.errors[0].errorMessage);
					return responseJson;
				}
			}

			return responseJson;
		}

		/*
        ---------------------------------------------------------
            dpm,retlPrc 리스트를 가지고 온다.
            Ex) sal.dropDownList.dpm(asyncType,brandCd,series1Cd,modelCd,modelYear,pkgGrpCd);
         ---------------------------------------------------------
        */
		,dpm : function(asyncType,brandCd,series1Cd,modelCd,modelYear,pkgGrpCd){

			var responseJson = dms.ajax.getJson({
				url :"/sal/cmm/selectDescriptionDropDownList.do"
				,data :JSON.stringify({"brandCd":brandCd,"series1Cd":series1Cd,"modelCd":modelCd,"modelYear":modelYear,"pkgGrpCd":pkgGrpCd})
				,async :asyncType
			});

			if(responseJson == null || responseJson.data == null){
				responseJson.data = null;
				if(responseJson.errors[0].errorCode == "403"){
					dms.notification.error(responseJson.errors[0].errorMessage);
					return responseJson;
				}
			}

			return responseJson;
		}

		/*
        ---------------------------------------------------------
            exColorCd 리스트를 가지고 온다.
            Ex) sal.dropDownList.exColorCd(asyncType,brandCd,series1Cd,modelCd,modelYear,pkgGrpCd);
         ---------------------------------------------------------
        */
		,exColorCd : function(asyncType,brandCd,series1Cd,modelCd,modelYear,pkgGrpCd){

			var responseJson = dms.ajax.getJson({
				url :"/sal/cmm/selectExColorDropDownList.do"
				,data :JSON.stringify({"brandCd":brandCd,"series1Cd":series1Cd,"modelCd":modelCd,"modelYear":modelYear,"pkgGrpCd":pkgGrpCd})
				,async :asyncType
			});

			if(responseJson == null || responseJson.data == null){
				responseJson.data = null;
				if(responseJson.errors[0].errorCode == "403"){
					dms.notification.error(responseJson.errors[0].errorMessage);
					return responseJson;
				}
			}

			return responseJson;
		}

		/*
        ---------------------------------------------------------
            inColorCd 리스트를 가지고 온다.
            Ex) sal.dropDownList.inColorCd(asyncType,brandCd,series1Cd,modelCd,modelYear,pkgGrpCd,exColorCd);
         ---------------------------------------------------------
        */
		,inColorCd : function(asyncType,brandCd,series1Cd,modelCd,modelYear,pkgGrpCd,exColorCd){

			var responseJson = dms.ajax.getJson({
				url :"/sal/cmm/selectInColorDropDownList.do"
				,data :JSON.stringify({"brandCd":brandCd,"series1Cd":series1Cd,"modelCd":modelCd,"modelYear":modelYear,"pkgGrpCd":pkgGrpCd,"exColorCd":exColorCd})
				,async :asyncType
			});

			if(responseJson == null || responseJson.data == null){
				responseJson.data = null;
				if(responseJson.errors[0].errorCode == "403"){
					dms.notification.error(responseJson.errors[0].errorMessage);
					return responseJson;
				}
			}

			return responseJson;
		}

		/*
        ---------------------------------------------------------
            bpsExColorCd 리스트를 가지고 온다. (BPS견적서)
            Ex) sal.dropDownList.bpsExColorCd(asyncType,brandCd,series1Cd,modelCd,modelYear,pkgGrpCd, useYn);
         ---------------------------------------------------------
        */
		,bpsExColorCd : function(asyncType,brandCd,series1Cd,modelCd,modelYear,pkgGrpCd, useYn){

			var responseJson = dms.ajax.getJson({
				url :"/sal/cmm/selectBpsExColorDropDownList.do"
				,data :JSON.stringify({"brandCd":brandCd,"series1Cd":series1Cd,"modelCd":modelCd,"modelYear":modelYear,"pkgGrpCd":pkgGrpCd,"useYn":useYn})
				,async :asyncType
			});

			if(responseJson == null || responseJson.data == null){
				responseJson.data = null;
				if(responseJson.errors[0].errorCode == "403"){
					dms.notification.error(responseJson.errors[0].errorMessage);
					return responseJson;
				}
			}

			return responseJson;
		}

		/*
        ---------------------------------------------------------
            bpsInColorCd 리스트를 가지고 온다. (BPS견적서)
            Ex) sal.dropDownList.bpsInColorCd(asyncType,brandCd,series1Cd,modelCd,modelYear,pkgGrpCd, useYn);
         ---------------------------------------------------------
        */
		,bpsInColorCd : function(asyncType,brandCd,series1Cd,modelCd,modelYear,pkgGrpCd, useYn){

			var responseJson = dms.ajax.getJson({
				url :"/sal/cmm/selectBpsInColorDropDownList.do"
				,data :JSON.stringify({"brandCd":brandCd,"series1Cd":series1Cd,"modelCd":modelCd,"modelYear":modelYear,"pkgGrpCd":pkgGrpCd,"useYn":useYn})
				,async :asyncType
			});

			if(responseJson == null || responseJson.data == null){
				responseJson.data = null;
				if(responseJson.errors[0].errorCode == "403"){
					dms.notification.error(responseJson.errors[0].errorMessage);
					return responseJson;
				}
			}

			return responseJson;
		}

		/*
        ---------------------------------------------------------
            대리점 리스트를 가지고 온다.
            Ex) sal.dropDownList.brchCd(asyncType,dlrCd,bizClsCd);
         ---------------------------------------------------------
        */
		,brchCd: function(asyncType, dlrCd, bizClsCd, brandList) {
			var responseJson = dms.ajax.getJson({
				url: "/sal/cmm/selectSalesBrchInfoList.do",
				data: JSON.stringify({
					"sCorpCd": dlrCd,
					"sBizClsCd": bizClsCd,
					"sBrandList": brandList
				}),
				async: asyncType
			});

			if (responseJson == null || responseJson.data == null) {
				responseJson.data = null;
				if(responseJson.errors[0].errorCode == "403"){
					dms.notification.error(responseJson.errors[0].errorMessage);
					return responseJson;
				}
			}

			return responseJson;
		}

		/*
        ---------------------------------------------------------
            대리점 별 팀 리스트를 가지고 온다.
            Ex) sal.dropDownList.deptCd(asyncType,dlrCd,brchCd);
         ---------------------------------------------------------
        */
		,deptCd : function(asyncType,dlrCd, brchCd){

			var responseJson = dms.ajax.getJson({
				url :"/sal/cmm/selectSalesDeptInfoList.do"
				,data :JSON.stringify({"sCorpCd": dlrCd , "sBrchCd": brchCd})
				,async :asyncType
			});

			if(responseJson == null || responseJson.data == null){
				responseJson.data = null;
				if(responseJson.errors[0].errorCode == "403"){
					dms.notification.error(responseJson.errors[0].errorMessage);
					return responseJson;
				}
			}

			return responseJson;
		}
		/*
        ---------------------------------------------------------
            대리점별 팀의 SC 리스트를 가지고 온다.
            Ex) sal.dropDownList.scId(asyncType,dlrCd,brchCd,deptCd,pstnId);
         ---------------------------------------------------------
        */
		, scId: function (asyncType, dlrCd, brchCd, deptCd, pstnId, pstnList) {
			var responseJson = dms.ajax.getJson({
				url: "/sal/cmm/selectSalesScInfoList.do"
				, data: JSON.stringify({
					"sCorpCd": dlrCd
					, "sBrchCd": brchCd
					, "sDeptCd": deptCd
					, "sPstnId": pstnId
					, "sPstnList": pstnList
				})
				, async: asyncType
			});

			if(responseJson == null || responseJson.data == null){
				responseJson.data = null;
				if(responseJson.errors[0].errorCode == "403"){
					dms.notification.error(responseJson.errors[0].errorMessage);
					return responseJson;
				}
			}

			return responseJson;
		}
		/*
        ---------------------------------------------------------
            employee정보를 가지고 온다.
            Ex) sal.dropDownList.pstnUserId(asyncType,dlrCd,brchCd,pstnId);
         ---------------------------------------------------------
        */
		,pstnUserId : function(asyncType,dlrCd, brchCd,pstnId){

			var responseJson = dms.ajax.getJson({
				url :"/sal/cmm/selectSalesEmplInfoList.do"
				,data :JSON.stringify({"sCorpCd": dlrCd , "sBrchCd": brchCd , "sPstnId": pstnId})
				,async :asyncType
			});

			if(responseJson == null || responseJson.data == null){
				responseJson.data = null;
				if(responseJson.errors[0].errorCode == "403"){
					dms.notification.error(responseJson.errors[0].errorMessage);
					return responseJson;
				}
			}

			return responseJson;
		}

		/*
        ---------------------------------------------------------
            검색조건 년도리스트를 가지고 온다.
            Ex) sal.dropDownList.searchYear(startYear, yearCnt);
         ---------------------------------------------------------
        */
		,searchYear : function(startYear, yearCnt ){

			var yearList = [];
			var date  = new Date(startYear, "01", "01");

			for(var i = 0; i < yearCnt; i++){
				yearList.push({year : (date.getFullYear() - i ), yearNm : (date.getFullYear() - i) +"년" });
			}

			return yearList;
		}

		/*
        ---------------------------------------------------------
            검색조건 년도리스트를 가지고 온다.
            Ex) sal.dropDownList.searchMonth();
         ---------------------------------------------------------
        */
		,searchMonth : function(){

			var monthList = [];

			for(var i=1; i <= 12; i ++){
				monthList.push({month : dms.string.lpad( ( i ).toString()  , '0', 2) , monthNm : i +"월" });
			}

			return monthList;
		}

		/*
        ---------------------------------------------------------
            stockModelCd 리스트를 가지고 온다.
            SAL_VIN에 있는 재고가있는 모델을 가지고온다(차량등록일이 NULL인)
            Ex) sal.dropDownList.stockModelCd(asyncType,brandCd,series1Cd);
         ---------------------------------------------------------
        */
		, stockModelCd: function (asyncType, brandCd, series1Cd) {

			var responseJson = dms.ajax.getJson({
				url: "/sal/cmm/selectStockModelDropDownList.do"
				, data: JSON.stringify({"brandCd": brandCd, "series1Cd": series1Cd})
				, async: asyncType
			});

			if (responseJson == null || responseJson.data == null) {
				responseJson.data = null;
				if(responseJson.errors[0].errorCode == "403"){
					dms.notification.error(responseJson.errors[0].errorMessage);
					return responseJson;
				}
			}

			return responseJson;
		}

		/*
        ---------------------------------------------------------
            stockModelYear 리스트를 가지고 온다.
            Ex) sal.dropDownList.stockModelYear(asyncType,brandCd,series1Cd,modelCd);
         ---------------------------------------------------------
        */
		, stockModelYear: function (asyncType, brandCd, series1Cd, modelCd) {

			var responseJson = dms.ajax.getJson({
				url: "/sal/cmm/selectStockYearDropDownList.do"
				, data: JSON.stringify({"brandCd": brandCd, "series1Cd": series1Cd, "modelCd": modelCd})
				, async: asyncType
			});

			if (responseJson == null || responseJson.data == null) {
				responseJson.data = null;
				if(responseJson.errors[0].errorCode == "403"){
					dms.notification.error(responseJson.errors[0].errorMessage);
					return responseJson;
				}
			}

			return responseJson;
		}

		/*
        ---------------------------------------------------------
            stockDescription 리스트를 가지고 온다.
            Ex) sal.dropDownList.stockDescription(asyncType,brandCd,series1Cd,modelCd,modelYearCd);
         ---------------------------------------------------------
        */
		, stockDescription: function (asyncType, brandCd, series1Cd, modelCd, modelYearCd) {

			var responseJson = dms.ajax.getJson({
				url: "/sal/cmm/selectStockDescriptionDropDownList.do"
				,
				data: JSON.stringify({
					"brandCd": brandCd,
					"series1Cd": series1Cd,
					"modelCd": modelCd,
					"modelYearCd": modelYearCd
				})
				,
				async: asyncType
			});

			if (responseJson == null || responseJson.data == null) {
				responseJson.data = null;
				if(responseJson.errors[0].errorCode == "403"){
					dms.notification.error(responseJson.errors[0].errorMessage);
					return responseJson;
				}
			}

			return responseJson;
		}

		/*
        ---------------------------------------------------------
            stockExColorCd 리스트를 가지고 온다.
            Ex) sal.dropDownList.stockExColorCd(asyncType,brandCd,series1Cd,modelCd,modelYearCd,pkgGrpCd);
         ---------------------------------------------------------
        */
		, stockExColorCd: function (asyncType, brandCd, series1Cd, modelCd, modelYearCd, pkgGrpCd) {

			var responseJson = dms.ajax.getJson({
				url: "/sal/cmm/selectStockExColorDropDownList.do"
				,
				data: JSON.stringify({
					"brandCd": brandCd,
					"series1Cd": series1Cd,
					"modelCd": modelCd,
					"modelYearCd": modelYearCd,
					"pkgGrpCd": pkgGrpCd
				})
				,
				async: asyncType
			});

			if (responseJson == null || responseJson.data == null) {
				responseJson.data = null;
				if(responseJson.errors[0].errorCode == "403"){
					dms.notification.error(responseJson.errors[0].errorMessage);
					return responseJson;
				}
			}

			return responseJson;
		}

		/*
        ---------------------------------------------------------
            stockInColorCd 리스트를 가지고 온다.
            Ex) sal.dropDownList.stockInColorCd(asyncType,brandCd,series1Cd,modelCd,modelYearCd,pkgGrpCd,exColorCd);
         ---------------------------------------------------------
        */
		, stockInColorCd: function (asyncType, brandCd, series1Cd, modelCd, modelYearCd, pkgGrpCd, exColorCd) {

			var responseJson = dms.ajax.getJson({
				url: "/sal/cmm/selectStockInColorDropDownList.do"
				,
				data: JSON.stringify({
					"brandCd": brandCd,
					"series1Cd": series1Cd,
					"modelCd": modelCd,
					"modelYearCd": modelYearCd,
					"pkgGrpCd": pkgGrpCd,
					"exColorCd": exColorCd
				})
				,
				async: asyncType
			});

			if (responseJson == null || responseJson.data == null) {
				responseJson.data = null;
				if(responseJson.errors[0].errorCode == "403"){
					dms.notification.error(responseJson.errors[0].errorMessage);
					return responseJson;
				}
			}

			return responseJson;
		}

	};

	window.sal = sal;
}(window, document, jQuery));