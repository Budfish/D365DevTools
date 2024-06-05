var art = art || {};
art.WebResource = {
    requestSetupFormContext: function (executionContext, webResourceName) {
        this.setupFormContext(executionContext, webResourceName);
    },
    setupFormContext: async function (executionContext, webResourceName) {
        const formContext = executionContext.getFormContext();
        const webResource = formContext.getControl(webResourceName);
        await webResource.getContentWindow().then(window => {
            window.formContext = formContext;
        })
    },
    requestSetupXrm: function (executionContext, webResourceName) {
        this.setupXrm(executionContext, webResourceName);
    },
    setupXrm: async function (executionContext, webResourceName) {
        const formContext = executionContext.getFormContext();
        const webResource = formContext.getControl(webResourceName);
        await webResource.getContentWindow().then(window => {
            window.Xrm = Xrm;
        })
    },
    registerCrmsdkOnload: function (callback, sdkNames = ['formContext', 'Xrm']) {
        if (!Array.isArray(sdkNames)) sdkNames = [sdkNames];
        const sdks = sdkNames.filter(name => name != "").map(name => {
            return { name: name, _name: `_${name}`, loaded: false };
        })
        const loader = {
            executed: false,
            set all(val) {
                if (val && !this.executed) {
                    callback();
                }
            }
        };
        for (let sdk of sdks) {
            Object.defineProperty(window, sdk.name, {
                set: function (val) {
                    this[sdk._name] = val;
                    sdk.loaded = true;
                    loader.all = sdks.reduce((result, sdk) => result && sdk.loaded, true);
                },
                get: function () {
                    return this[sdk._name];
                }
            })
        }
    },
}