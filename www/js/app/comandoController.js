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
    }
};
