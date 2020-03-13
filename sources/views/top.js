import {JetView, plugins} from "webix-jet";

export default class TopView extends JetView {
	config() {
		const header = {
			type: "header",
			template: "Jet Test Application"
		};

		const menu = {
			view: "menu",
			id: "top:menu",
			width: 180,
			layout: "y",
			select: true,
			template: "<span class='webix_icon #icon#'></span> #value# ",
			data: [
				{value: "Contacts", id: "contacts", icon: "wxi-user"},
				{value: "Activities", id: "activities", icon: "wxi-calendar"},
				{value: "Settings", id: "settings", icon: "wxi-sync"}
			]
		};

		const ui = {
			type: "clean",
			cols: [
				{
					rows: [{css: "webix_shadow_medium", rows: [header, menu]}]
				},
				{
					type: "wide",
					rows: [
						{$subview: true}
					]
				}
			]
		};

		return ui;
	}

	init() {
		this.use(plugins.Menu, "top:menu");
	}
}
