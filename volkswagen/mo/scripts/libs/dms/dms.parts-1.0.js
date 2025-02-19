(function(window, document, $) {

	'use strict';

	var partsJs = {
	};

	partsJs.string = {

            /**
             * String 일 경우 좌우측 여백 삭제
             * Array일 경우 빈 index 삭제 후 재할당
             * @param obj - 넘겨줄 값
             * @returns {Object}
             */
            trim : function(obj) {
                if(typeof obj === "string"){
                    return obj.replace(/(^\s*)|(\s*$)/g, "");
                }
                else if(obj.constructor === Array) {
                    var param = [];
                    var j = 0;
                    for(var i=0; i < obj.length; i++){
                        if(partsJs.string.isNotEmpty(obj[i])){
                            param[j++] = obj[i];
                        }
                    }
                    return param;
                }
            },

            /**
             * 문자열 str 가 null 이거나 trim(str) 결과가 "" 와 같다면 true, 아니면 false 를 리턴한다.
             * @param str
             * @returns {Boolean}
             */
            isEmpty : function(str) {

                if (str == undefined || str == null || this.trim(str) == "") {
                    return true;
                } else {
                    return false;
                }
            },


            /**
             * 날짜 Format변경(checkDate 함수에서 사용.)
             * 예> var result=partsJs.string.setDateFormat('2014', '05', '20', 'MMDDYYYY', '/');
             *     result = '05/20/2014';
             */
            setDateFormat :  function(y, m, d, format, gb) {
                format = format.split("YYYY").join(y + gb);
                format = format.split("MM").join(m + gb);
                format = format.split("DD").join(d + gb);
                return format.substr(0,10);
            },

            /**
             * 날짜 Validation 체크: Input박스에서 입력된 날짜 값에 대한 Validation 체크
             * 예> var result=partsJs.string.checkDate(obj, '20150513', 'date', '/', 'MMDDYYYY');
             *     result = '05/13/2015';
             */
            checkDate : function(obj, strings, type, gbn, fmt) {
                var year_data = "",
                    month_data = "",
                    date_data = "",
                    rt_date = "",
                    mnthst,
                    mnth,
                    dy,
                    strValue,
                    i;


                if(partsJs.string.isEmpty(gbn)){
                    gbn = '-';
                }

                if(partsJs.string.isEmpty(fmt)){
                    fmt = 'YYYYMMDD';
                }

                strValue = strings.replace(/[^\d]/g, '');
                for (i = 0; i < 8; i++) {
                    var c = strValue.charAt(i);
                    if (c < '0' || c > '9') {
                        //alert('날짜형식에 맞는지 확인하세요!');
                        obj.focus();
                        return (false);
                    }

                    if (i < 4)
                        year_data += c;
                    else if (i >= 4 && i < 6)
                        month_data += c;
                    else if (i >= 6)
                        date_data += c;
                }

                mnthst = month_data;
                mnth   = parseInt(mnthst, 10);
                dy     = parseInt(date_data);

                if (mnth > 12 || mnth < 1) {
                    //alert("날짜가 잘못 입력되었습니다.");
                    obj.focus();
                    return (false);
                }

                if (mnth != 2) {
                    if (mnth == 4 || mnth == 6 || mnth == 9 || mnth == 11) {
                        if (dy > 30 || dy < 1) {
                            //alert("날짜가 30일을 초과할수가 없습니다.");
                            obj.focus();
                            return (false);
                        }
                    } else if (mnth == 1 || mnth == 3 || mnth == 5 || mnth == 7 || mnth == 8 || mnth == 10 || mnth == 12) {
                        if (dy > 31 || dy < 1) {
                            //alert("날짜가 31일을 초과할수가 없습니다.");
                            obj.focus();
                            return (false);
                        }
                    }
                } else {
                    var yr1 = parseInt(year_data);
                    var leapYrTest = yr1 % 4;
                    var maxdy;
                    if ((yr1 % 400 == 0) || ((yr1 % 4 == 0) && (yr1 % 100 != 0))) {
                        maxdy = 29;
                    } else {
                        maxdy = 28;
                    }

                    if (dy > maxdy) {
                        //alert("날짜가 " + maxdy + "일을 초과할수가 없습니다.");
                        obj.focus();
                        return (false);
                    }
                }

                if (type === 'date') {
                    return this.setDateFormat(year_data, month_data, date_data, fmt, gbn);
                } else {
                    return (true);
                }
            },

            /**
             * 날짜 Validation 체크: Input박스에서 입력된 날짜 값에 대한 Validation 체크
             * 예> var result=partsJs.string.onlyCheckDate('2015-05-13');
             *     result = '05/13/2015';
             */
            onlyCheckDate : function(strings) {
                var year_data = "",
                    month_data = "",
                    date_data = "",
                    rt_date = "",
                    mnthst,
                    mnth,
                    dy,
                    strValue,
                    i;


                strValue = strings.replace(/[^\d]/g, '');
                for (i = 0; i < 8; i++) {
                    var c = strValue.charAt(i);
                    if (c < '0' || c > '9') {
                        //alert('날짜형식에 맞는지 확인하세요!');
                        return (false);
                    }

                    if (i < 4)
                        year_data += c;
                    else if (i >= 4 && i < 6)
                        month_data += c;
                    else if (i >= 6)
                        date_data += c;
                }

                mnthst = month_data;
                mnth   = parseInt(mnthst, 10);
                dy     = parseInt(date_data);

                if (mnth > 12 || mnth < 1) {
                    //alert("날짜가 잘못 입력되었습니다.");
                    return (false);
                }

                if (mnth != 2) {
                    if (mnth == 4 || mnth == 6 || mnth == 9 || mnth == 11) {
                        if (dy > 30 || dy < 1) {
                            //alert("날짜가 30일을 초과할수가 없습니다.");
                            return (false);
                        }
                    } else if (mnth == 1 || mnth == 3 || mnth == 5 || mnth == 7 || mnth == 8 || mnth == 10 || mnth == 12) {
                        if (dy > 31 || dy < 1) {
                            //alert("날짜가 31일을 초과할수가 없습니다.");
                            return (false);
                        }
                    }
                } else {
                    var yr1 = parseInt(year_data);
                    var leapYrTest = yr1 % 4;
                    var maxdy;
                    if ((yr1 % 400 == 0) || ((yr1 % 4 == 0) && (yr1 % 100 != 0))) {
                        maxdy = 29;
                    } else {
                        maxdy = 28;
                    }

                    if (dy > maxdy) {
                        //alert("날짜가 " + maxdy + "일을 초과할수가 없습니다.");
                        return (false);
                    }
                }
                return (true);
            }

    };
	/***************************************************
     * Form Validation 체크 및 초기화 기능
     * 작업자: 이주원
     * 작업일시: 2015년 7월 21일
     * 내용: Form 저장 시 모든 항목에 대한 Validation 체크 및
     *       오류 발생 시 항목 Label명을 alert하며 해당 항목으로 포커싱을 제공한다.
     * 사용방법: Form 저장 실행 시 다음과 같이 호출하면됨.
     *     //모든 object 추출(파라미터는 Validation체크할 Form의 ID임.)
           if (!partsJs.validate.getAllPluginObjInfo($("#inputForm")[0])) {
                return false;
           }

           //모든 object에 대한 체크
           if (!partsJs.validate.groupObjAllDataCheck()) {
                return false;
           }

           [체크하고자 하는 필드에 추가 사항.]
             - data-for
                  값: data-lbl속성에 매칭시킬 값(ex. lbl0362)
                  default: 없음.
                  비고: data-for는 라벨명이 속한 field의 속성 값임. 그 외는 validation체크 할 값이 존재하는 field의 속성값임.

             - data-lbl
                  값: data-for속성에 매칭시킬 값(ex. lbl0362)
                  default: 없음.

             - data-mandatory
                  값: true or false
                  default: false(해당 속성이 없으면 false로 인식함)

             - data-type
                  값: date, number, input, combo, radio, checkbox(추후 추가가능)
                  default: input(해당 속성이 없으면 input으로 인식함)
             - data-min
                  값: 숫자
                  default: -1(해당 속성이 없으면 -1로 인식함)
             - data-max
                  값: 숫자
                  default: -1(해당 속성이 없으면 -1로 인식함)
             - data-radio
                  값: string
                  비고: 라디오인 경우 판별하기 위해 사용되는 값.
             - data-default
                  값: 'Y', 'N'
                  비고: 라디오, 체크박스와 같이 Default 체크 값이 필요한 경우 사용.

     *     * 필수값 체크 시 Form의 Input태그에 data-mandatory="true" 추가하면
     *       해당 항목의 값이 있는지 없는지 체크함.
     *     * Date 필드(여기선 input) 체크 시 data-type="date" 추가하면
     *       해당 항목의 날짜 형식이 올바른지 체크함.
     *     *그 외 data-min, data-max 값을 추가하면 최소값, 최대값 validation 체크 가능함.(그 외는 추후 추가 가능)
     *     예) <input id="valGrpId" class="k-textbox" readonly="readonly" style="display:none" data-mandatory="true" data-min="1" data-max="3"/>
     *     data-mandatory가 true이고 값이 없는 경우 해당 항목의 라벨명으로 가져와 alert표시함.(라벨이 없는 경우 해당 field의 ID를 가져옴)
     *
     *     [라벨명 가져올 때 주의사항.]
     *     해당 validation체크 필드에 data-lbl="lbl0362"과 같이 data-lbl 속성이 필요하고, 라벨이 지정된 태그에(현재는 li태그) data-for="lbl0362"와 같은 속성이 필요함.
     *     validation 체크 메세지 발생 시 해당 field의 [data-lbl] 값을 가져와 동일한 값을 가진 [data-for]를 Form안에서 찾아와 라벨명을 던저주는 방식임.
     *     해당 [data-for]가 존재하지 않거나 값이 없는 경우 해당 필드의 ID를 가져옴.
     *
     *     샘플 화면:  itemDefineTest.jsp화면 저장 버튼 클릭 시. [context-path]/common/itemDefine/itemDefineTest
     **************************************************/
	partsJs.validate = {

            /**************************************
             * Form 전체 Validation체크를 위한 변수
             *************************************/
            formJs : {
                       Hash : {}
            },

            recursiveFlag : 0,  //재귀호출 시 진행 중인 함수를 무력화 하기 위한 방안

            formId : null,  //Validation체크 할 Form의 id

            /*******************************************************************************
             * 기 능 : 프리폼 데이터 추출 호출
             ******************************************************************************/

            getAllPluginObjInfo: function(pGroupId) {
                var arr = [],
                    formHash = this.formJs.Hash,
                    i,
                    arrLen;

                /*for (var k in formHash) {
                    // use hasOwnProperty to filter out keys from the Object.prototype
                    if (formHash.hasOwnProperty(k)) {
                        arr.push(k);
                    }
                }*/

                /*arrLen = arr.length;

                if ( arr.length > 0) {
                    for (var i=0; i < arr.length; i++) {
                        delete this.formJs.Hash.arr[i];
                    }
                }*/
                this.formJs.Hash = {};

                this.formId = pGroupId.id;

                this.setAllPluginObjToHash(pGroupId);
                return true;
            },

            /*******************************************************************************
             * 기 능 : 그룹 오브젝트의 하위 Plugin 객체를 가지고 온다.
             ******************************************************************************/
            setAllPluginObjToHash: function( ){

                var grpObj     = null,
                    childArr   = null,
                    childArrLen,
                    index,
                    obj,
                    i,
                    arguLen = arguments.length,
                    objDataType = "",
                    tagType     = "";

                for (i = 0 ; i < arguLen ; i++){
                        grpObj = arguments[i];

                        childArr = grpObj.children;
                        childArrLen = childArr.length;
                        tagType = "";

                    for(index = 0; index < childArrLen; index++ ){
                        obj = childArr[index];

                        try {
                            try{
                                tagType = obj.tagName.toLowerCase();

                            }catch(e){}
                            switch(tagType){
                                case "section":
                                case "span":
                                case "article":
                                case "div":
                                case "table":
                                case "tbody":
                                case "tr":
                                case "td":
                                case "label":
                                    this.setAllPluginObjToHash(obj);
                                    break;
                                case "ul":
                                case "li":
                                case "image":
                                case "grid":
                                case "caption":
                                case "colgroup":
                                    break;
                                case "input":
                                case "output":
                                case "select":
                                case "multiselect":
                                case "secret":
                                case "textarea":
                                case "textbox":
                                case "radio":
                                case "checkbox":
                                        try{
                                            objDataType = obj.getAttribute('data-type');



                                            if(objDataType === 'checkbox'||objDataType === 'radio'){
                                                if(obj.checked){
                                                    this.formJs.Hash[obj.id] = 'Y';

                                                }else{
                                                    this.formJs.Hash[obj.id] = 'N';
                                                }
                                            }else if(objDataType === 'date'){
                                                if(partsJs.string.isEmpty(obj.value)){
                                                  this.formJs.Hash[obj.id] = '';
                                                }else{
                                                    this.formJs.Hash[obj.id] = $('#' + obj.id).data("kendoDatePicker").value();
                                                }
                                            }else if(objDataType === 'maskDate'){
                                                if(partsJs.string.isEmpty(obj.value)){
                                                    this.formJs.Hash[obj.id] = '';
                                                }else{
                                                    this.formJs.Hash[obj.id] = $('#' + obj.id).data("kendoExtMaskedDatePicker").value();
                                                }
                                            }else if(objDataType === 'dateTime'){
                                                if(partsJs.string.isEmpty(obj.value)){
                                                    this.formJs.Hash[obj.id] = '';
                                                }else{
                                                    this.formJs.Hash[obj.id] = $('#' + obj.id).data("kendoDateTimePicker").value();
                                                }
                                            }else if(objDataType === 'combo'){
                                                if(partsJs.string.isEmpty(obj.value)){
                                                    this.formJs.Hash[obj.id] = '';
                                                }else{

                                                    this.formJs.Hash[obj.id] = $('#' + obj.id).data("kendoExtDropDownList").value();
                                                }
                                            }else if(objDataType === 'multiselect'){
                                                if(partsJs.string.isEmpty(obj.value)){
                                                    this.formJs.Hash[obj.id] = '';
                                                }else{

                                                    this.formJs.Hash[obj.id] = $('#' + obj.id).data("kendoMultiSelect").value();
                                                }
                                            }else if(objDataType === 'multicombo'){
                                                if(partsJs.string.isEmpty(obj.value)){
                                                    this.formJs.Hash[obj.id] = '';
                                                }else{

                                                    this.formJs.Hash[obj.id] = $('#' + obj.id).data("kendoExtMultiSelectDropDownList").value();
                                                }
                                            }else if(objDataType === 'number'){
                                                if(partsJs.string.isEmpty(obj.value)){
                                                    this.formJs.Hash[obj.id] = '';

                                                }else{
                                                    this.formJs.Hash[obj.id] = $('#' + obj.id).data("kendoExtNumericTextBox").value();
                                                }
                                            }else{
                                                if(partsJs.string.isEmpty(obj.value)){
                                                    this.formJs.Hash[obj.id] = '';

                                                }else{
                                                    this.formJs.Hash[obj.id] = obj.value;
                                                }
                                            }

                                        }catch(e){}
                                    break;
                                default:
                                    alert("알려지지 않은 type 펑션 수정해야 함-->"+pluginType);
                                    break;
                            }
                        } catch(e) {
                            try {
                                if (obj.childControlList.length > 0 ) {
                                    this.setAllPluginObjToHash(obj, this.formJs.Hash);
                                }
                            } catch(e) {}
                        }
                    }
                 }
            },

            /*******************************************************************************
             * 기 능 : Form 초기화(공통. kendo Combo 문제로 사용안함.(추후 적용 예정)
             *                     * 사용해도 상관은 없지만 KendoCombo값은 초기화 되지 않을것입니다.
             *                     대신 dms.data.groupObjAllDataInit를 사용.)
             ******************************************************************************/
            groupObjAllDataInit: function(){
                var gObj = partsJs.validate.formJs.Hash,
                    rParentObj = {}, //라디오, 콤보 등의 객체시 필요한 Select객체
                    rObj = 0,
                    rObjType;

                //공통 체크 로직
                for (var k in gObj) {
                    // use hasOwnProperty to filter out keys from the Object.prototype
                    if (gObj.hasOwnProperty(k)) {
                        try{

                            if(!partsJs.string.isEmpty(k)){
                                rObj = $('#' + k)[0];
                                rObjType = rObj.getAttribute('data-type');
                                if(partsJs.string.isEmpty(rObjType)){
                                    rObjType = 'input';
                                }

                                if( rObjType === 'input'){
                                    rObj.value = '';
                                }else if( rObjType === 'radio' || rObjType === 'checkbox' ){
                                    var chkDefault = rObj.getAttribute('data-default');

                                    if(!partsJs.string.isEmpty(chkDefault)){
                                        if(chkDefault === 'Y'){
                                            rObj.checked =  true;
                                        }else{
                                            rObj.checked =  false;
                                        }
                                    }else{
                                        rObj.checked = false;
                                    }

                                }else if( rObjType === 'combo'){
                                    rParentObj = $('#' + k);
                                    rParentObj.data("kendoExtDropDownList").value('');
                                }else if( rObjType === 'multiselect'){
                                    rParentObj = $('#' + k);
                                    rParentObj.data("kendoMultiSelect").value('');
                                }else if( rObjType === 'multicombo'){
                                    rParentObj = $('#' + k);
                                    rParentObj.data("kendoExtMultiSelectDropDownList").value([]);
                                }else if( rObjType === 'number'){
                                    rParentObj = $('#' + k);
                                    rParentObj.data("kendoExtNumericTextBox").value('');
                                }else if( rObjType === 'date'){
                                    rParentObj = $('#' + k);
                                    rParentObj.data("kendoDatePicker").value(''); //초기화시 같은 날인 경우 날짜정보가 삭제됨.
                                }else if( rObjType === 'maskDate'){
                                    rParentObj = $('#' + k);
                                    rParentObj.data("kendoExtMaskedDatePicker").value(''); //초기화시 같은 날인 경우 날짜정보가 삭제됨.
                                }else if( rObjType === 'dateTime'){
                                    rParentObj = $('#' + k);
                                    rParentObj.data("kendoDateTimePicker").value(''); //초기화시 같은 날인 경우 날짜정보가 삭제됨.
                                }else{
                                    rObj.value = '';
                                    //rObj = $('#' + k);
                                    //rObj.data("kendoDropDownList").value("");
                                }
                            }
                        }
                        catch(e){
                        }


                    }
                }
                return true;
            },

            /*******************************************************************************
             * 기 능 : Form 값 세팅
             ******************************************************************************/
            groupObjAllDataSet: function(dataObj){
                var gObj       = partsJs.validate.formJs.Hash,
                    rObj       = {},
                    rParentObj = {}, //라디오, 콤보 등의 객체시 필요한 Select객체
                    radioNm,
                    radionNmObj = {},
                    rObjType;

                //공통 체크 로직
                for (var k in gObj) {
                    // use hasOwnProperty to filter out keys from the Object.prototype
                    if (gObj.hasOwnProperty(k)) {
                        try{

                            if(!partsJs.string.isEmpty(k)){
                                rObj = $('#' + k)[0];
                                rObjType = rObj.getAttribute('data-type');

                                if(partsJs.string.isEmpty(rObjType)){
                                    rObjType = 'input';
                                }

                                if( rObjType === 'input'){
                                    if(!partsJs.string.isEmpty(dataObj[k])){
                                        rObj.value = dataObj[k];
                                    }else{
                                        rObj.value = "";
                                    }
                                }else if( rObjType === 'date'  ){
                                    rParentObj = $('#' + k);
                                    rParentObj.data("kendoDatePicker").value(dataObj[k]);
                                    //rObj.value = dataObj[k];
                                }else if( rObjType === 'maskDate'  ){
                                    rParentObj = $('#' + k);
                                    rParentObj.data("kendoExtMaskedDatePicker").value(dataObj[k]);
                                    //rObj.value = dataObj[k];
                                }else if( rObjType === 'dateTime'  ){
                                    rParentObj = $('#' + k);
                                    rParentObj.data("kendoDateTimePicker").value(dataObj[k]);
                                    //rObj.value = dataObj[k];
                                }else if( rObjType === 'radio'){

                                    rParentObj = $('#' + k); //라디오 체크속성 사용하기 위한 변수
                                    radioNm = rObj.getAttribute('name');
                                    if( !Object.prototype.hasOwnProperty.call(radionNmObj, radioNm)){

                                        if(dataObj[radioNm] === rParentObj.data("radio")){

                                            //라디오 체크 여러번 발생하는걸 막기 위해 사용하는 변수
                                            radionNmObj[radioNm]='Y';

                                            rParentObj.prop("checked", true);
                                        }
                                    }


                                }else if( rObjType === 'checkbox'){
                                    if(dataObj[k] === 'Y'){
                                        rObj.checked =  true;
                                    }else{
                                        rObj.checked =  false;
                                    }

                                }else if( rObjType === 'combo'){
                                    rParentObj = $('#' + k);
                                    rParentObj.data("kendoExtDropDownList").value(dataObj[k]);
                                }else if( rObjType === 'multiselect'){
                                    rParentObj = $('#' + k);
                                    rParentObj.data("kendoMultiSelect").value(dataObj[k]);
                                }else if( rObjType === 'multicombo'){
                                    rParentObj = $('#' + k);
                                    rParentObj.data("kendoExtMultiSelectDropDownList").value(dataObj[k]);
                                }else if( rObjType === 'number'){
                                    rParentObj = $('#' + k);
                                    rParentObj.data("kendoExtNumericTextBox").value(dataObj[k]);
                                }else{
                                    if(!partsJs.string.isEmpty(dataObj[k])){
                                        rObj.value = dataObj[k];
                                    }else{
                                        rObj.value = "";
                                    }
                                    //rObj = $('#' + k);
                                    //rObj.data("kendoDropDownList").value("");
                                }
                            }
                        }
                        catch(e){
                        }


                    }
                }
                return true;
            },

            /*******************************************************************************
             * 기 능 : 프리폼 데이터 GET
             ******************************************************************************/
            groupObjAllDataCheck: function(){
                var gObj = this.formJs.Hash,
                rChk = 0;

                //공통 체크 로직
                for (var k in gObj) {
                    // use hasOwnProperty to filter out keys from the Object.prototype
                    if (gObj.hasOwnProperty(k)) {
                        rChk = this.checkPluginObj($('#' + k));

                        if (rChk != 0){
                            return false;
                        }
                    }
                }
                return true;
            },


            /*******************************************************************************
             * 기 능 : vaild 자동 체크
             ******************************************************************************/
            checkPluginObj: function(pObj) {
                this.recursiveFlag = 0;
                this.checkInvalid(pObj);
                return this.recursiveFlag;
            },
            /*******************************************************************************
             * 기 능 : vaild 자동 체크
             ******************************************************************************/
            checkInvalid: function(pObj) {

                var pMsg        = "",
                checkObj    = "",
                objValue    = "",
                tagType     = "",
                minLength   = -1,
                maxLength   = -1,
                mandatory   = false,
                arr         = new Array(),
                grpObj      = new Array(),
                prtObj      = null,
                chldNods    = null,
                chldNodLen  = 0,
                chkTagType  = "",
                chkDateType = "";
                try {
                    if (this.recursiveFlag != 0) {
                        return false;
                    }

                    grpObj = null;
                    grpObj = pObj[0];
                    try {
                        arr = new Array();
                        arr = grpObj.children;
                        if (arr.length == 0) {
                            try {
                                chkTagType = grpObj.tagName.toLowerCase();
                                switch (chkTagType) {
                                case "output":
                                case "input":
                                case "textarea":
                                case "select":
                                case "checkbox":
                                case "multiselect":
                                case "radio":
                                case "textbox":
                                    arr    = new Array(arguments[i]);
                                    break;
                                default:
                                    break;
                                }
                            } catch(e) {}
                        }

                    } catch (e) {
                        arr    = new Array(arguments[i]);
                    }

                    checkObj  = null;
                    objValue  = "";
                    tagType   = "";
                    minLength = -1;
                    maxLength = -1;
                    mandatory = false;
                    checkObj = grpObj;
                    try {
                        tagType = checkObj.tagName;
                        tagType = tagType.toLowerCase();
                    } catch (e) {
                        try {
                            if (checkObj.children.length > 0) {
                                this.checkInvalid(checkObj);
                            }
                        }  catch (e) {}
                        tagType = "";
                    }
                    switch (tagType) { // A002 swith
                    case "image":
                    case "grid":
                        break;
                    case "span":
                    case "article":
                    case "ul":
                    case "li":
                    case "div":
                        this.checkInvalid(checkObj);
                        break;
                    case "output":
                        break;
                    case "input":
                    case "textarea":
                    case "select":
                    case "checkbox":
                    case "multiselect":
                    case "radio":
                        objValue    = checkObj.value.trim();

                        mandatory = checkObj.getAttribute('data-mandatory');
                        minLength = checkObj.getAttribute('data-min');
                        maxLength = checkObj.getAttribute('data-max');

                        if(partsJs.string.isEmpty(mandatory)){
                            mandatory = false;
                        }

                        if(partsJs.string.isEmpty(minLength)){
                            minLength = -1;
                        }

                        if(partsJs.string.isEmpty(maxLength)){
                            maxLength = -1;
                        }

                        /*
                                     if(checkObj.dataset.hasOwnProperty('mandatory')){
                                        if(checkObj.dataset.mandatory === 'true'){
                                            mandatory = true;
                                        }
                                    }

                                    if(checkObj.dataset.hasOwnProperty('min')){
                                        if(!partsJs.string.isEmpty(checkObj.dataset.min) && checkObj.dataset.min !== '0'){
                                            minLength = checkObj.dataset.min;
                                        }
                                    }

                                    if(checkObj.dataset.hasOwnProperty('max')){
                                        if(!partsJs.string.isEmpty(checkObj.dataset.max) && checkObj.dataset.max !== '0'){
                                            maxLength = checkObj.dataset.max;
                                        }
                                    }
                         */

                        switch (tagType) {
                        case "input":

                            chkDateType = checkObj.getAttribute('data-type');
                            /*
                                          if(grpObj.dataset.hasOwnProperty('type')){
                                              if(grpObj.dataset.type === 'date'){
                                                  chkDateType = 'date';
                                              }else if(grpObj.dataset.type === 'number'){
                                                  chkDateType = 'number';
                                              }else{
                                                  chkDateType = 'input';
                                              }
                                          }else{
                                              chkDateType = 'input';
                                          }
                             */
                            if(partsJs.string.isEmpty(chkDateType)){
                                chkDateType = 'input';
                            }

                            //date 항목에 대한 체크
                            if (chkDateType === 'date' && objValue.length > 0) {
                                if(!partsJs.string.checkDate(checkObj, objValue, 'date')){
                                    this.fn_Msg_CheckOjb(checkObj, "dateCheck", pMsg, minLength);
                                    throw "e1";
                                }
                            }

                            //필수 입력항목인데 값이 없는 경우
                            if (mandatory && objValue.length === 0) {

                                this.fn_Msg_CheckOjb(checkObj, "mandatory", pMsg, minLength);
                                throw "e1";
                            }

                            if (mandatory == false && objValue.length == 0) {
                                //필수값이 아니면서 값이 없을때는 minLength도 체크하지 않는다.
                            } else if (minLength != -1 && objValue.length < minLength) {
                                this.fn_Msg_CheckOjb(checkObj, "minLength", pMsg, minLength);
                                throw "e1";
                            } else if (maxLength != -1 && objValue.length > maxLength) {
                                this.fn_Msg_CheckOjb(checkObj, "maxLength", pMsg, maxLength);
                                throw "e1";
                            }
                            break;

                        case "textarea":
                            if (mandatory && objValue.length == 0) {

                                this.fn_Msg_CheckOjb(checkObj, "mandatory", pMsg, minLength);
                                throw "e1";
                            }
                            if (mandatory == false && objValue.length == 0) {
                                //필수값이 아니면서 값이 없을때는 minLength도 체크하지 않는다.
                            } else if (minLength != -1 && objValue.length < minLength) {
                                this.fn_Msg_CheckOjb(checkObj, "minLength", pMsg, minLength);
                                throw "e1";
                            } else if (maxLength != -1 && objValue.length > maxLength) {
                                this.fn_Msg_CheckOjb(checkObj, "maxLength", pMsg, maxLength);
                                throw "e1";
                            }
                            break;

                        case "multiselect":
                        case "select":
                        case "checkbox":
                        case "radio":
                            if (mandatory && objValue.length == 0) {
                                this.fn_Msg_CheckOjb(checkObj, "mandatory", pMsg, minLength);
                                throw "e1";
                            }
                            break;
                        default:
                            break;
                        }
                        break;

                    default:
                        break;
                    } // A002 swith
                } catch (e) {
                    if (e != "e1") {
                        dms.notification.error("정의되지 않은 태그타입["+tagType, "]");
                    }
                    this.recursiveFlag = 1;
                }
            },
            /*******************************************************************************
             * 기 능 : vaild 자동 체크 메시지
             ******************************************************************************/
            fn_Msg_CheckOjb: function(pCheckObj, pAlertType, pMsg, pLen) {
                var tit = "",
                    labelNm;

                labelNm = $('[data-for="' + pCheckObj.getAttribute('data-lbl') + '"]',$("#"+this.formId)).text();

                if(partsJs.string.isEmpty(labelNm)){
                    labelNm = pCheckObj.id;
                }

                try{
                    //tit = pCheckObj.text.trim();
                    tit = labelNm;
                } catch(e) {
                    tit = "해당 항목";
                }
                if (pMsg != "") {
                    alert(pMsg);
                } else if (pAlertType == "mandatory") {
                    //alert( "["+ tit +"]" + "(은)는 필수 입력항목입니다.!") ;
                    dms.notification.error( "["+ tit +"]" + "(은)는 필수 입력항목입니다.!");
                } else if (pAlertType == "minLength") {
                    //alert( "["+ tit +"]" + "(은)는 " + pLen + "자리 이상 입력항목입니다.!") ;
                    dms.notification.error( "["+ tit +"]" + "(은)는 " + pLen + "자리 이상 입력항목입니다.!") ;
                } else if (pAlertType == "maxLength") {
                    //alert( "["+ tit +"]" + "(은)는 " + pLen + "자리 이하 입력항목입니다.!") ;
                    dms.notification.error( "["+ tit +"]" + "(은)는 " + pLen + "자리 이하 입력항목입니다.!") ;
                } else if(pAlertType == "dateCheck") {
                    //alert( "["+ tit +"]" + "의 날짜 형식을 다시 확인해주세요.") ;
                    dms.notification.error( "["+ tit +"]" + "의 날짜 형식을 다시 확인해주세요.");
                } else {
                    //alert("정의된 메시지가 없습니다.!");
                    dms.notification.error( "정의된 메시지가 없습니다.!");
                }
                try {
                    pCheckObj.select();
                } catch(e) {
                    pCheckObj.focus();
                }

                return false;
            }
    };

	window.partsJs = partsJs;

}(window, document, jQuery));
