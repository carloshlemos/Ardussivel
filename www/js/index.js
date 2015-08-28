var app = {
    // Application Constructor
    URLVoz: "http://192.168.1.103:8080/restArduino/rest/arduino/enviarComandoVoz/",
    URL: "http://192.168.1.103:8080/restArduino/rest/arduino/enviarComando/",
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
        comandoController.insertDefault(); //adiciona os comando ao banco de dados da aplicação

        util.getMacAddress(function (macAddress) {
            app.mac = macAddress;
            console.log(macAddress);
        });

        $('select#flag').change(function () {
            navigator.notification.activityStart("Aguarde", "Enviando solicitação...");
            switch ($(this).val()) {
                case "on":
                    app.enviaComando(app.URL + "?comando=1");
                    break;
                case "off":
                    app.enviaComando(app.URL + "?comando=2");
                    break;
            }
        });

        $("#btnVozTeste").click(function () { //Adicionar recursividade
            navigator.SpeechRecognizer.startRecognize(function (result) {
                var comandoVoz = result.toString();
                if (comandoVoz.indexOf("lâmpada") > -1) {
                    navigator.SpeechRecognizer.startRecognize(function (result) {
                        var comandoVoz = result.toString();
                        if (comandoVoz.indexOf("ligar") > -1) {
                            app.enviaComando(app.URL + "?comando=1");
                        }else if (comandoVoz.indexOf("desligar") > -1) {
                            app.enviaComando(app.URL + "?comando=2");
                        }
                    }, function (errorMessage) {
                        console.log("Error message: " + errorMessage);
                    }, 2, "Qual a Ação?", "pt-BR");
                }
            }, function (errorMessage) {
                console.log("Error message: " + errorMessage);
            }, 2, "Qual o Utensílio?", "pt-BR");
        });

        $("#btnVoz").click(function () { //Adicionar recursividade
            comandoController.digaComando("Qual o Ambiente?", 2, function (comandoVoz) {
                comandoController.listarComandosPorAmbiente(comandoVoz, function (results) {
                    var comandoEncontrado = false;
                    if (results.length > 0) {
                        for (i = 0; i < results.length; i++) {
                            var cmd = results[i];
                            comandoEncontrado = verificaComandoVoz(comandoVoz, cmd);
                        }

                        if (!comandoEncontrado) {
                            util.mensagemAtencao('Comando não disponível.');
                        }

                    } else {
                        util.mensagemAtencao('Ambiente não encontrado.');
                    }
                });
            });
        });

        function verificaComandoVoz(comandoVoz, cmd) {
            if (comandoVoz.indexOf(cmd.ambiente) > -1) {
                var comando = {
                    "ambiente": cmd.ambiente,
                    "utensilio": cmd.utensilio,
                    "acao": cmd.acao,
                    "comando": cmd.comando,
                    "macAddress": app.mac
                };

                comandoController.digaComando("Qual o Utensílio?", 2, function (comandoVoz) {
                    if (comandoVoz.indexOf(cmd.utensilio) > -1) {
                        comandoController.digaComando("Qual Ação desejada?", 2, function (comandoVoz) {
                            if (comandoVoz.indexOf(cmd.acao) > -1) {
                                var comandoJSON = JSON.stringify(comando);
                                navigator.notification.activityStart("Aguarde", "Enviando solicitação...");
                                app.enviaComandoVoz(comandoJSON, app.URL);
                            }
                        });
                    }
                });
                return true;
            }
            return false;
        }
    },
    enviaComandoVoz: function (comandoJSON, url) {
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
    },
    enviaComando: function (url) {
        serviceController.connectGETJSON(url, function (result) {
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