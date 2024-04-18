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
    }
}