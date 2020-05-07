import Graph from "../../../classes/Graph";

class Component {
	val: String;
	parent: String;
	child: [];

	constructor(val) {
		this.val = val;
		this.parent = null;
		this.child = [];
	}
}

declare var _db: any, services: any;
export default class ApiRoutesBuilder {
	mp: Map<string, any>;
	graph: Graph;
	adj_obj: any;
	constructor() {
		this.adj_obj = {};
		this.mp = new Map<string, any>();
		this.init();
	}

	init() {
		const keys = Object.keys(_db);
		this.graph = new Graph(keys.length);
		for (let i = 0; i < keys.length; ++i) {
			this.adj_obj[keys[i]] = i;
			this.adj_obj[i] = keys[i];
		}
		for (let i = 0; i < keys.length; ++i) {
			const obj = _db[keys[i]].schema.tree, _keys = Object.keys(obj);
			for (let j = 0; j < _keys.length; ++j) {
				const child = Array.isArray(obj[_keys[j]]) ? obj[_keys[j]][0].ref : obj[_keys[j]].ref;
				if (!!child) this.graph.addEdge(this.adj_obj[keys[i]], this.adj_obj[services.util_services.functionNameToVariableName(obj[_keys[j]].ref)]);
			}
		}
		this.bindRouting(keys.length);
	}
	bindRouting(nodes_count) {
		for (let i = 0; i < nodes_count; ++i) {
			let get_values = this.graph.adj.get(i), conc = this.adj_obj[i] + ":/{_id}/";
			for (let j of get_values)
				conc += this.adj_obj[j] + ":/{_id}";
		}
	}
}
