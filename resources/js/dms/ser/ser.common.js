
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

	var ser = window.ser? window.ser:{};

	ser.car = {


	};

	ser.list = {


	};

	ser.signature = {


	};

	ser.dropDownList = {

		/*
			---------------------------------------------------------
				Warranty Claim Board 중분류 정보를 가지고 온다.				
				Ex) sal.dropDownList.claimDetlTp(asyncType,cmmCd);
			 ---------------------------------------------------------
			*/
			 claimDetlTp : function(asyncType,cmmCd){
				var responseJson = dms.ajax.getJson({
					url :"/ser/wclaimboard/selectClaimDetlTpDropDownList.do"
					,data :JSON.stringify({"cmmCd":cmmCd})
					,async :asyncType
				});

				if(responseJson == null || responseJson.data == null){
					responseJson.data = null;
				}

				return responseJson;
			}

	};

    window.ser = ser;
}(window, document, jQuery));