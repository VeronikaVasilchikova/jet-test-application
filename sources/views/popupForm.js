import {JetView} from "webix-jet";
import {activitytypes} from "../models/activitytypes";
import {contacts} from "../models/contacts";
import {activities} from "../models/activities";

export default class PopupFormView extends JetView {
	config() {
		return {
			view: "window",
			localId: "window",
			position: "center",
			width: 450,
			move: true,
			head: " ",
			body: {
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
							localId: "btn",
							type: "form",
							width: 150,
							click: () => this.addOrEdit()
						},
						{
							view: "button",
							value: "Cancel",
							type: "form",
							width: 150,
							click: () => this.closeForm()
						}
					]},
					{}
				],
				rules: {
					TypeID: webix.rules.isNotEmpty,
					ContactID: webix.rules.isNotEmpty
				}
			}
		};
	}


	init() {
		this.form = this.$$("form");
	}

	showPopupForm(id) {
		if (id && activities.exists(id)) {
			const item = activities.getItem(id);
			this.form.setValues(item);
		}
		this.getRoot().show();
		const someAction = id ? "Edit activity" : "Add activity";
		this.getRoot().getHead().setHTML(someAction);
		this.$$("btn").setValue(someAction);
	}

	closeForm() {
		this.form.clear();
		this.form.clearValidation();
		this.getRoot().hide();
	}

	addOrEdit() {
		if (this.form.validate()) {
			const values = this.form.getValues();
			const hours = values.DueTime.getHours();
			const minutes = values.DueTime.getMinutes();
			values.DueDate.setHours(hours, minutes);
			if (values && values.id) {
				activities.updateItem(values.id, values);
			}
			else {
				activities.add(values, 0);
			}
			this.closeForm();
		}
	}
}
