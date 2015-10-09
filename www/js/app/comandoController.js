var comandoController = {
    // Application Constructor
    Comando: null,
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners   
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler   
    onDeviceReady: function () {
        persistenceController.initialize();
    },
    insertDefault: function () {
        comandoController.listarTodos(function (results) {
            if (results.length <= 0) {
                persistence.transaction(function (transaction) {
                    persistenceController.save(new persistenceController.Comando({ambiente: "Quarto", utensilio: "Lâmpada", acao: "Ligar", comando: "lâmpada ligar", url: "http://192.168.1.103:8080/restArduino/rest/arduino/enviarComando/?comando=1"}));
                    persistenceController.save(new persistenceController.Comando({ambiente: "Quarto", utensilio: "Lâmpada", acao: "Desligar", comando: "lâmpada desligar", url: "http://192.168.1.103:8080/restArduino/rest/arduino/enviarComando/?comando=2"}));

                    persistenceController.flush();
                });
            }
        });
    },
    getComando: function() {
        return comandoController.Comando;
    },
    setComando: function(comando){
        comandoController.Comando = comando;
    },
    listarTodos: function (callBackFunction) {
        try {
            persistence.transaction(function (transaction) {
                persistenceController.Comando.all()
                        .order("utensilio", true)
                        .list(null, function (results) {
                            callBackFunction(results);
                        });
            });
        }
        catch (exc) {
            console.log("Error: " + exc);
        }
    },
    listarComandosPorAmbiente: function (ambiente, callBackFunction) {
        try {
            persistence.transaction(function (transaction) {
                persistenceController.Comando.all()
                        .filter('ambiente', '=', ambiente)
                        .list(null, function (results) {
                            callBackFunction(results);
                        });
            });
        }
        catch (exc) {
            console.log("Error: " + exc);
        }
    },
    digaComando: function (param, maxResult, callBackFunction) {
        navigator.SpeechRecognizer.startRecognize(function (result) {
            var comandoVoz = result.toString();
            callBackFunction(comandoVoz);
        }, function (errorMessage) {
            console.log("Error message: " + errorMessage);
        }, maxResult, param, "pt-BR");
    },
    salvar: function (comando) {
        persistenceController.save(comando);
        persistenceController.flush();
        util.mensagemAtencao('Comando salvo com sucesso.');
    }
};
