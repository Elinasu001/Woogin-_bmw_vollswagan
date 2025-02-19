(function(){
    NmsClient = (function(){
        var that;
        function NmsClient(){
            this.jmsMesgTp = "W";
            this.userId = "";
            this.onMessageCallback = function(message){
            };
            this.jmsUrl = "";
            this.jmsUserName = "";
            this.jmsPassword = "";
            this.debug = false;

            switch(arguments.length){
                case 1:
                    this.jmsMesgTp = arguments[0];
                    break;
                case 2:
                    this.jmsMesgTp = arguments[0];
                    this.userId = arguments[1];
                    break;
                case 3:
                    this.jmsMesgTp = arguments[0];
                    this.userId = arguments[1];
                    this.onMessageCallback = arguments[2];
                    break;
                case 4:
                    this.jmsMesgTp = arguments[0];
                    this.userId = arguments[1];
                    this.onMessageCallback = arguments[2];
                    this.jmsUrl = arguments[3];
                    break;
                case 5:
                    this.jmsMesgTp = arguments[0];
                    this.userId = arguments[1];
                    this.onMessageCallback = arguments[2];
                    this.jmsUrl = arguments[3];
                    this.jmsUserName = arguments[4];
                    break;
                case 6:
                    this.jmsMesgTp = arguments[0];
                    this.userId = arguments[1];
                    this.onMessageCallback = arguments[2];
                    this.jmsUrl = arguments[3];
                    this.jmsUserName = arguments[4];
                    this.jmsPassword = arguments[5];
                    break;
            }

            that = this;
        };

        NmsClient.prototype.stompSuccessCallback = function(){
        };

        NmsClient.prototype.stompFailureCallback = function(error){
/*            var timer = setTimeout(that.stompConnect(), 10000);
            clearTimeout(timer);*/
            dms.notification.error('메시지서버 연결에 실패하였습니다. [ws-connection-lost]');
        };

        NmsClient.prototype.stompConnect = function(){
            var stompClient;
            stompClient = Stomp.client(that.jmsUrl);
            if(!that.debug){
                stompClient.debug = function(str){
                };
            }

            stompClient.heartbeat.outgoing = 60000;
            stompClient.heartbeat.incoming = 60000;

            stompClient.connect(
                that.jmsUserName
                ,that.jmsPassword
                ,function(frame){
                    that.stompSuccessCallback();
                    stompClient.subscribe(that.resolveDestinationName(), function(message) {
                        that.onMessageCallback(message);
                    });
                }
                ,that.stompFailureCallback
            );

            that.stompClient = stompClient;
        };

        NmsClient.prototype.stompDisConnect = function(){
            that.stompClient.disconnect(function(){
            });
        };

        NmsClient.prototype.setOnMessageCallback = function(callback){
            this.onMessageCallback = callback;
        };

        NmsClient.prototype.setDebug = function(isDebug){
            this.debug = isDebug;
            return this;
        };

        NmsClient.prototype.resolveDestinationName = function(){
            //return "wdmswdms.nms."+this.jmsMesgTp+"."+this.userId;
            return "wdmsdms.nms."+this.userId;
        };

        return NmsClient;
    })();

    SimpleNmsClient = {
        options:{
            jmsMesgTp:"W"
            ,userId:""
            ,onMessageCallback:function(message){
            }
            ,jmsUrl:""
            ,jmsUserName:""
            ,jmsPassword:""
        }
        ,setOptions:function(options){
            $.extend(true, this.options, options);
        }
        ,client:function(){
            return new NmsClient(
                this.options.jmsMesgTp
                ,this.options.userId
                ,this.options.onMessageCallback
                ,this.options.jmsUrl
                ,this.options.jmsUserName
                ,this.options.jmsPassword
            );
        }
    };

    window.SimpleNmsClient = SimpleNmsClient;
})(jQuery);





