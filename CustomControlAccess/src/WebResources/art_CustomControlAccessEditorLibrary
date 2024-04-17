class RuleNode {
    index;
    parent;
    constructor() {

    }
    _constructDom() {
        const node = document.createElement("div");
        const head = getHead();
        const body = getBody();
        node.classList.add("cca_ruleNode");
        node.classList.add("cca_card");
        node.appendChild(head);
        node.appendChild(body);

        function getHead() {
            const node = document.createElement("div");
            const heading = getHeading();
            const tools = getTools();
            node.classList.add("cca_head");
            node.classList.add("cca_row");
            node.appendChild(heading);
            node.appendChild(tools);
            return node;

            function getHeading() {
                const node = document.createElement("div");
                node.textContent = "heading";
                return node;
            }
            function getTools() {
                const node = document.createElement("div");
                node.textContent = "tools";
                return node;
            }
        }
        function getBody() {
            const node = document.createElement("div");
            const codeLine = getCodeLine();
            const checkerLine = getCheckerLine();
            const rulesArea = getRulesArea();
            node.classList.add("cca_body");
            node.appendChild(codeLine);
            node.appendChild(checkerLine);
            node.appendChild(rulesArea);
            return node;

            function getCodeLine() {
                const node = document.createElement("div");
                const label = getLabel();
                const input = getInput();
                node.classList.add("cca_row");
                node.appendChild(label);
                node.appendChild(input);
                return node;

                function getLabel() {
                    const node = document.createElement("div");
                    const context = getContext();
                    node.classList.add("cca_label");
                    node.appendChild(context);
                    return node;

                    function getContext() {
                        const node = document.createElement("span");
                        node.textContent = "code";
                        return node;
                    }
                }
                function getInput() {
                    const node = document.createElement("input");
                    const input = getInput();
                    node.classList.add("cca_fill");
                    node.appendChild(input)
                    return node;

                    function getInput() {
                        const node = document.createElement("input");
                        node.type = "text";
                        return node;
                    }
                }
            }
            function getCheckerLine() {
                const node = document.createElement("div");
                const label = getLabel();
                const input = getInput();
                node.classList.add("cca_row");
                node.appendChild(label);
                node.appendChild(input);
                return node;

                function getLabel() {
                    const node = document.createElement("div");
                    const context = getContext();
                    node.classList.add("cca_label");
                    node.appendChild(context);
                    return node;

                    function getContext() {
                        const node = document.createElement("span");
                        node.textContent = "checker";
                        return node;
                    }
                }
                function getInput() {
                    const node = document.createElement("input");
                    const input = getInput();
                    node.classList.add("cca_fill");
                    node.appendChild(input)
                    return node;

                    function getInput() {
                        const node = document.createElement("input");
                        node.type = "text";
                        return node;
                    }
                }
            }
            function getRulesArea() {
                const node = document.createElement("div");
                return node;

                // TODO
            }
        }
    }
}
class Rule {
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