// @ts-ignore
import bugsnag from "@bugsnag/js"

declare var config: any;
export default class Bugsnag {
	api_key: string;
	bugsnag_client: any;
	constructor() {
		this.init();
	}
	init() {
		if (!config.BUGSNAG_API_KEY) return;
		this.api_key = config.BUGSNAG_API_KEY;
		if (!this.api_key) throw Error(config.BUGSNAG_API_KEY_NOT_FOUND_MESSAGE);
		this.bugsnag_client = bugsnag({
			apiKey: this.api_key,
			metaData: {}
		});
		this.process();
	}

	process() {
		const _self = this;
		process.stdin.resume();
		process.stdin.on('data', function (d: Buffer) {
			const str = String(d).replace(/\s+/g, '');
			switch (str) {
				case 'u': return _self.unhandledError();
				case 'h': return _self.handledError();
				case 'l': return _self.leaveBreadcrumb(str);
				case 'b': return _self.beforeSend();
				default: return _self.unknown(str);
			}
		})
	}

	unknown (str: string) {
		console.log(`nothing configured for "${str}"`)
	}

	unhandledError () {
		console.log('throwing an error…');
		// unhandled exceptions and unhandled promise rejections are detected automatically
		throw new Error('unresolveable musical differences')
	}

	handledError () {
		console.log('notifying of a handled error…');
		// you can notify Bugsnag of errors you handled or created yourself
		this.bugsnag_client.notify(new Error('scheduling clash'))
	}

// TODO Breadcrumbs not yet implemented for Node
	leaveBreadcrumb(networkBlip: string) {
		console.log('leaving a breadcrumb…');
		// you can record all kinds of events which will be sent along with error reports
		// these can help when trying to understand the conditions leading up to an error
		this.bugsnag_client.leaveBreadcrumb('network blip')
	}

	beforeSend () {
		// beforeSend can be used to modify a report or prevent it from being sent at all
		// this example pseudo-randomly filters out approximately half of the reports
		this.bugsnag_client.notify(new Error('sometimes will send'), {
			beforeSend: (report) => {
				const n = Math.random();
				if (n <= 0.5) report.ignore()
			}
		})
	}
}
