import {JetView} from "webix-jet";
//import PopupView from "./windows/popup";
// import FormViewAdd from "./formAdd";
// import FormViewEdit from "./formEdit";
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
							id: "newTypeID",
							header: [{content: "selectFilter"}],
							sort: "text",
							fillspace: true
						},
						{
							id: "DueDate",
							header: [{content: "datepickerFilter"}],
							adjust: true,
							map: "(date)#DueDate#",
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
							if (!this.app.getService("state").getState()) {
								// activities.waitData.then(() => {
								// 	this._jetPopupEdit.showWindow(activities, id.row);
								// });
							}
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
							click: () => {
								// if (!this.app.getService("state").getState()) {
								// 	this._jetPopupAdd.showWindow();
								// }
							}
						}
					]
				}
			]
		};
	}

	init() {
		// this._jetPopupAdd = this.ui(new PopupView(this.app, "", "Add activity", FormViewAdd));
		// this._jetPopupEdit = this.ui(new PopupView(this.app, "", "Edit activity", FormViewEdit));
	}

	urlChange(view, url) {
		// this.$$("datatableAct").clearAll();
		// this.$$("datatableAct").refresh();
		webix.promise.all([
			activitytypes.waitData,
			activities.waitData
		])
			.then(() => {
				let id = url[0].params.id;
				let idVal = Number(id);
				if (id) {
					let array = webix.copy(activities.config.data.filter(item => item.ContactID === idVal));
					array.forEach((item) => {
						item.newTypeID = activitytypes.getItem(item.TypeID).Value;
					});
					this.$$("datatableAct").parse(array);
				}
			});
	}
}
