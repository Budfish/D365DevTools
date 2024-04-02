sample =
    [
        {
            "code": "string", // unique for each rule tree
            "listType": "string", // options: ["blacklist", "whitelist"]
            "rulePath": [
                {
                    "nodeCode": "string", // unique for each rule tree node. "root" for first node.
                    "checker": "string", // options: ["bpfstage", "role", "team", "status", ...] *... for extension package codes
                    "checkerType": "string", // options :["list", "switch"]
                    "rules": [
                        // {case, nextNode, includeControl}
                        {
                            "case": "string", // string for "switch" checkerType; string[] for "list" checkerType; null for unmatched checker
                            "nextNode": "string", // null if no next node, then return result
                            "includeControl": [], // to add in list
                        }
                    ]
                }
            ]
        }
    ]