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
							template: `
								<span class='webix_icon wxi-user'></span>
								<strong>#FirstName# #LastName#</strong>
								#Email#
							`,
							scroll: "y",
							select: true
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
			this.listOfContacts.select(id);
		});
		this.on(this.listOfContacts, "onAfterSelect", (id) => {
			this.show(`./details?id=${id}`);
		});
	}
}
