import {JetApp, EmptyRouter, HashRouter, plugins} from "webix-jet";
import State from "./helpers/state";
import "./styles/app.css";

export default class MyApp extends JetApp {
	constructor(config) {
		const defaults = {
			id: APPNAME,
			version: VERSION,
			router: BUILD_AS_MODULE ? EmptyRouter : HashRouter,
			debug: true,
			start: "/top/contacts"
		};

		super({...defaults, ...config});
	}
}

if (!BUILD_AS_MODULE) {
	webix.ready(() => {
		const app = new MyApp();
		app.use(plugins.Locale);
		app.setService("state", new State(app));
		app.render();
	});
}
