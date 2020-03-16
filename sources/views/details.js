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
							<button class="delete #id#"><i class="far fa-trash-alt"></i>Delete</button>
							<button class="edit #id#"><i class="fas fa-edit"></i>Edit</button>
						</div>
					</div>
				`,
				},
				// {
				// 	view: "form",
				// 	rows: [
				// 		{
				// 			cols: [
				// 				{
				// 					view: "button",
				// 					type: "icon",
				// 					icon: "wxi-trash",
				// 					label: "Delete",
				// 					width: 150
				// 				},
				// 				{
				// 					view: "button",
				// 					type: "icon",
				// 					icon: "wxi-pencil",
				// 					label: "Edit",
				// 					width: 150
				// 				}
				// 			]
				// 		},
				// 		{}
				// 	]
				// }
			]
		};
	}

	urlChange(view, url) {
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		])
			.then(() => {
				let id = url[0].params.id;
				if (id) {
					let item = webix.copy(contacts.getItem(id));
					item.newStatusID = statuses.getItem(item.StatusID).Value;

					this.$$("contactsTemplate").parse(item);
				}
			});
	}
}
