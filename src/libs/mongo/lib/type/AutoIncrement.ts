export default class AutoIncrementType {
	val: any;
	default_value: any;
	constructor(val) {
		this.val = val;
	}

	set set(val) {
		this.val = val;
	}

	get get() {
		return this.val;
	}

	set default(default_value) {
		this.default_value = default_value;
	}

	get default() {
		return (val) => {
			/*if (arguments.length === 1) {
				if (val === void 0) {
					this.default_value = void 0;
					return void 0;
				}
				this.default_value = val;
				return this.default_value;
			} else if (arguments.length > 1) {
				// this.default_value = utils.args(arguments);
			}*/
			return this.val;
		};
	}

	checkRequired(val) {
		return typeof val === "number" || val instanceof Number;
	}

	toBSON() {
		return this.val;
	}
}
