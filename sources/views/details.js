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
		const details = {
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
					</div>
				`
				}
			]
		};

		const buttons = {
			padding: 25,
			css: "details_buttons",
			rows: [
				{
					cols: [
						{
							view: "button",
							width: 100,
							css: "webix_primary",
							label: "Delete",
							type: "icon",
							icon: "far fa-trash-alt"
						},
						{
							view: "button",
							width: 100,
							css: "webix_primary",
							label: "Edit",
							type: "icon",
							icon: "fas fa-edit"
						}
					]
				},
				{}
			]
		};

		return {
			rows: [
				{
					cols: [
						details,
						buttons
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
	urlChange() {
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			const id = this.getParam("id", true);
			if (id && contacts.exists(id)) {
				const contact = webix.copy(contacts.getItem(id));
				if (contact.StatusID) {
					contact.newStatusID = statuses.getItem(contact.StatusID).Value || "";
				}
				this.$$("contactsTemplate").parse(contact);
			}
		});
	}
}
