import {JetView} from "webix-jet";
import PopupFormView from "./popupForm";
import {activities} from "../models/activities";
import {activitytypes} from "../models/activitytypes";

export default class DatatableActivitiesView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return {
			rows: [
				{
					view: "datatable",
					id: "datatableAct",
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
							options: activitytypes
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
							})
								.then(() => {
									webix.confirm({
										title: _("Warning!"),
										type: "confirm-warning",
										text: _("You are about to agree. Are you sure?")
									})
										.then(() => {
											activities.remove(id);
											this.table.remove(id);
										});
								});
							return false;
						},
						myicon: (e, id) => {
							this.editItem(id.row);
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
							click: () => this.addItem()
						}
					]
				}
			]
		};
	}

	filterActivities(id) {
		this.table = this.$$("datatableAct");
		this.table.clearAll();
		this.table.parse(
			activities.find(item => item.ContactID === id)
		);
	}

	init() {
		this._jetPopupForm = this.ui(PopupFormView);
		this.table = this.$$("datatableAct");

		activities.waitData.then(() => {
			const id = this.getParam("id", true);
			const idVal = Number(id);
			this.filterActivities(idVal);
		});

		this.on(this.app, "onClickSave", (values) => {
			if (values) {
				this.table.parse(values);
			}
			this.table.refresh();
		});
	}

	editItem(id) {
		if (id) {
			this._jetPopupForm.showPopupForm(id);
		}
	}

	addItem() {
		const idForName = this.getParam("id", true);
		this._jetPopupForm.showPopupForm("", idForName);
	}

	urlChange() {
		activities.waitData.then(() => {
			const id = this.getParam("id", true);
			const idVal = Number(id);
			this.filterActivities(idVal);
		});
	}
}
