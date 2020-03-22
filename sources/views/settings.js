import {JetView} from "webix-jet";
import {statuses} from "../models/statuses";
import {activitytypes} from "../models/activitytypes";
import SettingsTableView from "./settingstable";

export default class SettingsView extends JetView {
	config() {
		const lang = this.app.getService("locale").getLang();
		const _ = this.app.getService("locale")._;

		const segmented = {
			view: "segmented",
			height: 40,
			value: lang,
			localId: "segmented",
			inputWidth: 300,
			css: "settings_segmented",
			options: [
				{id: "en", value: _("EN")},
				{id: "ru", value: _("RU")}
			],
			click: () => this.toggleLanguage()
		};

		return {
			rows: [
				segmented,
				{
					cols: [
						{$subview: new SettingsTableView(this.app, "", activitytypes, "Activity types", "Activity types")},
						{width: 5},
						{$subview: new SettingsTableView(this.app, "", statuses, "Statuses", "Statuses")}
					]
				}
			]
		};
	}

	toggleLanguage() {
		const language = this.app.getService("locale");
		const value = this.$$("segmented").getValue();
		language.setLang(value);
	}
}
