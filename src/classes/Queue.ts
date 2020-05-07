export default class Queue {
	items: any[];
	constructor() {
		this.items = [];
	}

	push(element) {
		this.items.push(element);
	}

	get pop() {
		if(this.isEmpty)
			return "Underflow";
		return this.items.shift();
	}

	get front() {
		if(this.isEmpty)
			return "No elements in Queue";
		return this.items[0];
	}

	get isEmpty(): boolean {
		return this.items.length == 0;
	}

	printQueue() {
		let str = "";
		for(let i = 0; i < this.items.length; i++)
			str += this.items[i] + " ";
		return str;
	}
}
