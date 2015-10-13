var db = null;
var persistenceController = {
    // Application Constructor
    Comando: null,
    initialize: function () {
        this.bindEvents();
        this.openDb();
        this.setupDatabase();
    },
    // Bind Event Listeners   
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler   
    onDeviceReady: function () {

    },
    openDb: function () {
        if (window.openDatabase) {
            persistence.store.cordovasql.config(persistence, '/data/data/br.alfa.gnapi_ardussivel/databases/ardussivel.db', '1', 'Banco principal do Ardussivel', 50 * 1024 * 1024, 1);
        } else {
            persistence.store.memory.config(persistence);
        }
    },
    setupDatabase: function () {
        var Comando = persistence.define('Comando', {
            ambiente: 'TEXT',
            utensilio: 'TEXT',
            acao: 'TEXT',
            comando: 'TEXT',
            url: 'TEXT'
        });
        //Removing verbose operations
        persistence.debug = true;
        //Defining relationships
        persistenceController.Comando = Comando;
        //Apply definitions to the DB
        persistence.schemaSync();
    },
    save: function (data) {
        try {
            persistence.transaction(function (transaction) {
                console.log("Salvando...");
                persistence.add(data);
            });
        }
        catch (exc) {
            console.log("Erro ao tentar salvar: " + exc);
        }
    },
    load: function (data, callBackFunction){
            persistence.transaction(function (transaction) {
                persistenceController.Comando.load(data.id, function (item) {
                     callBackFunction(item);
                });
            });
    },
    remove: function (data) {
        try {
            persistence.transaction(function (transaction) {
                persistenceController.Comando.load(data.id, function (item) {
                     persistence.remove(item);
                });
            });
        }
        catch (exc) {
            console.log("Erro ao tentar remover: " + exc);
        }
    },
    flush: function () {
        persistence.transaction(function (tx) {
            persistence.flush(tx, function () {
                console.log("Done flushing!");
            });
        });
    }
};