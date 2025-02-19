(function(window, document, $) {

	'use strict';

	var crm = window.crm? window.crm:{};

	crm.dropDownList = {

			optionLabel : function(paramList,paramCd,paramNm,label){

				var obj = {};
				obj[paramCd] = "";
				obj[paramNm] = label;
				var returnList = [];

				returnList.push(obj);

				if(paramList !=null){
					$.each(paramList, function(idx, data) {
							returnList.push(data);
					});
				}

				return returnList;
			}
	};

	crm.string = {

            fnChkByte : function(obj, maxByte){

                var str = obj;
                	var str_len = str.length;

                	var rbyte = 0;
                	var rlen = 0;
                	var one_char = "";
                	var str2 = "";


                	for(var i=0; i<str_len; i++)
                	{
                		one_char = str.charAt(i);
                		if(escape(one_char).length > 4) {
                			rbyte += 3;										 //한글3Byte
                		}else{
                			rbyte++;											//영문 등 나머지 1Byte
                		}
                		if(rbyte <= maxByte){
                			rlen = i+1;										  //return할 문자열 갯수
                		}
                	}
                	if(rbyte > maxByte)
                	{
                		str2 = str.substr(0,rlen);								  //문자열 자르기
                		return str2;
                	}else{
                		return str;
                	}
            }
    };

	crm.datePicker = {

			/*
			---------------------------------------------------------
				DatePicker 시작일과 종료일 validation check

				setOptions는  변수가 다만들어지고 아래에 만들어주셔야 합니다.   예시화면 selectDlrCrmCustomerView.jsp

				Ex) startDatePicker.setOptions({
						change : crm.datePicker.ValidStartChange(startDatePicker,endDatePicker),
						open : crm.datePicker.ValidEndChange(startDatePicker,endDatePicker)
					});

					endDatePicker.setOptions({
						change : crm.datePicker.ValidEndChange(startDatePicker,endDatePicker),
						open : crm.datePicker.ValidStartChange(startDatePicker,endDatePicker)
					});
			 ---------------------------------------------------------
			*/

			ValidStartChange : function(start,end){
				var startDate = start.value(),
				endDate = end.value();

				if (startDate) {
					startDate = new Date(startDate);
					startDate.setDate(startDate.getDate());
					end.min(startDate);
				} else if (endDate) {
					start.max(new Date(endDate));
				} else {
					endDate = new Date();
					start.max(endDate);
					end.min(endDate);
				}
			}

			,ValidEndChange : function(start,end){
				var endDate = end.value(),
				startDate = start.value();

				if (endDate) {
					endDate = new Date(endDate);
					endDate.setDate(endDate.getDate());
					start.max(endDate);
				} else if (startDate) {
					end.min(new Date(startDate));
				} else {
					endDate = new Date();
					start.max(endDate);
					end.min(endDate);
				}
			}
	};

	crm.signature = {

			/*
			---------------------------------------------------------
				서명을 이미지로 만들어 파일번호 생성하고 formdata를 return함


				Ex) var formdata = crm.signature.formData(data,"crm","/sign/cust");
			 ---------------------------------------------------------
			*/

			formData : function(fileData,module,path){

				var formdata = new FormData();	// formData 생성
				var fileDocNo;

				var corpShotCd;

				try{
					corpShotCd = loginCorpShotCd;
				}catch{
					//딜러 숏코드 뽑기
					$.ajax({
						url:"/crm/nextCrm/selectCorpShotCd.do",
						dataType:"json",
						type:"post",
						async:false,
						cache:false,
						success:function(result) {
							corpShotCd = result;
						},
						error:function(jqXHR, status, error) {
                            if(jqXHR.responseJSON.errors[0].errorCode == "403"){
                                dms.notification.error(jqXHR.responseJSON.errors);
                                return responseJson;
                            }
                        }
					});
				}

				//파일번호 생성
				$.ajax({
					url:"/cmm/sci/fileUpload/selectFileDocNo.do",
					dataType:"json",
					type:"get",
					async:false,
					cache:false,
					success:function(id) {
						fileDocNo = id;
					},
					error:function(jqXHR, status, error) {
                        if(jqXHR.responseJSON.errors[0].errorCode == "403"){
                            dms.notification.error(jqXHR.responseJSON.errors);
                            return responseJson;
                        }
                    }
				});

				formdata.append("resumableSessionId", fileDocNo);	// fileDocNo 추가
				formdata.append("resumableChunkNumber", 1);	//resumableChunkNumber 추가
				formdata.append("resumableChunkSize", 1*1024*1024);	//resumableChunkSize 추가
				formdata.append("resumableTotalSize", fileData.size);	//resumableTotalSize 추가
				formdata.append("resumableIdentifier", fileData.size+"-"+kendo.toString(new Date(),"yyyy-MM-dd")+"CUST"+fileData.type.split('/')[1]);	//resumableIdentifier 추가
				formdata.append("resumableFilename", kendo.toString(new Date(),"yyyy-MM-dd")+"CUST."+fileData.type.split('/')[1]);	//resumableFilename 추가
				formdata.append("resumableFileContentType", fileData.type);	//resumableFileContentType 추가
				formdata.append("resumableRelativePath", kendo.toString(new Date(),"yyyy-MM-dd")+"CUST."+fileData.type.split('/')[1]);	//resumableRelativePath 추가
				formdata.append("module", module);	//module 추가
				formdata.append("remark", module);	//reamrk에 module 추가
				formdata.append("path", "/"+corpShotCd + path);	//path 추가
				formdata.append("file", fileData);	// file data 추가

				return formdata;
			}
	};

	crm.encrypt = {

			/*
			---------------------------------------------------------
				암호화 함수

				Ex) var String = crm.encrypt.string("abc");
			 ---------------------------------------------------------
			*/

			string : function(encryptParam){

				var responseJson = dms.ajax.getJson({
					url :"/cmm/enc/encryptParam.do"
					,data :JSON.stringify({"encryptParam":encryptParam})
					,async :false
				});

				return responseJson;

			},

			/*
			---------------------------------------------------------
				암호화 함수 리스트

				Ex) var String = crm.encrypt.stringList(리스트);
			 ---------------------------------------------------------
			*/

			stringList : function(encryptParam){

				var responseJson = dms.ajax.getJson({
					url :"/cmm/enc/encryptParamList.do"
					,data :JSON.stringify({"encryptParamList":encryptParam})
					,async :false
				});

				return responseJson;
			}
	};

	crm.decrypt = {

			/*
			---------------------------------------------------------
				복호화 함수


				Ex) var String = crm.decrypt.string("abc",5);
			 ---------------------------------------------------------
			*/

			string : function(decryptParam,maskingParam){

				var masking = maskingParam;

				if(dms.string.isEmpty(maskingParam)){
					masking = 0;
				}

				var responseJson = dms.ajax.getJson({
					url :"/cmm/enc/decryptParam.do"
					,data :JSON.stringify({"decryptParam":decryptParam,"maskingParam":masking})
					,async :false
				});

				return responseJson;

			},

			/*
			---------------------------------------------------------
				복호화 함수


				Ex) var String = crm.decrypt.stringList("abc",5);
			 ---------------------------------------------------------
			*/

			stringList : function(decryptParam,maskingParam){

				var masking = maskingParam;

				if(dms.string.isEmpty(maskingParam)){
					masking = 0;
				}

				var responseJson = dms.ajax.getJson({
					url :"/cmm/enc/decryptParamList.do"
					,data :JSON.stringify({"decryptParamList":decryptParam,"maskingParam":masking})
					,async :false
				});

				return responseJson;
			}
	};

	crm.popup = {

		/**
		 * 판매기회 팝업
		 * Ex) var selectSearchOptyPopupWin = crm.popup.crmOpty(selectSearchOptyPopupWin,title,ownCallBack,parentWin,useYn,saleOptyTp);
		 * parentCallBack 함수명은 selectSearchOptyPopupCallBack 로 고정입니다.
		 */
		crmOpty: function (paramWin, title, ownCallBack, parentWin, useYn, saleOptyTp, tdrvCrmOptyValidDay) {
			var popupWin;
			popupWin = dms.window.popup({
				windowId: paramWin
				, title: title
				, width: "1300px"
				, content: {
					url: "/crm/nextCrmOpty/popup/selectSearchOptyPopup.do"
					, data: {
						"useYn": useYn
						, "saleOptyTp": saleOptyTp
						, "tdrvCrmOptyValidDay": tdrvCrmOptyValidDay
						, "callbackFunc": function (data) {

							//부모Win이 있는경우		(팝업에서 팝업을 호출한경우)
							if (parentWin != null && parentWin != "") {
								var windowElement = $("#" + parentWin + "");
								var iframeDomElement = windowElement.children("iframe")[0];
								var iframeWindowObject = iframeDomElement.contentWindow;
								iframeWindowObject.selectSearchOptyPopupCallBack(data);

							} else {
								ownCallBack(data);
							}

							popupWin.close();
						}
					}
				}
				,pinned: false
				,draggable: true
			});

			return popupWin;
		},

		masking: function () {
			var popupWin;
			let query = window.location.search;
			let param = new URLSearchParams(query);
			let id = param.get('_viewId');
			popupWin = dms.window.popup({
				windowId: "selectMaskingReasonPopupWin"
				, title: "마스킹 해제 사유"
				, width: "446px"
				, height: "195px"
				, content: {
					url: "/cmm/masking/popup/selectMaskingReasonPopup.do"
					, data: {
						"viewId": id
						, "callbackFunc": function () {

							maskingReasonCallBack();

							popupWin.close();
						}
					}
				}
				,pinned: false
				,draggable: true
			});

			return popupWin;
		}
	};


	crm.date = {

		/**
		 * IPAD의 경우 new Date(value)로 변환시 Nan-Nan-Nan 발생하여 value 타입에 따라 처리
		 * Ex) crm.date.formatString(paramDate, 'yyyyMMdd'
		 *
		 */
		formatString: function (paramDate, dateFormat) {

			if(typeof(paramDate) == "number"){
				var date = new Date(paramDate);
				var year = date.getFullYear();
				var month = ("0" + (1 + date.getMonth())).slice(-2);
				var day = ("0" + date.getDate()).slice(-2);
			}else{
				var date = new Date(paramDate.replace(/\-/g,"/"));
				var year = date.getFullYear();
				var month = ("0" + (1 + date.getMonth())).slice(-2);
				var day = ("0" + date.getDate()).slice(-2);
			}

			var retrunString;

			switch (dateFormat) {
				case "yyyyMMdd":
					retrunString = year + '' + month + '' + day;
					break;
				case "yyyy-MM-dd":
					retrunString = year + '-' + month + '-' + day;
					break;

			}

			return retrunString;
		}
	};

    window.crm = crm;
}(window, document, jQuery));