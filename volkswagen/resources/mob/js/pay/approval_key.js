    var ajax_flag = true;
    var req01_AJAX;
    var PayUrl="";

    function kcp_AJAX()
    {
        if(ajax_flag)
        {
            var form = document.getElementById("order_info");
                        
			$.ajax({
	            url:_contextPath + "/mob/cmm/pay/orderApproval.do"
	            ,data:JSON.stringify({
	                 "site_cd":form.site_cd.value
	                ,"ordr_idxx":form.ordr_idxx.value
	                ,"good_mny":form.good_mny.value
	                ,"pay_method":form.pay_method.value
	                ,"escw_used":form.escw_used.value
	                ,"good_name":form.good_name.value
	                ,"response_type":form.response_type.value
	                ,"ret_url":form.Ret_URL.value
	                ,"param_opt_1":form.param_opt_1.value
	            })
	            ,type:'POST'
	            ,dataType:'json'
	            ,contentType:'application/json'
	            ,beforeSend:function(jqXHR, settings){
	                dms.loading.show();
	            }
	            ,complete:function(jqXHR, textStatus){
	                dms.loading.hide();
	            }
	            ,error:function(jqXHR, status, error) {
	                //dms.notification.error(jqXHR.responseJSON.errors);
                    alert(JSON.parse(jqXHR.responseText).errors[0].errorMessage);
	            }
	            ,success:function(data, textStatus, jqXHR) {
					process_AJAX(jqXHR);
	            }
	        });             
            
            ajax_flag = false;
        }
        else
        {
            alert("통신 중입니다. 잠시만 기다려 주세요.");
        }
    }

    function process_AJAX(jqXHR)
    {
        if ( jqXHR.readyState == 4 ) //READY_STATE_COMPLETE = 4
        {
            if ( jqXHR.status == 200 )
            {
                if ( jqXHR.responseText != null )
                {
                    try
                    {
                        var form = document.getElementById("order_info");
                        
                        if( form.response_type.value == "JSON" )
                        {
                            StateChangeForJSON( jqXHR ); // JSON 방식일 경우
                        }
                        else if( form.response_type.value == "XML" )
                        {
                            StateChangeForXML( jqXHR ); // XML 방식일 경우
                        }
                        else if( form.response_type.value == "TEXT" || form.response_type.value == "" )
                        {
                            StateChangeForText( jqXHR ); // TEXT 방식일 경우
                        }
                    }
                    catch( e )
                    {
                        StateChangeForText( jqXHR ); // TEXT 방식일 경우
                    }
                }
            }
            else
            {
                ajax_flag=true;
                alert( jqXHR.responseJSON );
            }
        }
    }
    
    function StateChangeForJSON( xmlHttpRequest )
    {
        var json = eval('('+ xmlHttpRequest.responseText +')');
        
        if( json.Code == '0000' )
        {
            document.getElementById( "approval" ).value = json.approvalKey;
            // 아래 alert는 삭제 해도됨
            //alert("성공적으로 거래가 등록 되었습니다.");
            PayUrl = json.PayUrl;
            
            document.getElementById( "PayUrl"  ).value = json.request_URI;
            document.getElementById( "traceNo" ).value = json.traceNo;
            
            call_pay_form();
        }
        else
        {
            ajax_flag=true;
            
            alert("실패 되었습니다.[" + json.Message + "]");
        }
    }