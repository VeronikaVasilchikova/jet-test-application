import {JetView} from "webix-jet";
import {statuses} from "../models/statuses";
import {activitytypes} from "../models/activitytypes";
import SettingsTable from "./settingstable";

export default class SettingsView extends JetView {
	config() {
		const lang = this.app.getService("locale").getLang();
		const _ = this.app.getService("locale")._;

		const segmented = {
			view: "segmented",
			value: lang,
			localId: "segmented",
			inputWidth: 300,
			options: [
				{id: "en", value: _("EN")},
				{id: "ru", value: _("RU")}
			],
			click: () => this.toggleLanguage()
		};

		return {
			rows: [
				{
					cols: [
						{}, {}, {},
						segmented
					]
				},
				{
					cols: [
						{$subview: new SettingsTable(this.app, "",
							activitytypes, "activityTypesTable", "Activity Types", "Icon", "Add type", "New activity type")},
						{view: "resizer"},
						{$subview: new SettingsTable(this.app, "",
							statuses, "statusesTable", "Statuses", "Icon", "Add status", "New contact status")}
					]
				}
			]
		};
	}

	toggleLanguage() {
		const languges = this.app.getService("locale");
		const value = this.$$("segmented").getValue();
		languges.setLang(value);
	}
}
