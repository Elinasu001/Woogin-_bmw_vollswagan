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

					//파일번호 생성
					$.ajax({
						url:"/cmm/sci/fileUpload/selectFileDocNo.do",
						dataType:"json",
						type:"get",
						async:false,
						cache:false,
						success:function(id) {
							fileDocNo = id;
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
					formdata.append("path", path);	//path 추가
					formdata.append("file", fileData);	// file data 추가

					return formdata;
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