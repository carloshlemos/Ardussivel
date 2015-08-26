var serviceController = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners   
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler   
    onDeviceReady: function () {
        
    },   
    connectJSONPOST: function (data, url, callBackFunction, ErroCallBack) {
        $.ajax({
            url: url,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: data,
            dataType: "json",
            type: 'POST',
            async: true,
            success: function (result) {
                callBackFunction(result);
            },
            error: function (xhr, status, thrownError) {
                ErroCallBack(xhr);
            }
        });
    },
    connectGETJSON: function (url, callBackFunction, ErroCallBack) {
        $.ajax({
            url: url,
            dataType: "json",
            async: true,
            success: function (result) {
                callBackFunction(result);
            },
            error: function (xhr, status, thrownError) {
                ErroCallBack(xhr);
            }
        });
    }    
};