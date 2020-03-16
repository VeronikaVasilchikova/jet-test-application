import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";
import {statuses} from "../models/statuses";
import DatatableActivitiesView from "./datatableActivities";
import DatatableFilesView from "./datatableFiles";
import FormForContactView from "./formForContact";

export default class DetailsView extends JetView {
	config() {
		const tabbar = {
			view: "tabbar",
			value: "activities",
			localId: "tabbar",
			options: [
				{value: "Activities", id: "activities"},
				{value: "Files", id: "files"}
			],
			height: 50
		};
		return {
			type: "clean",
			rows: [
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
					onClick: {
						delete: (e) => {
							console.log(e.target.classList.value.split(" ")[1]);
							let id = e.target.classList.value.split(" ")[1];
							webix.confirm({
								title: "Remove this note",
								ok: "Yes",
								cancel: "No",
								text: "Are you sure you want to remove this note?"
							})
								.then(() => {
									webix.confirm({
										title: "Warning!",
										type: "confirm-warning",
										text: "You are about to agree. Are you sure?"
									})
										.then(() => {
											contacts.remove(id);
										});
								});
							return false;
						},
						edit: (e) => {
							let id = e.target.classList.value.split(" ")[1];
							if (!this.app.getService("state").getState()) {
								this._FormForContactView.showFormEdit(id);
							}
						}
					}
				},
				tabbar,
				{
					cells: [
						{localId: "activities", rows: [DatatableActivitiesView]},
						{localId: "files", rows: [DatatableFilesView]}
					]
				}
			]
		};
	}

	init() {
		this.$$("tabbar").attachEvent("onChange", id => this.$$(id).show());
		this._FormForContactView = this.ui(FormForContactView);
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
