import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";
import {statuses} from "../models/statuses";
import DatatableActivitiesView from "./datatableActivities";
import DatatableFilesView from "./datatableFiles";
import FormForContactView from "./formForContact";

export default class DetailsView extends JetView {
	config() {
		const details = {
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
			</div>
		`
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
							icon: "far fa-trash-alt",
							click: () => this.deleteContact()
						},
						{
							view: "button",
							width: 100,
							css: "webix_primary",
							label: "Edit",
							type: "icon",
							icon: "fas fa-edit",
							click: () => this.editContact()
						}
					]
				},
				{}
			]
		};
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
					cols: [
						details,
						buttons
					]
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

	deleteContact() {
		const id = this.getParam("id", true);
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
	}

	editContact() {
		const values = this.$$("contactsTemplate").getValues();
		this.show(`/top/contacts?id=${values.id}/formForContact?value=edit`);
	}
}
