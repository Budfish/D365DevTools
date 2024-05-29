async function applyCustomEditableControlRule(executionContext, configCode) {
    const config = await getConfig();
    if (!validateConfig(config)) {
        return;
    }
    const controlList = getControlList(config);

    async function getConfig() {
        const configJsonCode = "customEditableControl";
        const result = await Xrm.WebApi.retrieveMultipleRecords("art_configjson", `?$select=art_json&$filter=art_code eq '${configJsonCode}'`);
        const configJsons = result.entities;
        if (configJsons.length == 0) {
            console.log(`[Error] art_configjson with art_code "${configJsonCode}" not found.`);
            return null;
        }
        if (configJsons.length > 1) {
            console.log(`[Warn] multiple art_configjson with art_code "${configJsonCode}".`);
        }

        const configJson = configJsons[0].art_json;
        const configs = JSON.parse(configJson);
        const matchCodeConfigs = configs.filter(config => config.code == configCode);
        if (matchCodeConfigs.length == 0) {
            console.log(`[Error] art_configjson(art_code='${configJsonCode}') has no "${configCode}" config.`);
            return null;
        }
        if (matchCodeConfigs.length > 1) {
            console.log(`[Warn] art_configjson(art_code='${configJsonCode}') has multiple "${configCode}" config.`);
        }

        return matchCodeConfigs[0];
    }
    function validateConfig(config) {
        if (!config) {
            return false;
        }
        if (!config.ruleNodes) {
            console.log(`[Error] config has no ruleNodes.`);
            return false;
        }

        return true;
    }
    function getControlList(config) {
        const ruleNodes = new Map(config.ruleNodes.map(node => [node.nodeCode, node]));
        let currentNode = "root";
        let controlList = [];
        while (ruleNodes.has(currentNode)) {
            const ruleNode = ruleNodes.get(currentNode);
            const matchCase = getRuleNodeMatchCase(ruleNode);
            controlList = controlList.concat(matchCase.includeControl);
            currentNode = matchCase.nextNode;
        }
        return controlList;
    }
    function getRuleNodeMatchCase(ruleNode) {
        let checker = undefined;
        switch (ruleNode.checker) {
            case "bpfstage": {
                break;
            }
            case "role": {
                break;
            }
            case "team": {
                break;
            }
            case "status": {
                break;
            }
            default: {

            }
        }
    }
}