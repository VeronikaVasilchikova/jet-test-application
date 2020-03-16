import {JetView} from "webix-jet";
import {statuses} from "../models/statuses";
import {contacts} from "../models/contacts";

export default class FormForContactView extends JetView {
	config() {
		return {
			view: "form",
			localId: "formForContact",
			elements: [
				{
					view: "label",
					label: "Add new contact",
					localId: "labelAdd"
				},
				{
					view: "label",
					label: "Edit contact",
					localId: "labelEdit",
					hidden: true
				},
				{
					margin: 50,
					cols: [
						{
							rows: [
								{
									label: "First Name",
									view: "text",
									name: "FirstName",
									labelWidth: 100
								},
								{
									label: "Last Name",
									view: "text",
									name: "LastName",
									labelWidth: 100
								},
								{
									label: "Joining date",
									view: "datepicker",
									name: "StartDate",
									format: webix.i18n.longDateFormatStr,
									labelWidth: 100
								},
								{
									label: "Status",
									view: "combo",
									name: "StatusID",
									options: {
										body: {
											data: statuses,
											template: "#Value#"
										}
									},
									labelWidth: 100
								},
								{
									label: "Job",
									view: "text",
									name: "Job",
									labelWidth: 100
								},
								{
									label: "Company",
									view: "text",
									name: "Company",
									labelWidth: 100
								},
								{
									label: "Website",
									view: "text",
									name: "Website",
									labelWidth: 100
								},
								{
									label: "Address",
									view: "textarea",
									name: "Address",
									labelWidth: 100
								}
							]
						},
						{
							margin: 20,
							rows: [
								{
									rows: [
										{
											label: "Email",
											view: "text",
											name: "Email",
											labelWidth: 100
										},
										{
											label: "Skype",
											view: "text",
											name: "Skype",
											labelWidth: 100
										},
										{
											label: "Phone",
											view: "text",
											name: "Phone",
											pattern: {mask: "+## ### ### ## ##", allow: /[0-9]/g},
											labelWidth: 100
										},
										{
											label: "Birthday",
											view: "datepicker",
											name: "Birthday",
											format: webix.i18n.longDateFormatStr,
											labelWidth: 100
										},
									]
								},
								{
									cols: [
										{
											type: "clean",
											template: `
												<image class="form contactphoto" src="data/photo/contact_photo.jpg" />
											`
										},
										{
											margin: 10,
											rows: [
												{},
												{
													view: "uploader",
													label: "Change photo",
													accept: "image/jpeg, image/png",
													upload: "//docs.webix.com/samples/server/upload",
													autosend: false,
													multiple: false
												},
												{
													view: "button",
													type: "form",
													label: "Delete photo"
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{},
				{
					cols: [
						{},
						{
							cols: [
								{
									view: "button",
									label: "Cancel",
									type: "form",
									width: 100,
									click: () => {
										this.getRoot().hide();
										this.show("./details?id=1");
									}
								},
								{
									view: "button",
									label: "Add",
									localId: "btnAdd",
									type: "form",
									width: 100,
									click: () => {
										const values = this.getRoot().getValues();
										const serverDate = webix.Date.dateToStr("%Y-%m-%d");
										values.Birthday = `${serverDate(values.Birthday)}`;
										values.StartDate = `${serverDate(values.StartDate)}`;
										contacts.waitSave(() => {
											contacts.add(values);
										});
										this.getRoot().hide();
										this.show(`./details?id=${values.id}`);
										webix.message({type: "success", text: "Contact was added successfully!"});
									}
								},
								{
									view: "button",
									label: "Save",
									type: "form",
									width: 100,
									hidden: true,
									localId: "btnSave",
									click: () => {
										const values = this.getRoot().getValues();
										const serverDate = webix.Date.dateToStr("%Y-%m-%d");
										values.Birthday = `${serverDate(values.Birthday)}`;
										values.StartDate = `${serverDate(values.StartDate)}`;
										contacts.updateItem(values.id, values);
										this.getRoot().hide();
										this.show(`./details?id=${values.id}`);
										webix.message({type: "success", text: "Contact was updated successfully!"});
									}
								}
							]
						}
					]
				},
				{}
			]

		};
	}

	showFormEdit(id) {
		this.show(`./formForContact?id=${id}`);
	}

	showFormAdd() {
		this.show("./formForContact");

	}

	urlChange(view, url) {
		contacts.waitData.then(() => {
			const id = url[0].params.id;
			if (id) {
				view.setValues(contacts.getItem(id));
				this.$$("labelEdit").show();
				this.$$("btnSave").show();
				this.$$("labelAdd").hide();
				this.$$("btnAdd").hide();
			}
		});
	}
}
