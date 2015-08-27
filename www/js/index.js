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
        comandoController.initialize();
        

        util.getMacAddress(function (macAddress) {
            app.mac = macAddress;
            console.log(macAddress);
        });

        $('select#flag').change(function () {
            navigator.notification.activityStart("Aguarde", "Enviando solicitação...");
            switch ($(this).val()) {
                case "on":
                    var comando = {
                        "ambiente": "sala",
                        "utensilio": "lâmpada",
                        "comando": 1,
                        "macAddress": app.mac
                    };

                    var comandoJSON = JSON.stringify(comando);
                    app.enviaComando(comandoJSON, "http://192.168.1.103:8080/restArduino/rest/arduino/enviarComando/");
                    break;
                case "off":
                    var comando = {
                        "ambiente": "sala",
                        "utensilio": "lâmpada",
                        "comando": 2,
                        "macAddress": app.mac
                    };

                    var comandoJSON = JSON.stringify(comando);
                    app.enviaComando(comandoJSON, "http://192.168.1.103:8080/restArduino/rest/arduino/enviarComando/");
                    break;
            }
        });

        $("#btnLigar").click(function () {
            navigator.notification.activityStart("Aguarde", "Enviando solicitação...");
            var comando = {
                "ambiente": "sala",
                "utensilio": "lâmpada",
                "comando": 1,
                "macAddress": app.mac
            };

            navigator.SpeechRecognizer.startRecognize(function (result) {
                var comando = result.toString();
                alert(comando);

                comandoController.listarComandosPorAmbiente(comando, function (results) {
                    alert(results.length);
//                    for (i = 0; i < results.length; i++) {
//                        var ambiente = results[i];
//                        
//                        if (comando.indexOf(ambiente) > -1) {
//                            var comandoJSON = JSON.stringify(comando);
//                            app.enviaComando(comandoJSON, "http://192.168.1.103:8080/restArduino/rest/arduino/enviarComando/");
//                        }
//                    }
                });

            }, function (errorMessage) {
                console.log("Error message: " + errorMessage);
            }, 2, "Diga o Comando", "pt-BR");
        });

        $("#btnDesligar").click(function () {
            navigator.notification.activityStart("Aguarde", "Enviando solicitação...");
            var comando = {
                "ambiente": "sala",
                "utensilio": "lâmpada",
                "comando": 2,
                "macAddress": app.mac
            };

            var comandoJSON = JSON.stringify(comando);
            app.enviaComando(comandoJSON, "http://192.168.1.103:8080/restArduino/rest/arduino/enviarComando/");
        });
    },
    enviaComando: function (comandoJSON, url) {
        serviceController.connectJSONPOST(comandoJSON, url, function (result) {
            navigator.notification.activityStop();
            util.mensagemInfo('Comando executado com sucesso!');
        }, function (error) {
            navigator.notification.activityStop();
            switch (error.status) {
                case 0:
                    util.mensagemErro('Serviço indisponível.');
                    break
                default:
                    util.mensagemErro('Erro: ' + error.responseText);
            }
        });
    }

};

app.initialize();