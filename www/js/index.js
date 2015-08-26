var app = {
    // Application Constructor
    mac: null,
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function () {
        util.initialize();

        util.getMacAddress(function (macAddress) {
            app.mac = macAddress;
            console.log('MacAddress: ' + macAddress);
        });

        $('select#flag').change(function () {
            navigator.notification.activityStart("Aguarde", "Enviando solicitação...");
            switch ($(this).val()) {
                case "on":
                    var comando = {
                        "ambiente": "sala",
                        "utensilio": "lâmpada",
                        "comando": "1",
                        "macAddress": app.mac
                    };

                    var comandoJSON = JSON.stringify(comando);

                    serviceController.connectJSONPOST(comandoJSON, "http://192.168.1.103:8080/restArduino/rest/arduino/enviarComando", function (result) {
                        navigator.notification.activityStop();
                        callBackFunction(result);
                    }, function (error) {
                        navigator.notification.activityStop();
                        switch (error.status) {
                            case 200:
                                util.mensagemAtencao('Ocorreu um erro desconhecido.');
                                break;
                            case 0:
                                util.mensagemErro('Serviço indisponível.');
                                break
                            default:
                                util.mensagemErro('Erro: ' + error.responseText);
                        }
                    });
                    break;
                case "off":
                    var comando = {
                        "ambiente": "sala",
                        "utensilio": "lâmpada",
                        "comando": "2",
                        "macAddress": app.mac
                    };

                    var comandoJSON = JSON.stringify(comando);

                    serviceController.connectJSONPOST(comandoJSON, "http://192.168.1.103:8080/restArduino/rest/arduino/enviarComando/", function (result) {
                        navigator.notification.activityStop();
                        callBackFunction(result);
                    }, function (error) {
                        navigator.notification.activityStop();
                        switch (error.status) {
                            case 200:
                                util.mensagemAtencao('Ocorreu um erro desconhecido.');
                                break;
                            case 0:
                                util.mensagemErro('Serviço indisponível.');
                                break
                            default:
                                util.mensagemErro('Erro: ' + error.responseText);
                        }
                    });
                    break;
            }
        });

        $("#btnLigar").click(function () {
            navigator.notification.activityStart("Aguarde", "Enviando solicitação...");
            var comando = {
                "ambiente": "sala",
                "utensilio": "lâmpada",
                "comando": "1",
                "macAddress": app.mac
            };

            var comandoJSON = JSON.stringify(comando);

            serviceController.connectJSONPOST(comandoJSON, "http://192.168.1.103:8080/restArduino/rest/arduino/enviarComando", function (result) {
                navigator.notification.activityStop();
                callBackFunction(result);
            }, function (error) {
                navigator.notification.activityStop();
                switch (error.status) {
                    case 200:
                        util.mensagemAtencao('Ocorreu um erro desconhecido.');
                        break;
                    case 0:
                        util.mensagemErro('Serviço indisponível.');
                        break
                    default:
                        util.mensagemErro('Erro: ' + error.responseText);
                }
            });
        });

        $("#btnDesligar").click(function () {
            navigator.notification.activityStart("Aguarde", "Enviando solicitação...");
            var comando = {
                "ambiente": "sala",
                "utensilio": "lâmpada",
                "comando": "2",
                "macAddress": app.mac
            };

            var comandoJSON = JSON.stringify(comando);

            serviceController.connectJSONPOST(comandoJSON, "http://192.168.1.103:8080/restArduino/rest/arduino/enviarComando", function (result) {
                navigator.notification.activityStop();
                callBackFunction(result);
            }, function (error) {
                navigator.notification.activityStop();
                switch (error.status) {
                    case 200:
                        util.mensagemAtencao('Ocorreu um erro desconhecido.');
                        break;
                    case 0:
                        util.mensagemErro('Serviço indisponível.');
                        break
                    default:
                        util.mensagemErro('Erro: ' + error.responseText);
                }
            });
        });
    }
};

app.initialize();