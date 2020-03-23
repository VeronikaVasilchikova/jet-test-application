import {JetView} from "webix-jet";
import {statuses} from "../models/statuses";
import {contacts} from "../models/contacts";

export default class FormForContactView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return {
			view: "form",
			localId: "formForContact",
			elements: [
				{
					view: "label",
					label: _("Add new contact"),
					localId: "label"
				},
				{
					margin: 50,
					cols: [
						{
							rows: [
								{
									label: _("First Name"),
									view: "text",
									name: "FirstName",
									labelWidth: 100,
									required: true,
									invalidMessage: "Please, fill this field"
								},
								{
									label: _("Last Name"),
									view: "text",
									name: "LastName",
									labelWidth: 100,
									required: true,
									invalidMessage: "Please, fill this field"
								},
								{
									label: _("Joining date"),
									view: "datepicker",
									name: "StartDate",
									format: webix.i18n.longDateFormatStr,
									labelWidth: 100
								},
								{
									label: _("Status"),
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
									label: _("Job"),
									view: "text",
									name: "Job",
									labelWidth: 100
								},
								{
									label: _("Company"),
									view: "text",
									name: "Company",
									labelWidth: 100
								},
								{
									label: _("Website"),
									view: "text",
									name: "Website",
									labelWidth: 100
								},
								{
									label: _("Address"),
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
											label: _("Email"),
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
											label: _("Phone"),
											view: "text",
											name: "Phone",
											labelWidth: 100
										},
										{
											label: _("Birthday"),
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
													label: _("Change photo"),
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
													label: _("Delete photo"),
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
									value: _("Cancel"),
									type: "form",
									width: 100,
									click: () => this.closeForm()
								},
								{
									view: "button",
									value: _("Add"),
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
		this.photo = this.$$("contactPhoto");
	}

	closeForm(id) {
		this.form.clear();
		this.form.clearValidation();
		this.photo.setValues({Photo: ""});
		if (id) {
			this.show(`/top/contacts?id=${id}/details`);
		}
		else {
			this.show("./details");
		}
	}

	addOrEdit() {
		const _ = this.app.getService("locale")._;

		if (this.form.validate()) {
			const values = this.form.getValues();
			values.Photo = this.photo.getValues().Photo;
			contacts.waitSave(() => {
				if (values && values.id) {
					contacts.updateItem(values.id, values);
					webix.message({type: "success", text: _("Contact was updated successfully!")});
				}
				else {
					contacts.add(values, 0);
					webix.message({type: "success", text: _("Contact was added successfully!")});
				}
			}).then((res) => {
				this.closeForm(res.id);
			});
		}
	}

	deletePhoto() {
		this.$$("contactPhoto").setValues({Photo: ""});
	}

	urlChange() {
		const _ = this.app.getService("locale")._;

		webix.promise.all([
			statuses.waitData,
			contacts.waitData
		]).then(() => {
			const id = this.getParam("id", true);
			if (id && contacts.exists(id)) {
				const item = contacts.getItem(id);
				if (this.getParam("value") === "edit") {
					this.form.setValues(item);
					this.photo.setValues({Photo: item.Photo});
					this.$$("btn").setValue("Save");
					this.$$("btn").refresh();
					this.$$("label").setValue("Edit contact");
				}
			}
		});
	}
}
