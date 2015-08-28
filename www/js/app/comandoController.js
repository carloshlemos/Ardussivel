var comandoController = {
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
        persistenceController.initialize();
    },
    insertDefault: function () {
        persistence.transaction(function (transaction) {
            persistenceController.Comando = new Comando({ambiente: "quarto", utensilio: "lâmpada", acao: "ligar", comando: 1});
            persistenceController.save(persistenceController.Comando);

            persistenceController.Comando = new Comando({ambiente: "quarto", utensilio: "lâmpada", acao: "desligar", comando: 2});
            persistenceController.save(persistenceController.Comando);

            persistenceController.Comando = new Comando({ambiente: "quarto", utensilio: "ar condicionado", acao: "ligar", comando: 3});
            persistenceController.save(persistenceController.Comando);

            persistenceController.Comando = new Comando({ambiente: "quarto", utensilio: "ar condicionado", acao: "desligar", comando: 4});
            persistenceController.save(persistenceController.Comando);

            persistenceController.Comando = new Comando({ambiente: "sala", utensilio: "tv", acao: "ligar", comando: 5});
            persistenceController.save(persistenceController.Comando);

            persistenceController.Comando = new Comando({ambiente: "sala", utensilio: "tv", acao: "desligar", comando: 6});
            persistenceController.save(persistenceController.Comando);

            persistenceController.Comando = new Comando({ambiente: "entrada", utensilio: "portão", acao: "abrir", comando: 7});
            persistenceController.save(persistenceController.Comando);

            persistenceController.Comando = new Comando({ambiente: "entrada", utensilio: "portão", acao: "fechar", comando: 8});
            persistenceController.save(persistenceController.Comando);
            
            persistenceController.Comando = new Comando({ambiente: "sala", utensilio: "tv", acao: "ligar", comando: 9});
            persistenceController.save(persistenceController.Comando);
            
            persistenceController.Comando = new Comando({ambiente: "sala", utensilio: "tv", acao: "desligar", comando: 10});
            persistenceController.save(persistenceController.Comando);

            persistenceController.flush();
        });
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
    }
};
