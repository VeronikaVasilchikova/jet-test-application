import {JetView} from "webix-jet";
import PopupFormView from "./popupForm";
import {activities} from "../models/activities";
import {activitytypes} from "../models/activitytypes";

export default class DatatableActivitiesView extends JetView {
	config() {
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
							id: "checked",
							header: "",
							template: "{common.checkbox()}",
							checkValue: "on",
							uncheckValue: "off",
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
							header: [{content: "datepickerFilter"}],
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
											activities.remove(id);
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
							label: "Add activity",
							inputWidth: 200,
							align: "right",
							click: () => this.addItem()
						}
					]
				}
			]
		};
	}

	init() {
		this._jetPopupForm = this.ui(PopupFormView);
		this.table = this.$$("datatableAct");
	}

	editItem(id) {
		if (id) {
			this._jetPopupForm.showPopupForm(id);
		}
	}

	addItem() {
		this._jetPopupForm.showPopupForm();
	}

	urlChange() {
		const id = this.getParam("id", true);
		this.table.sync(activities, () => {
			const idVal = Number(id);
			this.table.filter((item) => {
				return item.ContactID === idVal;
			});
		});
	}
}
