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
			template: `
				<div class="top">
					<i class="#icon#"></i>
					<span>#value#</span>
					<i class="#icon#"></i>
					<span>#value#</span>
				</div>
			`,
			data: [
				{value: "Contacts", id: "contacts", icon: "fas fa-users"},
				{value: "Activities", id: "activities", icon: "fas fa-calendar-alt"},
				{value: "Settings", id: "settings", icon: "fas fa-cogs"}
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
