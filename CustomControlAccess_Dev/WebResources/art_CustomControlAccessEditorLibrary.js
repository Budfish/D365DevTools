class RuleNode {
    index;
    parent;
    node;
    constructor() {
        this._constructDom();
    }
    _constructDom() {
        const self = this;
        const node = document.createElement("div");
        const head = getHead();
        const body = getBody();
        node.classList.add("cca_ruleNode");
        node.classList.add("cca_card");
        node.appendChild(head);
        node.appendChild(body);
        this.node = node;

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
            const adder = getAdder();
            node.classList.add("cca_body");
            node.appendChild(codeLine);
            node.appendChild(checkerLine);
            node.appendChild(rulesArea);
            node.appendChild(adder);
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
                    const node = document.createElement("div");
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
                    const node = document.createElement("div");
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
                const label = getLabel();
                const packer = getPacker();
                node.appendChild(label);
                node.appendChild(packer);
                return node;

                function getLabel() {
                    const node = document.createElement("div");
                    const content = getContent();
                    node.classList.add("cca_label");
                    node.appendChild(content);
                    return node;

                    function getContent() {
                        const node = document.createElement("span");
                        node.textContent = "rules";
                        return node;
                    }
                }
                function getPacker() {
                    const node = document.createElement("div");
                    const cards = getCards();
                    node.classList.add("cca_packer");
                    for (let c of cards) node.appendChild(c);
                    return node;

                    function getCards() {
                        const result = [];
                        for (let i = 0; i < 3; i++) {
                            const rule = new Rule();
                            result.push(rule.node);
                        }
                        return result;
                    }
                }
            }
            function getAdder() {
                const node = document.createElement("div");
                node.classList.add("cca_adder");
                return node;
            }
        }
    }
}
class Rule {
    index;
    parent;
    node;
    constructor() {
        this._constructDom();
    }
    _constructDom() {
        const self = this;
        const node = document.createElement("div");
        const head = getHead();
        const body = getBody();
        node.classList.add("cca_rule");
        node.classList.add("cca_card");
        node.appendChild(head);
        node.appendChild(body);
        this.node = node;

        function getHead() {
            const node = document.createElement("div");
            const title = getTitle();
            const tools = getTools();
            node.classList.add("cca_head");
            node.classList.add("cca_row");
            node.appendChild(title);
            node.appendChild(tools);
            return node;

            function getTitle() {
                const node = document.createElement("div");
                node.textContent = "folder";
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
            const matches = getMatches();
            const includes = getIncludes();
            const nextNode = getNextNode();
            node.appendChild(matches);
            node.appendChild(includes);
            node.appendChild(nextNode);
            return node;

            function getMatches() {
                const node = document.createElement("div");
                const label = getLabel();
                const input = getInput();
                node.classList.add("cca_row");
                node.appendChild(label);
                node.appendChild(input);
                return node;

                function getLabel() {
                    const node = document.createElement("div");
                    const content = getContent();
                    node.classList.add("cca_label");
                    node.appendChild(content);
                    return node;

                    function getContent() {
                        const node = document.createElement("span");
                        node.textContent = "matches";
                        return node;
                    }
                }
                function getInput() {
                    const node = document.createElement("div");
                    const input = getInput();
                    node.classList.add("cca_fullInput");
                    node.appendChild(input);
                    return node;

                    function getInput() {
                        const node = document.createElement("textarea");
                        node.rows = "1";
                        node.style.resize = "vertical";
                        return node;
                    }
                }
            }
            function getIncludes() {
                const node = document.createElement("div");
                const label = getLabel();
                const input = getInput();
                node.classList.add("cca_row");
                node.appendChild(label);
                node.appendChild(input);
                return node;

                function getLabel() {
                    const node = document.createElement("div");
                    const content = getContent();
                    node.classList.add("cca_label");
                    node.appendChild(content);
                    return node;

                    function getContent() {
                        const node = document.createElement("span");
                        node.textContent = "includes";
                        return node;
                    }
                }
                function getInput() {
                    const node = document.createElement("div");
                    const input = getInput();
                    node.classList.add("cca_fullInput");
                    node.appendChild(input);
                    return node;

                    function getInput() {
                        const node = document.createElement("textarea");
                        node.rows = "1";
                        node.style.resize = "vertical";
                        return node;
                    }
                }
            }
            function getNextNode() {
                const node = document.createElement("div");
                const label = getLabel();
                const input = getInput();
                node.classList.add("cca_row");
                node.appendChild(label);
                node.appendChild(input);
                return node;

                function getLabel() {
                    const node = document.createElement("div");
                    const content = getContent();
                    node.classList.add("cca_label");
                    node.appendChild(content);
                    return node;

                    function getContent() {
                        const node = document.createElement("span");
                        node.textContent = "next node";
                        return node;
                    }
                }
                function getInput() {
                    const node = document.createElement("div");
                    const input = getInput();
                    node.classList.add("cca_fullInput");
                    node.appendChild(input);
                    return node;

                    function getInput() {
                        const node = document.createElement("input");
                        node.type = "text";
                        return node;
                    }
                }
            }
        }
    }
}