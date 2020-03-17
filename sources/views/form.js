import {JetView} from "webix-jet";
import {activitytypes} from "../models/activitytypes";
import {contacts} from "../models/contacts";
import {activities} from "../models/activities";

export default class FormView extends JetView {
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
						{label: "Date", view: "datepicker", name: "DueDate", type: "date", format: webix.i18n.longDateFormatStr},
						{label: "Time", view: "datepicker", name: "DueTime", type: "time", format: webix.i18n.timeFormatStr}
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
						value: "Add",
						localId: "addBtn",
						type: "form",
						width: 100,
						click: () => {
							const values = this.getRoot().getValues();
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
						value: "Save",
						localId: "saveBtn",
						type: "form",
						width: 100,
						click: () => {
							const values = this.getRoot().getValues();
							if (values.id && this.form.validate()) {
								activities.updateItem(values.id, values);
								this.getRoot().hide();
							}
							else {
								webix.message({type: "error", text: "Validation is failed! You should fix wrong data"});
							}
						}
					},
					{
						view: "button",
						value: "Cancel",
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
		this.addBtn = this.$$("addBtn");
		this.saveBtn = this.$$("saveBtn");
		this.on(this.form, "onValidationError", () => {
			webix.message({type: "error", text: "Please, check whether you filled Type and Contact field"});
		});
	}

	edit() {
		this.addBtn.hide();
	}

	add() {
		this.saveBtn.hide();
	}
}
