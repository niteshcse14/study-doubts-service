declare var services: any;
export default class Base {
	_get(_config, URL) {
		const options = services.util_services.getOptions({
			url: services.util_services.generateRoute(_config, URL),
		});
		return services.http_services.init(options);
	}
};
