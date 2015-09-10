var app = {
    // Application Constructor
    URLComandoVoz: "http://192.168.1.103:8080/restArduino/rest/arduino/enviarComandoVoz/",
    URLComando: "http://192.168.1.103:8080/restArduino/rest/arduino/enviarComando/",
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

        $("#btnLigarLampada").click(function () {
			comandoController.insertDefault(); //adiciona os comandos ao banco de dados da aplicação
            navigator.notification.activityStart("Aguarde", "Enviando solicitação...");
            app.enviaComando(app.URLComando + "?comando=1");
        });

        $("#btnDesligarLampada").click(function () {
            navigator.notification.activityStart("Aguarde", "Enviando solicitação...");
            app.enviaComando(app.URLComando + "?comando=2");
        });

        $("#btnLigarArCondicionado").click(function () {
            navigator.notification.activityStart("Aguarde", "Enviando solicitação...");
            app.enviaComando(app.URLComando + "?comando=3");
        });

        $("#btnDesligarLampada").click(function () {
            navigator.notification.activityStart("Aguarde", "Enviando solicitação...");
            app.enviaComando(app.URLComando + "?comando=4");
        });

        $("#btnLigarTelevisor").click(function () {
            navigator.notification.activityStart("Aguarde", "Enviando solicitação...");
            app.enviaComando(app.URLComando + "?comando=5");
        });

        $("#btnDesligarTelevisor").click(function () {
            navigator.notification.activityStart("Aguarde", "Enviando solicitação...");
            app.enviaComando(app.URLComando + "?comando=6");
        });

        $("#btnAbrirPortao").click(function () { 
            navigator.notification.activityStart("Aguarde", "Enviando solicitação...");
            app.enviaComando(app.URLComando + "?comando=7");
        });

        $("#btnFecharPortao").click(function () { 
            navigator.notification.activityStart("Aguarde", "Enviando solicitação...");
            app.enviaComando(app.URLComando + "?comando=8");
        });

        $("#btnVozTeste").click(function () { //Adicionar recursividade
            navigator.SpeechRecognizer.startRecognize(function (result) {
                var comandoVoz = result.toString();
                if (comandoVoz.indexOf("lâmpada") > -1) {
                    navigator.SpeechRecognizer.startRecognize(function (result) {
                        var comandoVoz = result.toString();
                        switch (comandoVoz) {
                            case "ligar":
                                app.enviaComando(app.URLComando + "?comando=1");
                                break
                            case "desligar":
                                app.enviaComando(app.URLComando + "?comando=2");
                                break
                        }
                    }, function (errorMessage) {
                        console.log("Error message: " + errorMessage);
                    }, 1, "Qual a Ação?", "pt-BR");
                }
            }, function (errorMessage) {
                console.log("Error message: " + errorMessage);
            }, 1, "Qual o Utensílio?", "pt-BR");
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
                                app.enviaComandoVoz(comandoJSON, app.URLComandoVoz);
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
        serviceController.connectJSONPOST(null, url, function (result) {
            navigator.notification.activityStop();
            util.mensagemInfo('Comando executado com sucesso!');
        }, function (error) {
            navigator.notification.activityStop();
            switch (error.status) {
                case 200:
                    console.log(error.responseText);
                    //util.mensagemAtencao(error.responseText);
                    break;
                case 0:
                    util.mensagemErro('Serviço indisponível.');
                    break
                default:
                    util.mensagemErro('Erro: ' + error.responseText);
            }
        });
    }
};
