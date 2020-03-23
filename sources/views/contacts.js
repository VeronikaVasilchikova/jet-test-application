import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";

export default class ContactsView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return {
			rows: [
				{
					template: _("Contacts"),
					type: "header",
					css: "webix_dark",
					height: 40
				},
				{
					cols: [
						{
							rows: [
								{
									view: "text",
									localId: "inputFind",
									css: "fltr",
									placeholder: _("Type to find mathing contacts"),
									on: {
										onTimedKeyPress: () => {
											let value = this.$$("inputFind").getValue().toLowerCase();
											this.$$("listOfContacts").filter((obj) => {
												let firstName = obj.FirstName.toLowerCase().indexOf(value);
												let lastName = obj.LastName.toLowerCase().indexOf(value);
												let job = obj.Job.toLowerCase().indexOf(value);
												return firstName !== -1 || lastName !== -1 || job !== -1;
											});
										}
									}
								},
								{
									width: 300,
									view: "list",
									localId: "listOfContacts",
									scroll: "y",
									select: true,
									type: {
										template: obj => `
											<div class="contact">
												<image class="contactphoto" src="${obj.Photo || "data/photo/contact_photo.jpg"}" />
												<div>
													<span class="contactname">${obj.FirstName} ${obj.LastName}</span>
													<span class="job">${obj.Job}</span>
												</div>
											</div>`,
										height: 66
									}
								},
								{
									view: "button",
									type: "icon",
									icon: "wxi-plus-square",
									label: _("Add contact"),
									click: () => this.show("./formForContact?value=add")
								}
							]
						},
						{$subview: true}
					]
				}
			]
		};
	}

	init() {
		this.list = this.$$("listOfContacts");
		this.list.sync(contacts);
		this.list.attachEvent("onItemClick", (id) => {
			this.setParam("id", id, true);
		});

		contacts.waitData.then(() => {
			const id = this.getParam("id") ? this.getParam("id") : this.list.getFirstId();
			this.list.select(id);
			this.setParam("id", id, true);
			this.show("./details");
		});
	}

	urlChange() {
		const id = this.getParam("id");
		if (id && contacts.exists(id)) {
			this.list.select(id);
		}
	}
}
