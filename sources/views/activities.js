import {JetView} from "webix-jet";
import PopupView from "./windows/popup";
import FormViewAdd from "./formAdd";
import FormViewEdit from "./formEdit";
import {activities} from "../models/activities";
import {contacts} from "../models/contacts";
import {activitytypes} from "../models/activitytypes";

export default class ActivitiesView extends JetView {
	config() {
		return {
			rows: [
				{
					template: "Activities",
					type: "header",
					css: "webix_dark",
					height: 40
				},
				{
					type: "wide",
					cols: [
						{
							rows: [
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
												if (!this.app.getService("state").getState()) {
													this._jetPopupAdd.showWindow();
												}
											}
										}
									]
								},
								{
									view: "datatable",
									id: "table",
									scroll: "y",
									editable: true,
									editaction: "dblclick",
									css: "webix_data_border webix_header_border",
									columns: [
										{
											id: "checked",
											header: ["", ""],
											template: "{common.checkbox()}",
											checkValue: "on",
											uncheckValue: "off",
											adjust: true
										},
										{
											id: "TypeID",
											header: ["Activity type", {
												content: "selectFilter",
												options: activitytypes.config.data.map(item => item.Value),
												compare: (value, filter) => {
													const valueVal = Number(value);
													let array = activitytypes.config.data
														.filter(item => item.id === valueVal);
													return array[0].Value === filter;
												}
											}
											],
											sort: "text",
											fillspace: true,
											template: (obj) => {
												let item = activitytypes.getItem(obj.TypeID);
												return item ? item.Value : "";
											}
										},
										{
											id: "DueDate",
											header: ["Due date", {content: "datepickerFilter"}],
											adjust: true,
											map: "(date)#DueDate#",
											sort: "date",
											format: webix.i18n.longDateFormatStr
										},
										{
											id: "Details",
											header: ["Details", {content: "textFilter"}],
											sort: "string",
											fillspace: true
										},
										{
											id: "ContactID",
											header: ["Contact", {
												content: "selectFilter",
												options: contacts.config.data.map(item => `${item.FirstName} ${item.LastName}`),
												compare: (value, filter) => {
													const valueVal = Number(value);
													let array = contacts.config.data.filter(item => item.id === valueVal);
													return `${array[0].FirstName} ${array[0].LastName}` === filter;
												}
											}
											],
											sort: "text",
											fillspace: true,
											template: (obj) => {
												let item = contacts.getItem(obj.ContactID);
												return item ? `${item.FirstName} ${item.LastName}` : "";
											}
										},
										{
											header: ["", ""],
											template: "<span class='myicon'></span>",
											adjust: true
										},
										{
											header: ["", ""],
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
												activities.waitData.then(() => {
													this._jetPopupEdit.showWindow(activities, id.row);
												});
											}
										}
									}
								}
							]
						}
					]
				}
			]
		};
	}

	init() {
		this.table = this.$$("table");
		this.table.sync(activities);
		this._jetPopupAdd = this.ui(new PopupView(this.app, "", "Add activity", FormViewAdd));
		this._jetPopupEdit = this.ui(new PopupView(this.app, "", "Edit activity", FormViewEdit));
	}
}
