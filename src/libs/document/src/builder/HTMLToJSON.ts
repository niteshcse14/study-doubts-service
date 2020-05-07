import jsdom from "jsdom";
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const $ = require('jquery')(window);

export default class HTMLToJSON {
    static htmlJSON;
    static nodes;
    private static getHtmlConfig(content) {
        const htmlConfig: any = { _config: {}};
        htmlConfig.tag = content.tagName.toLocaleLowerCase();
        const attributes = content.attributes;
        for(let i = 0; i < attributes.length; ++i) htmlConfig._config[attributes[i].name] = attributes[i].value;
        return htmlConfig;
    }

    private static solveUtil(node, pre, start) {
        const html = $(node)[0], childs = $(node).children(), _config: any = this.getHtmlConfig(html);
        _config.parent = pre;
        if (!childs.length) _config.html = html.textContent.trim();
        this.htmlJSON[this.nodes] = _config;
        const parent = this.nodes;
        this.nodes++;
        for (let i = 0; i < childs.length; ++i) this.solveUtil(childs[i], parent + start, start);
    }

    static init(_config: any): any {
        this.htmlJSON = [];
        this.nodes = 1;
        const { html } = _config;
        const parent = +_config.parent || -1, start = +_config.start || 0;
        return new Promise((resolve, reject) => {
            this.solveUtil(html, parent, start);
            const res = {};
            for(let i = 0; i < this.htmlJSON.length; ++i) {
                if (!!!this.htmlJSON[i]) continue;
                res[start + i] = this.htmlJSON[i];
            }
            resolve(res);
        });
    };
}
