var art = art || {};
art.OpptyUi = {
    onLoad: async function (executionContext) {
        console.log('執行 onLoad');

        let formContext = executionContext.getFormContext();
        let userId = Xrm.Utility.getGlobalContext()?.userSettings?.userId?.replace(/[{}]/g, '');// 獲取當前用戶 ID

        this.action.validateFields(formContext,this);
        this.action.setOptionSetFields(formContext);
    },
    onSave: async function (executionContext) {
        console.log('執行 onSave');
        let formContext = executionContext.getFormContext();
        console.log('formContext = ',formContext);
        let delayInMillis = 1000;
        setTimeout(async ()=>{
            await this.action.UpdateOpptyProductCostRecords(formContext,this)
        }, delayInMillis);
        
        
    },
    action: {
        validateFields: function (formContext,self) {
            // 欄位驗證
          
            let fields ={
                "name": self.validate.name,
                "art_expectednegotiationdate": self.validate.art_expectednegotiationdate,
                "art_expectedsigningdate": self.validate.art_expectedsigningdate,
                "art_contractstartdate": self.validate.art_contractstartdate,
                "art_executionstartdate": self.validate.art_contractstartdate,
                "art_contractenddate": self.validate.art_contractenddate,
                "art_executionenddate": self.validate.art_contractenddate,
            }
            Object.keys(fields).map(key=>{
                formContext.getAttribute(key).addOnChange(fields[key])
            })
        },
        UpdateOpptyProductCostRecords: async function(formContext,self) {
            console.log('執行 UpdateOpptyProductCostRecords');

            const entityid = formContext.data?.entity?.getId();
            console.log('formContext.data = ',formContext.data);
            console.log('formContext.data?.entity? = ',formContext.data?.entity);
            console.log('entityid = ',entityid);

            if(!entityid || entityid === "") return
            const data = {OpportunityId: entityid};
            await callUpdateOpptyProductCostRecords(data);

            async function callUpdateOpptyProductCostRecords(data) {
                const request = new self.class.UpdateOpptyProductCostRecords(data);
                console.log(request);
                await Xrm.WebApi.online.execute(request).then(
                    function success(result) {
                        console.log(result);
                        var outputData = result.json()
                        console.log('outputData =',outputData);
                        Xrm.Navigation.navigateTo({pageType:"entityrecord", entityName:"opportunity",entityId: entityid})
                    },
                    function error(error) {
                        console.log(error)
                    }
                );
            }
        },
        setOptionSetFields: (formContext) => {
            let fields ={
                "art_projectexecutionunit": "Organization",
                "art_salesmanager": "AccountManager",
                "art_projectmanager": "ProjectManager",
                "art_clientname": "IncomeSource",
            }
            Object.keys(fields).map(key=>{
                art.DynamicOptionSet.applyDynamicOptions(formContext, key, fields[key]);
            })
        }
    },
    validate: {
        name: function (executionContext) {
            let control;
            let attribute;
            let formContext = executionContext?.getFormContext();
            control = formContext?.getControl('name');
            attribute = formContext?.getAttribute('name');
    
            // 正規表示法
            // 包含 '<' 或 '>'
            let regex = /[<>]/;
    
            control?.clearNotification("");
    
            // 定義正規表達式，檢查字串是否不包含 '<' 或 '>' 字符
            if(regex.test(attribute?.getValue())){
                control?.addNotification({
                    messages: ["名稱不可包含'<'或'>'"],
                    notificationLevel: 'ERROR'
                });
            }
        },
        art_expectednegotiationdate: function (executionContext) {
            let control;
            let expectednegotiationdate;
            let expectedbiddingdate;
            let formContext = executionContext.getFormContext();
            control = formContext?.getControl('art_expectednegotiationdate');
            expectednegotiationdate = formContext?.getAttribute('art_expectednegotiationdate')?.getValue() // 預計議價日
            expectedbiddingdate = formContext?.getAttribute('art_expectedbiddingdate')?.getValue() // 預計投標日
            control.clearNotification("");
            if(expectednegotiationdate < expectedbiddingdate){
                control?.addNotification({
                    messages: ["「預計議價日」不可早於「預計投標日」"],
                    notificationLevel: 'ERROR'
                });
            }
        },
        art_expectedsigningdate: function (executionContext) {
            let control;
            let expectedsigningdate;
            let expectednegotiationdate;
            let formContext = executionContext.getFormContext();
            control = formContext?.getControl('art_expectedsigningdate');
            expectedsigningdate = formContext?.getAttribute('art_expectedsigningdate')?.getValue() // 預計簽約日
            expectednegotiationdate = formContext?.getAttribute('art_expectednegotiationdate')?.getValue() // 預計議價日
            control.clearNotification("");
            if(expectedsigningdate < expectednegotiationdate){
                control?.addNotification({
                    messages: ["「預計簽約日」不可早於「預計議價日」"],
                    notificationLevel: 'ERROR'
                });
            }
        },
        art_contractstartdate: function (executionContext) {
            let control;
            let contractstartdate;
            let executionstartdate;
            let formContext = executionContext.getFormContext();
            control = formContext?.getControl('art_contractstartdate');
            contractstartdate = formContext?.getAttribute('art_contractstartdate')?.getValue() // 合約開始
            executionstartdate = formContext?.getAttribute('art_executionstartdate')?.getValue() // 執行開始
            control.clearNotification("");
            if(contractstartdate < executionstartdate){
                control?.addNotification({
                    messages: ["「合約起日」不可早於「執行起日」"],
                    notificationLevel: 'ERROR'
                });
            }
        },
        art_contractenddate: function (executionContext) {
            let control;
            let contractenddate;
            let executionenddate;
            let formContext = executionContext.getFormContext();
            control = formContext?.getControl('art_contractenddate');
            contractenddate = formContext?.getAttribute('art_contractenddate')?.getValue() // 合約結束
            executionenddate = formContext?.getAttribute('art_executionenddate')?.getValue() // 執行結束
            control.clearNotification("");
            if(contractenddate > executionenddate){
                control?.addNotification({
                    messages: ["「執行迄日」不可早於「合約迄日」"],
                    notificationLevel: 'ERROR'
                });
            }
        }

    },
    class: {
        UpdateOpptyProductCostRecords: class {
            constructor(data) {
                const { OpportunityId } = data;
                this.OpportunityId = OpportunityId;
            }
            getMetadata() {
                return {
                    boundParameter: null,
                    parameterTypes: {
                        OpportunityId: {
                            typeName: "Edm.String",
                            structuralProperty: 1
                        }
                    },
                    operationType: 0,
                    operationName: "art_UpdateOpptyProductCostRecords"
                };
            }
        }
    }
    // TODO (需求還需確認)
    // 用 GUID 查詢使用者加入"當區營業員"
    /*selectUser: async function(userId) {
        // 查詢使用者資料
        let entityLogicalName = "systemuser";
        let id = userId;
        let options = "?$select=fullname";
        const query = await Xrm.WebApi.retrieveRecord(entityLogicalName, id, options).then(
            function successCallback(result) {
                let fullname = result.fullname;
                let lookupUserValue = [{
                    id: userId,
                    name: fullname,
                    entityType: entityLogicalName
                }];
                return lookupUserValue;
            },
            function errorCallback(error) {
                console.log("錯誤回報：" + error.message)
                return null;
            }
        );
        return query;
    }*/

}