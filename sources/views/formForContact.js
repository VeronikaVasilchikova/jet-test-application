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
					localId: "label"
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
									labelWidth: 100,
									required: true,
									invalidMessage: "Please, fill this field"
								},
								{
									label: "Last Name",
									view: "text",
									name: "LastName",
									labelWidth: 100,
									required: true,
									invalidMessage: "Please, fill this field"
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
											labelWidth: 100,
											invalidMessage: "Please, input valid email"
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
											labelWidth: 100
										},
										{
											label: "Birthday",
											view: "datepicker",
											name: "Birthday",
											format: webix.i18n.longDateFormatStr,
											labelWidth: 100
										}
									]
								},
								{
									cols: [
										{
											type: "clean",
											name: "Photo",
											template: obj => `<image class="form contactphoto" src=${obj.Photo || "data/photo/contact_photo.jpg"} />`,
											localId: "contactPhoto"
										},
										{
											margin: 10,
											rows: [
												{},
												{
													view: "uploader",
													label: "Change photo",
													accept: "image/jpeg, image/png",
													autosend: false,
													multiple: false,
													on: {
														onBeforeFileAdd: (item) => {
															const reader = new FileReader();
															reader.readAsDataURL(item.file);
															reader.onload = () => this.$$("contactPhoto").setValues({Photo: reader.result});
														},
														onFileUploadError: () => {
															webix.alert("Error during file upload");
														}
													}
												},
												{
													view: "button",
													type: "form",
													label: "Delete photo",
													click: () => this.deletePhoto()
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
									value: "Cancel",
									type: "form",
									width: 100,
									click: () => this.closeForm()
								},
								{
									view: "button",
									value: "Add",
									localId: "btn",
									type: "form",
									width: 100,
									click: () => this.addOrEdit()
								}
							]
						}
					]
				},
				{}
			],
			rules: {
				FirstName: webix.rules.isNotEmpty,
				LastName: webix.rules.isNotEmpty,
				Email: webix.rules.isEmail
			}
		};
	}

	init() {
		this.form = this.$$("formForContact");
	}

	closeForm() {
		this.form.clear();
		this.form.clearValidation();
		this.show("./details");
	}

	addOrEdit() {
		if (this.form.validate()) {
			const values = this.form.getValues();
			contacts.waitSave(() => {
				if (values && values.id) {
					contacts.updateItem(values.id, values);
					webix.message({type: "success", text: "Contact was updated successfully!"});
				}
				else {
					contacts.add(values, 0);
					webix.message({type: "success", text: "Contact was added successfully!"});
				}
			});
			this.closeForm();
		}
	}

	deletePhoto() {
		this.$$("contactPhoto").setValues({Photo: ""});
	}

	urlChange() {
		webix.promise.all([
			statuses.waitData,
			contacts.waitData
		]).then(() => {
			const id = this.getParam("id", true);
			const item = contacts.getItem(id);
			if (this.getParam("value") === "edit") {
				this.form.setValues(item);
				this.$$("btn").setValue("Save");
				this.$$("btn").refresh();
				this.$$("label").setValue("Edit contact");
			}
		});
	}
}
