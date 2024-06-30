var art = art || {};
art.ExceptionHandler = {
    activate: async function (formContext) {
        const recordId = formContext.data.entity.getId().replace(/[{}]/g, '').toLowerCase();
        const entityLogicalName = formContext.data.entity.getEntityName();
        const optionCondition = `?$select=art_exceptiontitle&$filter=art_entitylogicalname eq '${entityLogicalName}' and art_recordid eq '${recordId}' and art_display eq true`;

        const recordExLog = await Xrm.WebApi.retrieveMultipleRecords("art_exceptionlog", optionCondition);
        if (!recordExLog || !recordExLog.entities || recordExLog.length === 0) return;
        const recordExLogContents = recordExLog.entities.map((record) => {
            return record.art_exceptiontitle;
        });

        const infoId = "exceptionLog";
        for (let exlog = 0; exlog <= recordExLogContents.length; exlog++) {
            formContext.ui.setFormNotification(recordExLogContents[exlog], "INFO", infoId + exlog);
        };
    },

    log: async function (entityLogicalName, recordId, exceptionTitle, exceptionDescription) {
        const params = {
            EntityLogicalName: entityLogicalName,
            RecordId: recordId,
            ExceptionTitle: exceptionTitle,
            ExceptionDescription: exceptionDescription,
        };
        const request = new this.LogRequest(params);
        const data = await Xrm.WebApi.online.execute(request).then((data) => data.json()).catch(err => err);
    },
    LogRequest: class {
        constructor(params = {}) {
            this.EntityLogicalName = params.EntityLogicalName;
            this.RecordId = params.RecordId;
            this.ExceptionTitle = params.ExceptionTitle;
            this.ExceptionDescription = params.ExceptionDescription;
        };
        getMetadata = function () {
            return {
                operationName: "art_LogException",
                boundParameter: "",
                parameterTypes: {
                    "EntityLogicalName": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "RecordId": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "ExceptionTitle": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "ExceptionDescription": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                },
                operationType: 0,
            }
        }
    },
}