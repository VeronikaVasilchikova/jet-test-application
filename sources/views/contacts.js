import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";

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
						{$subview: true}
					]
				}
			]
		};
	}

	init() {
		this.listOfContacts = this.$$("listOfContacts");
		this.listOfContacts.sync(contacts);
		contacts.waitData.then(() => {
			let id = contacts.getFirstId();
			this.listOfContacts.select(id);
			this.show(`./details?id=${id}`);
		});
		this.on(this.listOfContacts, "onAfterSelect", (id) => {
			this.show(`./details?id=${id}`);
		});
	}
}
