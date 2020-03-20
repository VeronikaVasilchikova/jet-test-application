import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";
import {statuses} from "../models/statuses";
import {activities} from "../models/activities";
import {fileStorage} from "../models/filestorage";
import DatatableActivitiesView from "./datatableActivities";
import DatatableFilesView from "./datatableFiles";

export default class DetailsView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

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
							label: _("Delete"),
							type: "icon",
							icon: "far fa-trash-alt",
							click: () => this.deleteContact()
						},
						{
							view: "button",
							width: 100,
							css: "webix_primary",
							label: _("Edit"),
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
				{value: _("Activities"), id: "activities"},
				{value: _("Files"), id: "files"}
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
					contact.Birthday = webix.i18n.longDateFormatStr(contact.Birthday);
				}
				this.$$("contactsTemplate").parse(contact);
			}
		});
	}

	deleteContact() {
		const _ = this.app.getService("locale")._;
		const id = this.getParam("id", true);
		if (id && contacts.exists(id)) {
			webix.confirm({
				title: _("Remove this contact"),
				ok: _("Yes"),
				cancel: _("No"),
				text: _("Are you sure you want to remove this contact?")
			})
				.then(() => {
					webix.confirm({
						title: _("Warning!"),
						type: "confirm-warning",
						text: _("You are about to agree. Are you sure?")
					})
						.then(() => {
							contacts.remove(id);
							const idVal = Number(id);
							const contactsActivities = activities.find(obj => obj.ContactID === idVal);
							contactsActivities.forEach((item) => {
								activities.remove(item.id);
							});
							const contactsFiles = fileStorage.find(obj => obj.ContactID === id);
							contactsFiles.forEach((item) => {
								fileStorage.remove(item.id);
							});
							const switchId = contacts.getFirstId();
							this.show(`/top/contacts?id=${switchId}/details`);
						});
				});
		}
	}

	editContact() {
		const values = this.$$("contactsTemplate").getValues();
		this.show(`/top/contacts?id=${values.id}/formForContact?value=edit`);
	}
}
