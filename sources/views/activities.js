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
											value: "all",
											gravity: 2.5,
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
											gravity: 1,
											css: "add_activity",
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
											options: activitytypes,
											template: (obj) => {
												const activityType = activitytypes.getItem(obj.TypeID).value;
												const icon = activitytypes.getItem(obj.TypeID).Icon;
												return `${activityType} <span class="webix_icon wxi-${icon}"></span>`;
											}
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
											}).then(() => webix.confirm({
												title: _("Warning!"),
												type: "confirm-warning",
												text: _("You are about to agree. Are you sure?")
											})).then(() => {
												activities.remove(id);
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

	dateInfo() {
		const today = new Date();
		const dateObj = {};
		dateObj.currentDay = webix.Date.datePart(today);
		dateObj.tomorrow = webix.Date.add(dateObj.currentDay, 1, "day", true);
		dateObj.beginCurrentWeek = webix.Date.weekStart(dateObj.currentDay);
		dateObj.beginCurrentMonth = webix.Date.monthStart(dateObj.currentDay);
		return dateObj;
	}

	init() {
		this.table = this.$$("table");
		this._jetPopupForm = this.ui(PopupFormView);

		webix.promise.all([
			contacts.waitData,
			activities.waitData,
			activitytypes.waitData
		]).then(() => {
			this.table.sync(activities);
			activities.data.filter();
		});

		this.table.registerFilter(
			this.$$("tabbarFilter"), {
				columnId: "State",
				compare: (value, filter, item) => {
					const date = this.dateInfo();
					const today = new Date();
					const dateItem = item.DueDate;
					const datepart = webix.Date.datePart(dateItem, true);
					const beginWeek = webix.Date.weekStart(datepart);
					const beginMonth = webix.Date.monthStart(datepart);

					if (filter === "overdue") {
						return dateItem < today && value === "Open";
					}
					if (filter === "completed") {
						return value === "Close";
					}
					if (filter === "today") {
						return webix.Date.equal(date.currentDay, datepart) && value === "Open";
					}
					if (filter === "tomorrow") {
						return webix.Date.equal(date.tomorrow, datepart) && value === "Open";
					}
					if (filter === "thisweek") {
						return webix.Date.equal(date.beginCurrentWeek, beginWeek) && value === "Open";
					}
					if (filter === "thismonth") {
						return webix.Date.equal(date.beginCurrentMonth, beginMonth) && value === "Open";
					}
					return item;
				}
			},
			{
				getValue: input => input.getValue(),
				setValue: (input, value) => {
					input.setValue(value);
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
