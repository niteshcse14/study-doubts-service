import cron from "node-cron";

export default interface CronJobOptions {
	destroy(task: cron);
	validate(timer: string): boolean;
	stop(task: cron): object;
	start(task: cron): object;
	task();
}
