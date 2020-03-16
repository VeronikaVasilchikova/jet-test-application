import {JetView} from "webix-jet";
import PopupView from "./windows/popup";
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
												this._jetPopup.showWindowAdd();
											}
										}
									]
								},
								{
									view: "datatable",
									localId: "table",
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
											header: ["Activity type", {content: "selectFilter"}],
											sort: "text",
											fillspace: true,
											options: activitytypes
										},
										{
											id: "DueDate",
											header: ["Due date", {content: "datepickerFilter"}],
											adjust: true,
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
											header: ["Contact", {content: "selectFilter"}],
											sort: "text",
											fillspace: true,
											options: contacts
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
											this._jetPopup.showWindowEdit(activities, id.row);
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
		this._jetPopup = this.ui(PopupView);
	}
}
