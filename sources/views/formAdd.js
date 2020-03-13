import {JetView} from "webix-jet";
import {activitytypes} from "../models/activitytypes";
import {contacts} from "../models/contacts";
import {activities} from "../models/activities";

export default class FormViewAdd extends JetView {
	config() {
		return {
			view: "form",
			localId: "form",
			elements: [
				{
					label: "Details",
					view: "textarea",
					name: "Details"
				},
				{
					label: "Type",
					view: "combo",
					name: "TypeID",
					options: {
						body: {
							data: activitytypes,
							template: "#Value#"
						}
					},
					required: true,
					invalidMessage: "Type must be selected"
				},
				{
					label: "Contact",
					view: "combo",
					name: "ContactID",
					options: {
						body: {
							data: contacts,
							template: "#FirstName# #LastName#"
						}
					},
					required: true,
					invalidMessage: "Contact must be selected"
				},
				{
					cols: [
						{label: "Date", view: "datepicker", name: "date", format: webix.i18n.longDateFormatStr},
						{label: "Time", view: "datepicker", type: "time", name: "time", format: webix.i18n.timeFormatStr}
					]
				},
				{
					labelRight: "Completed",
					view: "checkbox"
				},
				{cols: [
					{},
					{
						view: "button",
						label: "Add",
						type: "form",
						width: 100,
						click: () => {
							const values = this.getRoot().getValues();
							const serverDate = webix.Date.dateToStr("%Y-%m-%d");
							const serverTime = webix.Date.dateToStr("%h:%i");
							values.DueDate = `${serverDate(values.date)} ${serverTime(values.time)}`;
							if (this.form.validate()) {
								activities.waitSave(() => {
									activities.add(values, 0);
								});
								this.getRoot().hide();
							}
							else {
								webix.message({type: "error", text: "Validation is failed! You should fix wrong data"});
							}
						}
					},
					{
						view: "button",
						label: "Cancel",
						type: "form",
						width: 100,
						click: () => {
							this.getRoot().hide();
						}
					}
				]},
				{}
			],
			rules: {
				TypeID: webix.rules.isNotEmpty,
				ContactID: webix.rules.isNotEmpty
			}
		};
	}

	init() {
		this.form = this.$$("form");
		this.on(this.form, "onValidationError", () => {
			webix.message({type: "error", text: "Please, check whether you filled Type and Contact field"});
		});
	}
}
