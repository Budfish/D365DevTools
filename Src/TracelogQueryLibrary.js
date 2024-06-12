var art = art || {};
art.Tracelog = {
    onLoad: async function (executionContext) {
        await art.WebResource.setupFormContext(executionContext, "WebResource_TypeNamePicker");
        await art.WebResource.setupXrm(executionContext, "WebResource_TypeNamePicker");
    }
}