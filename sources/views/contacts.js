import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";
//import FormForContactView from "./formForContact";

export default class ContactsView extends JetView {
	config() {
		return {
			rows: [
				{
					template: "Contacts",
					type: "header",
					css: "webix_dark",
					height: 40
				},
				{
					cols: [
						{
							rows: [
								{
									width: 300,
									view: "list",
									localId: "listOfContacts",
									scroll: "y",
									select: true,
									type: {
										template: obj => `
											<div class="contact">
												<image class="contactphoto" src="data/photo/contact_photo.jpg" />
												<div>
													<span class="contactname">${obj.FirstName} ${obj.LastName}</span>
													<span class="email">${obj.Email}</span>
												</div>
											</div>`,
										height: 66
									}
								},
								{
									view: "button",
									type: "icon",
									icon: "wxi-plus-square",
									label: "Add contact",
									// click: () => {
									// 	if (!this.app.getService("state").getState()) {
									// 		this._FormForContactView.showFormAdd();
									// 	}
									// }
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
		//this._FormForContactView = this.ui(FormForContactView);
	}
}
