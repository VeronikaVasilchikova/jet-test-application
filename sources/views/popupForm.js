import {JetView} from "webix-jet";
import {activitytypes} from "../models/activitytypes";
import {contacts} from "../models/contacts";
import {activities} from "../models/activities";

export default class PopupFormView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

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
						label: _("Details"),
						view: "textarea",
						name: "Details"
					},
					{
						label: _("Type"),
						view: "combo",
						name: "TypeID",
						options: {
							body: {
								data: activitytypes,
								template: "#Value#"
							}
						},
						required: true,
						invalidMessage: _("Type must be selected")
					},
					{
						label: _("Contact"),
						view: "combo",
						name: "ContactID",
						localId: "ContactID",
						options: {
							body: {
								data: contacts,
								template: "#FirstName# #LastName#"
							}
						},
						required: true,
						invalidMessage: _("Contact must be selected")
					},
					{
						cols: [
							{label: _("Date"), view: "datepicker", name: "DueDate", type: "date", format: webix.i18n.longDateFormatStr},
							{label: _("Time"), view: "datepicker", name: "DueTime", type: "time", format: webix.i18n.timeFormatStr}
						]
					},
					{
						labelRight: _("Completed"),
						view: "checkbox"
					},
					{cols: [
						{},
						{
							view: "button",
							value: _("Add"),
							localId: "btn",
							type: "form",
							width: 150,
							click: () => this.addOrEdit()
						},
						{
							view: "button",
							value: _("Cancel"),
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

	showPopupForm(id, idForName = "") {
		const _ = this.app.getService("locale")._;

		if (id && activities.exists(id)) {
			const item = activities.getItem(id);
			this.form.setValues(item);
		}
		if (!id && idForName) {
			this.form.setValues({ContactID: idForName});
			this.$$("ContactID").disable();
		}
		this.getRoot().show();
		const someAction = id ? _("Edit activity") : _("Add activity");
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
			activities.waitSave(() => {
				if (values && values.id) {
					activities.updateItem(values.id, values);
					this.app.callEvent("onClickSave");
				}
				else {
					activities.add(values, 0);
					this.app.callEvent("onClickSave", [values]);
				}
			});
			this.closeForm();
		}
	}
}
