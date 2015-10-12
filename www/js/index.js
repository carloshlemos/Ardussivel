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
        comandoController.insertDefault(); //adiciona os comandos ao banco de dados da aplicação

        $("#btnHome").click(function () {
            app.montaPainelComandos();
            $.mobile.changePage("#page1", {transition: "flip"}, true, false);
        });

        $("#btnHome").hide();

        $("#btnVoltar").click(function () {
            $("#btnHome").hide();
            app.montaPainelComandos();
            $.mobile.changePage("#page1", {transition: "flip"}, true, false);
        });

        util.getMacAddress(function (macAddress) {
            app.mac = macAddress;
            console.log(macAddress);
        });

        app.montaPainelComandos();

        $("#btnCadastrarComando").click(function () {
            $("#btnHome").show();
            app.listaComandos();
            $.mobile.changePage("#page2", {transition: "flip"}, true, false);
        });

        $("#btnNovo").click(function () {
            $("#btnHome").show();
            $.mobile.changePage("#page3", {transition: "flip"}, true, false);
        });

        $("#btnSalvar").click(function () {
            comandoController.getComando(function (comando) {
                if (comando !== null) {
                    comando.ambiente = $('#txtAmbiente').val();
                    comando.utensilio = $('#txtUtensilio').val();
                    comando.acao = $('#txtAcao').val();
                    comando.comando = $('#txtComando').val();
                    comando.url = $('#txtURL').val();
                } else {
                    var comando = new persistenceController.Comando({
                        ambiente: $('#txtAmbiente').val(),
                        utensilio: $('#txtUtensilio').val(),
                        acao: $('#txtAcao').val(),
                        comando: $('#txtComando').val(),
                        url: $('#txtURL').val()
                    });
                }
                comandoController.salvar(comando);
            });
        });

        $("#btnCancelar").click(function () {
            $("#btnHome").hide();
            app.montaPainelComandos();
            $.mobile.changePage("#page1", {transition: "flip"}, true, false);
        });

        $("#txtComando").click(function () {
            $('#resultadosVoz').empty();
            navigator.SpeechRecognizer.startRecognize(function (results) {
                for (i in results) {
                    var comandoVoz = results[i].toLowerCase();
                    $("#resultadosVoz").append('<li> <a href = "#" onclick=\'javascript:app.addComando("' + comandoVoz + '");\'>' + comandoVoz + '</a></li>');
                    $('#resultadosVoz').listview().listview('refresh');
                }
                $('#DlgComandos').popup({positionTo: "window"}).popup('open');
            }, function (errorMessage) {
                console.log("Error message: " + errorMessage);
            }, 4, "Diga o Comando de Voz?", "pt-BR");
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
    },
    addComando: function (comando) {
        $("#txtComando").val(comando);
        $('#DlgComandos').popup('close');
    },
    editComando: function (comando) {
        comandoController.setComando(comando);
        $("#txtAmbiente").val(comando.ambiente);
        $("#txtUtensilio").val(comando.utensilio);
        $("#txtAcao").val(comando.acao);
        $("#txtComando").val(comando.comando);
        $("#txtURL").val(comando.url);

        $.mobile.changePage("#page3", {transition: "flip"}, true, false);
    },
    montaPainelComandos: function () {
        $("#divBtnComandos").html("");
        comandoController.listarTodos(function (results) {
            var map = {};
            for (i = 0; i < results.length; i++) {
                var comando = results[i];
                var keyMap = map[comando.utensilio];

                if (keyMap === null || keyMap === undefined) {
                    map[comando.utensilio] = [];
                    map[comando.utensilio].push(comando);
                } else {
                    map[comando.utensilio].push(comando);
                }
            }

            $.each(map, function (index, value) {
                var key = index;
                var htmlButtons = [];
                for (indice in value) {
                    htmlButtons.push(app.getButtonComando(value[indice]));
                }
                var content = "<div data-role='collapsible' data-theme='b' id='set" + key + "'><h3>" + key + "</h3>" + htmlButtons.join(" ") + "</div>";
                $("#divBtnComandos").append(content).collapsibleset('refresh');
            });
        });
    },
    actionButtonCommand: function (comando) {
        navigator.notification.activityStart("Aguarde", "Enviando solicitação...");
        app.enviaComando(comando.url);
    },
    getButtonComando: function (comando) {
        return "<a data-role='button' class='ui-link ui-btn ui-shadow ui-corner-all' onclick=\'javascript:app.actionButtonCommand(" + JSON.stringify(comando) + ");'>" + comando.acao + "</a>";
    },
    listaComandos: function () {
        $("#listaComandosCadastrados").empty();
        comandoController.listarTodos(function (results) {

            for (i = 0; i < results.length; i++) {
                var comando = results[i];
                $("#listaComandosCadastrados").append('<li><a href = "#" onclick=\'javascript:app.editComando(' + JSON.stringify(comando) + ');\'>' + comando.utensilio + ' - ' + comando.acao + '</a><a href="#" onclick=\'javascript:app.excluirComando(' + JSON.stringify(comando) + ');\'>Excluir</a></li>');
                $('#listaComandosCadastrados').listview().listview('refresh');
            }
        });
    },
    excluirComando: function (comando) {
        comandoController.excluir(comando);
        app.listaComandos();
    }

};
