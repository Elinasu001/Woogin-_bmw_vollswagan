//(function($){
//	$.concat||$.extend({
//		concat:function(){
//			var o=[];
//			for(x in arguments){
//				o=o.concat(arguments[x])
//			};
//
//			return o
//		}
//	})
//})(jQuery);

var _rCRLF = /\r?\n/g,
	_rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	_rsubmittable = /^(?:input|select|textarea|keygen)/i;
	_rcheckableType = /^(?:checkbox|radio)$/i;

$.fn.extend({
	concat:function(){
		var o=[];
		for(x in arguments){
			o=o.concat(arguments[x]);
		};

		return o;
	},

	/**
	 * 폼요소, 또는 data-json-obj=true 속성을 가지는 폼요소를 json 오브젝트 생성한다.
	 * $("#formId").serializeObject();
	 * $("#elementId").serializeObject($("#elementId").serializeArrayInSelector("[data-json-obj=true]"));
	 */
	serializeObject : function(serializeArray){
	    var o = {};
	    var a = serializeArray? serializeArray : this.serializeArray();

	    $.each(a, function() {
	        if (o[this.name]) {
	            if (!o[this.name].push) {
	                o[this.name] = [o[this.name]];
	            }
	            o[this.name].push(this.value || '');
	        } else {
	            o[this.name] = this.value || '';
	        }
	    });
	    return o;
	 }

	 /**
	  * data-json-obj=true 속성을 가지는 폼요소를 json 오브젝트 생성한다.
	  * $("#elementId").serializeObjectBySelector("[data-json-obj=true]");
	  */
	 ,serializeObjectBySelector : function(selector) {
	     var s = selector || "[data-json-obj=true]";
	     var that = $(this.selector);
	     return that.serializeObject(that.serializeArrayInSelector(s));
	 }

	 /**
	  * data-json-obj=true 속성을 가지는 폼요소의 배열을 생성한다.
	  * $("#elementId").serializeArrayInSelector("[data-json-obj=true]");
	  */
	 ,serializeArrayInSelector : function(selector) {
	    var s = selector || "[data-json-obj=true]";

        return this.map(function() {
        	var elements = jQuery(s, this);
        	return elements ? jQuery.makeArray( elements ) : this;
        })
        .filter(function() {
        	var type = this.type;
        	return this.name && !jQuery( this ).is( ":disabled" ) &&
        		_rsubmittable.test( this.nodeName ) && !_rsubmitterTypes.test( type ) &&
        		( this.checked || !_rcheckableType.test( type ) );
        })
        .map(function( i, elem ) {
        	var val = jQuery( this ).val();

        	return val == null ?
        		null :
        		jQuery.isArray( val ) ?
        			jQuery.map( val, function( val ) {
        				return { name: elem.name, value: val.replace( _rCRLF, "\r\n" ) };
        			}) :
        			{ name: elem.name, value: val.replace( _rCRLF, "\r\n" ) };
        }).get();
	 }
});
