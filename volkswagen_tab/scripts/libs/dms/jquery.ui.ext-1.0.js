(function($) {

	$.widget("woongjin.excelUpload", {
		version : "1.0",
		_intervalRef : null,
		options : {
	    	progressId	: null,
	    	uploadForm	: "uploadForm",
	    	uploadStatusUrl : _contextPath + "/cmm/excelUpload/selectExcelUploadStatus.do",
	    	interval : 300,
	    	messages : {
	    		fileUpload : "파일 업로드 중",
	    		fileUploadComplete : "파일 업로드 완료",
	    		dataExtract : "데이터 추출 중",
	    		dataExtractComplate : "데이터 추출 완료",
	    		uploadComplete : "완료"
	    	},
	    	callback : null,
	    	error : function(xhr, exception){
	    		if (xhr.status === 0) {
	                alert('Not connect.\n Verify Network.');
	            } else if (xhr.status == 404) {
	                alert('Requested page not found. [404]');
	            } else if (xhr.status == 500) {
	                alert('Internal Server Error [500].');
	            } else if (exception === 'parsererror') {
	                alert('Requested JSON parse failed.');
	            } else if (exception === 'timeout') {
	                alert('Time out error.');
	            } else if (exception === 'abort') {
	                alert('Ajax request aborted.');
	            } else {
	                alert('Uncaught Error.\n' + xhr.responseText);
	            }
	    	}
	    },

	    _create : function(){
	    	this.element.addClass("progress_section");
	    	this.progressMessageDiv = $("<div id='progressMessage'></div>").appendTo(this.element);
	    	this.progressbarDiv = $("<div id='progressbar'></div>").appendTo(this.element);
	    	this.progressIdInput = $("<input type='hidden' id='progressId' name='progressId' value='" + this.options.progressId + "' />").appendTo($("#" + this.options.uploadForm)[0]);

	    	this._refresh();
	    },

	    _destroy : function(){
	    	this.element.removeClass("progress_section");
	    	this.progressMessageDiv.remove();
	    	this.progressbarDiv.remove();
	    	this.progressIdInput.remove();
	    },

	    _refresh : function(){
	    	this.progressMessageDiv.text("");
	    	this.progressbarDiv.progressbar({value:0});
	    },

	    _setOptions: function() {
	    	this._superApply( arguments );
	    	this._refresh();
	    },

	    _setOption: function( key, value ) {
	    	if(key == "progressId" && this.options.progressId != value){
	    		this.progressIdInput.remove();
	    		this.progressIdInput = $("<input type='hidden' id='progressId' name='progressId' value='" + this.options.progressId + "' />").appendTo($("#" + this.options.uploadForm)[0]);
	    	}

	    	this._super( key, value );
	    },

	    upload : function () {
	    	this._refresh();
	    	var that = this;

	    	//ajaxSetup({ cache: false });

	    	$("#"+that.options.uploadForm).ajaxForm({
	    		beforeSubmit: function () {
	    			that.element.show();
	    			//that._displayProgress('N');
	    			that._intervalRef = window.setInterval(function(){
	    				that._displayProgress('N');
	    			}, that.options.interval);

//	    			that._intervalRef = window.setInterval("that._displayProgress('N')", that.options.interval);
	    		},
	    		success: function (data) {
	    			if(typeof that.options.callback == 'function'){
	    				that.options.callback(data);
	        		}
	    		},
	    		complete : function(){
	    			that._displayProgress('Y');
	    			that.element.hide();
	    			window.clearInterval(that._intervalRef);
	    		},
	    		error : function(xhr, exception){
	    			that._displayProgress('N');
	    			that.element.hide();
	    			that.options.error(xhr, exception);
	    		},
	    		dataType : 'json'
	    	});

	    	$("#"+that.options.uploadForm).submit();

	    },

	    _displayProgress : function (delYn) {
	    	that = this;
	    	$.ajax({
	    		url: that.options.uploadStatusUrl,
	    		data: { 'progressId': this.options.progressId, 'delYn': delYn },
	    		dataType: 'json',
	    		type: 'post',
	    		success: function (data) {

	    			if(data.status == 'SUCCESS'){

	    				var msg = that.options.messages.fileUpload;
	    				if(data.step == 1){
	    					msg = that.options.messages.fileUpload;
	    				}else if(data.step == 2){
	    					msg = that.options.messages.fileUploadComplete;
	    				}else if(data.step == 3){
	    					msg = that.options.messages.dataExtract + "("+data.currentRowNum+"/"+data.totalRowsCount+")";
	    				}else if(data.step == 4){
	    					msg = that.options.messages.dataExtractComplate;
	    				}else if(data.step == 5){
	    					msg = that.options.messages.uploadComplete;
	    					//window.clearInterval(that.intervalRef);
	    				}

	    				$("#progressbar").progressbar("value", parseInt(data.progress));
	    				that.progressMessageDiv.text(msg);

	    			}

	    		},
	    		error: function (xhr) {
	    		}
	    	});
	    }

	});
})(jQuery);