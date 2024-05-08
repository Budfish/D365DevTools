var art = art || {};
art.OpportunityRibbon = {
    click: async function (buttonName) {
        const data = {            
            "OptionCode": buttonName
        }
        console.log(data);

        await this.action.callSyncBuildCaseOptionData(data, this);
    },
    action: {
        callSyncBuildCaseOptionData: async function (data, self) {
            const request = new self.class.SyncBuildCaseOptionData(data);
            console.log(request);
            await Xrm.WebApi.online.execute(request).then(
                function success(result) {
                    console.log(result)
                },
                function error(error) {
                    console.log(error)
                }
            );
        }
    },
    class: {
        SyncBuildCaseOptionData: class{
            constructor(data) {
                const { OptionCode } = data;
                this.OptionCode = OptionCode;
            }
            getMetadata() {
                return {
                    boundParameter: null,
                    parameterTypes: {
                        OptionCode: {
                            typeName: "Edm.String",
                            structuralProperty: 1
                        }
                    },
                    operationType: 0,
                    operationName: "art_SyncBuildCaseOptionData"
                };
            }
        }
    }
}