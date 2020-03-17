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
			head: "Add new activity",
			body: FormView
		};
	}

	showWindow(obj = "", id = "") {
		this.getRoot().show();
		if (obj && id) {
			this.getRoot().getHead().setHTML("Edit activity");
			this._FormView.edit();
			this.getRoot().getBody().setValues({
				id,
				Details: obj.getItem(id).Details,
				TypeID: obj.getItem(id).TypeID,
				ContactID: obj.getItem(id).ContactID,
				DueDate: obj.getItem(id).DueDate,
				DueTime: obj.getItem(id).DueTime
			});
		}
		else {
			this.getRoot().getBody().clear();
			this.getRoot().getHead().setHTML("Add new activity");
			this._FormView.add();
		}
	}

	init() {
		this._FormView = this.ui(FormView);
	}
}
