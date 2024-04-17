class RuleNode {
    index;
    parent;
    constructor() {

    }
    _constructDom() {
        this._ruleNode = document.createElement("div");
        this._nodeCode = document.createElement("input");
        this._checker = document.createElement("input");
        this._checkerType = document.createElement("input");
        this._rulesContainer = document.createElement("div");
        setupRuleNode();
        setupNodeCode();
        setupChecker();
        setupRulesContainer();

        function setupRuleNode() {

        }
        function setupNodeCode() {

        }
        function setupChecker() {

        }
        function setupRulesContainer() {

        }
    }
}
class NodeRule {
    index;
    parent;
    constructor() {

    }
    _constructDom() {
        this._rule = document.createElement("div");
        this._list = document.createElement("input");
        this._includes = document.createElement("input");
        this._nextNode = document.createElement("input");
    }
    getNode(code) {
        switch (code) {
            case "": {

            }
            case "": {

            }
            case "": {

            }
            case "": {

            }
            default: {
                return null;
            }
        }
    }
}