var art = art || {};
art.WebResource = {
    requestSetupFormContext: function (formContext, webResourceName) {
        this.setupFormContext(formContext, webResourceName);
    },
    setupFormContext: async function (formContext, webResourceName) {
        const webResource = formContext.getControl(webResourceName);
        const registered = await webResource.getContentWindow().then(window => {
            if (!window.crmsdkRegistered) return false;
            window.formContext = formContext;
            return true;
        })
        if (!registered) setTimeout(() => { this.setupFormContext(formContext, webResourceName) }, 100);
    },
    requestSetupXrm: function (formContext, webResourceName) {
        this.setupXrm(formContext, webResourceName);
    },
    setupXrm: async function (formContext, webResourceName) {
        const webResource = formContext.getControl(webResourceName);
        const registered = await webResource.getContentWindow().then(window => {
            if (!window.crmsdkRegistered) return false;
            window.Xrm = Xrm;
            return true;
        })
        if (!registered) setTimeout(() => { this.setupXrm(formContext, webResourceName) }, 100);
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
        window.crmsdkRegistered = true;
    },
}