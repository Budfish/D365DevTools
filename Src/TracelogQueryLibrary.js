var art = art || {};
art.Tracelog = {
    onLoad: async function (executionContext) {
        const formContext = executionContext.getFormContext();
        await art.WebResource.setupFormContext(formContext, "WebResource_TypeNamePicker");
        await art.WebResource.setupXrm(formContext, "WebResource_TypeNamePicker");
    }
}