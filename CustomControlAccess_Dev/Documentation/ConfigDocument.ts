let customEditableControl: Config[];

class Config {
    // code: unique;
    code: string;
    listType: "blacklist" | "whitelist";
    ruleNodes: RuleNode[];
}

class RuleNode {
    // code: exactly one RulePathNode shall named "root", shall be unique
    // checker: string for custom checker such as attribute, flag or user
    // rules: shall not mix different node rules
    code: "root" | string;
    checker: "bpfstage" | "role" | "team" | "status" | string;
    rules: Rule[];
}

class Rule {
    // matches: string[] for "list" checkerType; null for unmatched checker
    // includes: "__all__" for all controls
    // nextNode: set null to stop rule path
    matches: string[] | null;
    includes: string[];
    nextNode: string | null;
}