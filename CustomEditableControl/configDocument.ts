let EnvJson: Config[];

class Config {
    // code: unique;
    code: string;
    rulePath: RulePathNode[];
}

class RulePathNode {
    // nodeCode: exactly one RulePathNode shall named "root"
    // nodeCode: shall be unique
    // checker: string for custom checker such as attribute, flag or user
    // rules: shall not mix different node rules
    nodeCode: string;
    checker: "bpfstage" | "role" | "team" | "status" | string;
    checkerType: "list" | "switch";
    rules: NodeRule[];
}

class NodeRule {
    // result: "__all__" for all controls
    nextNode: string | null;
    result: "__all__" | string[];
}

class CaseNodeRule extends NodeRule {
    // case: null for unmatched checker
    case: string | null;
}

class ListNodeRule extends NodeRule {
    // list: null for unmatched checker
    list: string[] | null;
}

class CustomRule extends NodeRule {
    // *add custom determine rule if needed.
}
