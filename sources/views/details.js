import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";
import {statuses} from "../models/statuses";

export default class DetailsView extends JetView {
	config() {
		return {
			type: "clean",
			cols: [
				{
					localId: "contactsTemplate",
					template: `
					<h2>#FirstName# #LastName#</h2>
					<div class='details'>
						<div>
							<image class="contactphoto" src="data/photo/contact_photo.jpg" />
							<div class="status">Status #newStatusID#</div>
						</div>
						<div>
							<i class="fas fa-envelope"></i>#Email#<br><br>
							<i class="fab fa-skype"></i>#Skype#<br><br>
							<i class="fas fa-pencil-ruler"></i>#Job#<br><br>
							<i class="fas fa-briefcase"></i>#Company#
						</div>
						<div>
							<span class='webix_icon wxi-calendar'></span>#Birthday#<br><br>
							<i class="fas fa-map-marker-alt"></i>#Address#
						</div>
						<div>
							<button class="delete"><i class="far fa-trash-alt"></i>Delete</button>
							<button class="edit"><i class="fas fa-edit"></i>Edit</button>
						</div>
					</div>
				`
				}
			]
		};
	}

	urlChange() {
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			const id = this.getParam("id", true);
			if (id && contacts.exists(id)) {
				const contact = contacts.getItem(id);
				if (contact.StatusID) {
					contact.newStatusID = statuses.getItem(contact.StatusID).Value || "";
				}
				this.$$("contactsTemplate").parse(contact);
			}
		});
	}
}
