sample =
    [
        {
            "code": "string", // unique for each rule tree
            "rulePath": [
                {
                    "nodeCode": "string", // unique for each rule tree node. "root" for first node.
                    "checker": "string", // options: ["bpfstage", "role", "team", "status", ...] *... for extension package codes
                    "checkerType": "string", // options :["blacklist", "whitelist", "switch"]
                    "rules": [
                        // for "switch" checkerType
                        // {case, nextNode, result}
                        {
                            "case": "string",
                            "nextNode": "string", // null if no next node, then return result
                            "result": "string", // null if there's next node
                        },

                        // for "blacklist" and "whitelist"
                        // {list, nextNode, result} 
                        {
                            "list": [], // string array
                            "nextNode": "string", // null if no next node, then return result
                            "result": "string", // null if there's next node
                        }
                    ]
                }
            ]
        }
    ]