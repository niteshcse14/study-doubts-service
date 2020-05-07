import CronJobOptions from "./base/CronJobOptions";
import cron from "node-cron";

export default class CronJob {
	static _task: cron;

	static destroy() {
		if (this._task) this._task.destroy();
	}

	static start(): object {
		if (this._task) return this._task.start();
		return null;
	}

	static stop(task): object {
		if (this._task) return this._task.stop();
		return null;
	}

	static validate(timer): boolean {
		return cron.validate(timer);
	}

	static task(timer, task) {
		if (!this.validate(timer)) new Error("Invalid cron-job timer");
		else return this._task = cron.schedule(timer, () =>  task)
	}
}
