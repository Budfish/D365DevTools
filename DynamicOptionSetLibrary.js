var art = art || {};
art.DynamicOptionSet = {
    applyDynamicOptions: async function (formContext, attributeName, optionSetConfigCode) {
        // 命名
        const fieldControl = formContext.getControl(attributeName);

        // 執行動作
        await action()
        

        async function action(){
            let json = await getOptionsetJson(optionSetConfigCode);
            setupSmsControlOptions(fieldControl,json);
        }

        async function getOptionsetJson(optionSetConfigCode){
            return new Promise(async (resolve, reject) => {
                let options = `?$filter=art_code eq '${optionSetConfigCode}'&$select=art_configjson`
                let entityLogicalName = 'art_dynamicoptionsetconfig'
                await Xrm.WebApi.retrieveMultipleRecords(entityLogicalName, options).then(
                    function success(result) {
                        console.log(result);

                        const parsedRecords = result.entities.map((entity) => {
                            const configJson = JSON.parse(entity.art_configjson);
                            return { ...entity, art_configjson: configJson };
                        });
                        resolve(parsedRecords);
                    },
                    function err(err) {
                        reject(err);
                    }
                )
            })
        }

        function setupSmsControlOptions(control, optionMap) {
            control.clearOptions();
            for (let [option, value] of Object.entries(optionMap[0].art_configjson)) {
                control.addOption({ text: option, value: value })
            }
        }
    }
}