require("dotenv").config();
import Application from "./bootloader/application";
new Application({
	max_events: 30,
	callback: function (error, success) {
		if (error) throw error;
		else console.log("Application Loaded Successfully");
	}
});
