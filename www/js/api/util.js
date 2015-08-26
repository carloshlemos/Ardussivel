var util = {
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
    mensagemInfo: function (mensagem, callbackFunction) {
        navigator.notification.alert(
                mensagem,
                function () {
                    callbackFunction();
                },
                'Informação',
                'Ok'
                );
    },
    mensagemAtencao: function (mensagem, callbackFunction) {
        navigator.notification.alert(
                mensagem,
                function () {
                    callbackFunction();
                },
                'Atenção',
                'Ok'
                );
    },
    mensagemErro: function (mensagem, callbackFunction) {
        navigator.notification.alert(
                mensagem,
                function () {
                    callbackFunction();
                },
                'Erro',
                'Ok'
                );
    },
    mensagemConfirme: function (mensagem, callBackFunctionSim, callBackFunctionNao) {
        navigator.notification.confirm(
                mensagem,
                function (buttonIndex) {
                    if (buttonIndex === 1) {
                        callBackFunctionSim();
                    } else {
                        callBackFunctionNao();
                    }
                },
                'Confirmação',
                'Sim, Não'
                );
    },
    mensagemConfirmacao: function (mensagem, callBackFunctionSim, callBackFunctionNao) {
        navigator.notification.confirm(
                mensagem,
                function (buttonIndex) {
                    if (buttonIndex === 1) {
                        callBackFunctionSim();
                    } else {
                        callBackFunctionNao();
                    }
                },
                'Confirmação',
                'Sim, Enviar mais tarde'
                );
    },
    dataAtualFormatada: function () {
        var data = new Date();
        var dia = data.getDate();
        if (dia.toString().length === 1)
            dia = "0" + dia;
        var mes = data.getMonth() + 1;
        if (mes.toString().length === 1)
            mes = "0" + mes;
        var ano = data.getFullYear();
        return dia + "/" + mes + "/" + ano;
    },
    formatDateTime: function (date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';

        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;

        var strTime = hours + ':' + minutes + ' ' + ampm;

        return strTime;
    },
    getMacAddress: function (callBackFunction) {
        window.MacAddress.getMacAddress(
                function (macAddress) {
                    callBackFunction(macAddress);
                }, function (fail) {
            util.mensagemErro('Erro ao adquirir o MacAddress do aparelho: ' + fail);
        });
    },
    getOID: function (params, callBackFunction) {
        window.RadWinPlugin.getOID(params, function (OID) {
            callBackFunction(OID);
        }, function (fail) {
            navigator.notification.activityStop();
            util.mensagemErro('Erro ao adquirir o OID: ' + fail);
        });
    },
    /**
     * método que retorna a hora e minuto atual.
     * Usado para marcar início e término dos exames.
     * 
     * @returns {obj}
     */
    getCurrentTime: function () {
        var currentTime = new Date(),
                hours = currentTime.getHours(),
                minutes = currentTime.getMinutes(),
                seconds = currentTime.getSeconds();

        if (minutes < 10)
            minutes = "0" + minutes;

        if (seconds < 10)
            seconds = "0" + seconds;

        return hours + ':' + minutes + ':' + seconds;
    }
};