import Queue from "./Queue";

export default class Graph {
	adj: any;
	vertices: Number;
	constructor(vertices) {
		this.vertices = vertices;
		this.adj = new Map();
		for (let i = 0; i < this.vertices; ++i) this.adj.set(i, []);
	}

	addEdge(v, w) {
		this.adj.get(v).push(w);
	}

	printGraph() {
		for (let i = 0; i < this.vertices; ++i) {
			let get_values = this.adj.get(i), conc = "";
			for (let j of get_values)
				conc += j + " ";
			console.log(i + " -> " + conc);
		}
	}

	bfs(root) {
		let visited = [];
		for (let i = 0; i < this.vertices; i++)
			visited[i] = false;
		const qu = new Queue();
		visited[root] = true;
		qu.push(root);
		while (!qu.isEmpty) {
			let getQueueElement = qu.front();
			qu.pop();
			let get_List = this.adj.get(getQueueElement);
			for (let i in get_List) {
				let neigh = get_List[i];
				if (!visited[neigh]) {
					visited[neigh] = true;
					qu.push(neigh);
				}
			}
		}
	}

	dfs(root) {
		let visited = [];
		for (let i = 0; i < this.vertices; i++)
			visited[i] = false;
		this.DFSUtil(root, visited);
	}

	DFSUtil(vert, visited) {
		visited[vert] = true;
		let get_neighbours = this.adj.get(vert);
		for (let i in get_neighbours) {
			let get_elem = get_neighbours[i];
			if (!visited[get_elem])
				this.DFSUtil(get_elem, visited);
		}
	}
}
