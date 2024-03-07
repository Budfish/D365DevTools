function postData(url, data) {
  return fetch(url, {
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    method: "POST",
  }).then((response) => response.json());
}

// 從Postman 中
token = "__Token__"
url = "https://__Domain__/api/data/v9.2/InsertOptionValue"
solution = "__SolutionName__"
optionSet = "__optionSetLogicalName__"

// 查看系統中的內容
// https://__Domain__/api/data/v9.2/GlobalOptionSetDefinitions(Name='__optionSetLogicalName__')


for(let value=765750001; value<=765750099; value++){
    data = {
      "OptionSetName": optionSet,
      "Value": value,
      "Label": {
        "@odata.type": "Microsoft.Dynamics.CRM.Label",
        "LocalizedLabels": [
          {
            "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
            "Label": "---",
            "LanguageCode": 1028,
            "IsManaged": false
          }
        ],
        "UserLocalizedLabel": {
          "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
          "Label": "---",
          "LanguageCode": 1028,
          "IsManaged": false
        }
      },
      "SolutionUniqueName": solution
    }
    response = await postData(url,data)
    console.log(response);
}
