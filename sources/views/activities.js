import {JetView} from "webix-jet";
import PopupFormView from "./popupForm";
import {activities} from "../models/activities";
import {contacts} from "../models/contacts";
import {activitytypes} from "../models/activitytypes";

export default class ActivitiesView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return {
			rows: [
				{
					template: _("Activities"),
					type: "header",
					css: "webix_dark",
					height: 40
				},
				{
					type: "wide",
					cols: [
						{
							rows: [
								{
									cols: [
										{
											view: "tabbar",
											localId: "tabbarFilter",
											value: "All",
											options:
												[
													{id: "all", value: _("All")},
													{id: "overdue", value: _("Overdue")},
													{id: "completed", value: _("Completed")},
													{id: "today", value: _("Today")},
													{id: "tomorrow", value: _("Tomorrow")},
													{id: "thisweek", value: _("This week")},
													{id: "thismonth", value: _("This month")}
												],
											on: {
												onChange: () => {
													this.$$("table").filterByAll();
												}
											}
										},
										{
											view: "button",
											type: "icon",
											icon: "wxi-plus-square",
											label: _("Add activity"),
											inputWidth: 200,
											align: "right",
											click: () => this.addItem()
										}
									]
								},
								{
									view: "datatable",
									localId: "table",
									scroll: "y",
									editable: true,
									editaction: "dblclick",
									css: "webix_data_border webix_header_border",
									columns: [
										{
											id: "State",
											header: ["", ""],
											template: "{common.checkbox()}",
											checkValue: "Close",
											uncheckValue: "Open",
											adjust: true
										},
										{
											id: "TypeID",
											header: [_("Activity type"), {content: "selectFilter"}],
											sort: "text",
											fillspace: true,
											options: activitytypes
										},
										{
											id: "DueDate",
											header: [_("Due date"), {content: "dateRangeFilter"}],
											adjust: true,
											sort: "date",
											format: webix.i18n.longDateFormatStr
										},
										{
											id: "Details",
											header: [_("Details"), {content: "textFilter"}],
											sort: "string",
											fillspace: true
										},
										{
											id: "ContactID",
											header: [_("Contact"), {content: "selectFilter"}],
											sort: "text",
											fillspace: true,
											options: contacts
										},
										{
											header: ["", ""],
											template: "<span class='myicon'></span>",
											adjust: true
										},
										{
											header: ["", ""],
											template: "{common.trashIcon()}",
											adjust: true
										}
									],
									onClick: {
										"wxi-trash": (e, id) => {
											webix.confirm({
												title: _("Remove this note"),
												ok: _("Yes"),
												cancel: _("No"),
												text: _("Are you sure you want to remove this note?")
											})
												.then(() => {
													webix.confirm({
														title: _("Warning!"),
														type: "confirm-warning",
														text: _("You are about to agree. Are you sure?")
													})
														.then(() => {
															activities.remove(id);
														});
												});
											return false;
										},
										myicon: (e, id) => {
											this.editItem(id.row);
										}
									}
								}
							]
						}
					]
				}
			]
		};
	}

	init() {
		this.table = this.$$("table");
		this.table.sync(activities);
		this._jetPopupForm = this.ui(PopupFormView);

		function getDates() {
			let today = new Date();
			let dates = {};
			dates.currentDay = webix.Date.datePart(today);
			dates.tomorrow = webix.Date.add(dates.currentDay, 1, "day", true);
			dates.startCurrentWeek = webix.Date.weekStart(dates.currentDay);
			dates.startCurrentMonth = webix.Date.monthStart(dates.currentDay);
			return dates;
		}

		const dates = getDates();

		this.table.registerFilter(
			this.$$("tabbarFilter"), {
				columnId: "State",
				compare: (value, filter, item) => {
					const serverFormat = webix.Date.dateToStr("%Y-%m-%d");
					let state = item.State;
					let date = item.DueDate;
					let DateDay = webix.Date.datePart(date, true);
					let startWeek = webix.Date.weekStart(DateDay);
					let startMonth = webix.Date.monthStart(DateDay);
					if (filter === "all") return item;
					else if (filter === "overdue") {
						return state === "Open" && date < new Date();
					}
					else if (filter === "completed") return state === "Close";
					else if (filter === "today") {
						console.log(dates.currentDay, DateDay, state);
						return webix.Date.equal(dates.currentDay, DateDay) && state === "Open";
					}
					else if (filter === "tomorrow") {
						return webix.Date.equal(dates.tomorrow, DateDay) && state === "Open";
					}
					else if (filter === "thisweek") {
						return webix.Date.equal(dates.startCurrentWeek, startWeek) && state === "Open";
					}
					return webix.Date.equal(dates.startCurrentMonth, startMonth) && state === "Open";
				}
			}, {
				getValue: node => node.getValue(),
				setValue: (node, value) => {
					node.setValue(value);
				}
			}
		);
	}

	editItem(id) {
		if (id) {
			this._jetPopupForm.showPopupForm(id);
		}
	}

	addItem() {
		this._jetPopupForm.showPopupForm();
	}
}
