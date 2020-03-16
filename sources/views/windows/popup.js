import {JetView} from "webix-jet";
import FormView from "../form";

export default class PopupView extends JetView {
	config() {
		return {
			view: "window",
			localId: "window",
			position: "center",
			width: 450,
			move: true,
			// head: {
			// 	rows: [
			// 		{
			// 			template: "<h3 class='head_popup'>Edit activity</h3>",
			// 			localId: "headEdit",
			// 			hidden: true
			// 		},
			// 		{
			// 			template: "<h3 class='head_popup'>Add activity</h3>",
			// 			localId: "headAdd",
			// 			hidden: true
			// 		}
			// 	]
			// },
			body: FormView
		};
	}

	// init() {
	// 	this._FormView = this.ui(FormView);
	// }

	showWindowEdit(obj = "", id = "") {
		this.getRoot().show();
		//this.$$("headAdd").hide();
		//this.$$("headEdit").show();
		// console.log(this._FormView);
		//this._FormView.edit();
		this.getRoot().getBody().setValues({
			id,
			Details: obj.getItem(id).Details,
			TypeID: obj.getItem(id).TypeID,
			ContactID: obj.getItem(id).ContactID,
			date: obj.getItem(id).DueDate,
			//time: obj.getItem(id).DueDate.split(" ")[1]
		});
	}

	showWindowAdd() {
		this.getRoot().show();
		//this._FormView.add();
		//this.$$("headEdit").hide();
		//this.$$("headAdd").show();
		this.getRoot().getBody().clear();
	}
}
