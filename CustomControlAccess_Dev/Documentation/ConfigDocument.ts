let customEditableControl: Config[];

class Config {
    // code: unique;
    code: string;
    listType: "blacklist" | "whitelist";
    ruleNodes: RuleNode[];
}

class RuleNode {
    // nodeCode: exactly one RulePathNode shall named "root", shall be unique
    // checker: string for custom checker such as attribute, flag or user
    // rules: shall not mix different node rules
    nodeCode: "root" | string;
    checker: "bpfstage" | "role" | "team" | "status" | string;
    checkerType: "list" | "switch";
    rules: NodeRule[];
}

class NodeRule {
    // match: string for "switch" checkerType; string[] for "list" checkerType; null for unmatched checker
    // nextNode: set null to stop rule path
    // includeControl: "__all__" for all controls
    match: string | string[] | null;
    nextNode: string | null;
    includeControl: "__all__" | string[];
}