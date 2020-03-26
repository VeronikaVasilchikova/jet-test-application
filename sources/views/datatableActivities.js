import {JetView} from "webix-jet";
import PopupFormView from "./popupForm";
import {contacts} from "../models/contacts";
import {activities} from "../models/activities";
import {activitytypes} from "../models/activitytypes";

export default class DatatableActivitiesView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return {
			rows: [
				{
					view: "datatable",
					localId: "datatableAct",
					scroll: "y",
					css: "webix_data_border webix_header_border",
					autoconfig: true,
					columns: [
						{
							id: "State",
							header: "",
							template: "{common.checkbox()}",
							checkValue: "Close",
							uncheckValue: "Open",
							adjust: true
						},
						{
							id: "TypeID",
							header: [{content: "selectFilter"}],
							sort: "text",
							fillspace: true,
							options: activitytypes,
							template: (obj) => {
								const activityType = activitytypes.getItem(obj.TypeID).Value;
								const icon = activitytypes.getItem(obj.TypeID).Icon;
								return `${activityType} <span class="webix_icon wxi-${icon}"></span>`;
							}
						},
						{
							id: "DueDate",
							header: [{content: "dateRangeFilter"}],
							adjust: true,
							sort: "date",
							format: webix.i18n.longDateFormatStr
						},
						{
							id: "Details",
							header: [{content: "textFilter"}],
							sort: "string",
							fillspace: true
						},
						{
							header: "",
							template: "<span class='myicon'></span>",
							adjust: true
						},
						{
							header: "",
							template: "{common.trashIcon()}",
							adjust: true
						}
					],
					onClick: {
						"wxi-trash": (e, id) => {
							webix.confirm({
								title: _("Remove this note"),
								ok: _("Yes"),
								cancel: _("No"),
								text: _("Are you sure you want to remove this note?")
							}).then(() => webix.confirm({
								title: _("Warning!"),
								type: "confirm-warning",
								text: _("You are about to agree. Are you sure?")
							})).then(() => {
								activities.remove(id);
							});
							return false;
						},
						myicon: (e, id) => {
							this.editOrAddItem(id.row);
						}
					}
				},
				{
					view: "toolbar",
					cols: [
						{
							view: "button",
							type: "icon",
							icon: "wxi-plus-square",
							label: _("Add activity"),
							inputWidth: 200,
							align: "right",
							click: () => this.editOrAddItem()
						}
					]
				}
			]
		};
	}

	init() {
		this._jetPopupForm = this.ui(PopupFormView);
		this.table = this.$$("datatableAct");
		this.table.sync(activities);
	}

	editOrAddItem(id) {
		const idForName = this.getParam("id", true);
		if (idForName) {
			this._jetPopupForm.showPopupForm(id, idForName);
		}
	}

	urlChange() {
		webix.promise.all([
			contacts.waitData,
			activities.waitData,
			activitytypes.waitData
		]).then(() => {
			const id = this.getParam("id", true);
			if (id && contacts.exists(id)) {
				activities.data.filter(item => item.ContactID.toString() === id.toString());
			}
		});
	}
}
