
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
				차량 이미지를 불러온다..
				Ex) sal.car.imageSetting(sBrandCd, sSeries1Cd , sModelCd , docType);
			 ---------------------------------------------------------
			*/

			imageSetting : function(sBrandCd, sSeries1Cd , sModelCd , docType){

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
				Ex) sal.list.signature(contNo, contStepTp, contSignTp);
			 ---------------------------------------------------------
			*/
			image : function(contNo, contStepTp, contSignTp){

				var responseJson = dms.ajax.getJson({
					url :"/sal/nextCont/selectContSignInfo.do"
					,data :JSON.stringify({"sContNo":contNo, "sContStepTp":contStepTp, "sContSignTp":contSignTp})
					,async :false
				});

				if(responseJson == null){
					responseJson = null;
				}

				return responseJson.contSignFileDocNo;
			}

	};

	sal.dropDownList = {

			/*
			---------------------------------------------------------
				series1Cd 리스트를 가지고 온다.
				Ex) sal.dropDownList.series1Cd(asyncType,brandCd);
			 ---------------------------------------------------------
			*/
			series1Cd : function(asyncType,brandCd){
				var responseJson = dms.ajax.getJson({
					url :"/sal/cmm/selectSeries1CdDropDownList.do"
					,data :JSON.stringify({"brandCd":brandCd})
					,async :asyncType
				});

				if(responseJson == null || responseJson.data == null){
					responseJson.data = null;
				}

				return responseJson;
			}

			/*
			---------------------------------------------------------
				series2Cd 리스트를 가지고 온다.
				Ex) sal.dropDownList.series2Cd(asyncType,brandCd);
			 ---------------------------------------------------------
			*/
			,series2Cd : function(asyncType,brandCd){
				var responseJson = dms.ajax.getJson({
					url :"/sal/cmm/selectSeries2CdDropDownList.do"
					,data :JSON.stringify({"brandCd":brandCd})
					,async :asyncType
				});

				if(responseJson == null || responseJson.data == null){
					responseJson.data = null;
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
				}

				return responseJson;
			}
			/*
			---------------------------------------------------------
				대리점별 팀의 SC 리스트를 가지고 온다.
				Ex) sal.dropDownList.scId(asyncType,dlrCd,brchCd,deptCd,pstnId);
			 ---------------------------------------------------------
			*/
			,scId : function(asyncType,dlrCd, brchCd,deptCd,pstnId){

				var responseJson = dms.ajax.getJson({
					url :"/sal/cmm/selectSalesScInfoList.do"
					,data :JSON.stringify({"sCorpCd": dlrCd , "sBrchCd": brchCd , "sDeptCd": deptCd , "sPstnId" : pstnId})
					,async :asyncType
				});

				if(responseJson == null || responseJson.data == null){
					responseJson.data = null;
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

	};

    window.sal = sal;
}(window, document, jQuery));