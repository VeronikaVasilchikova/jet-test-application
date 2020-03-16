import {JetView} from "webix-jet";
import FormView from "./form";

export default class PopupView extends JetView {
	config() {
		return {
			view: "window",
			position: "center",
			width: 450,
			move: true,
			body: FormView
		};
	}

	showWindow(obj = "", id = "", head) {
		this.getRoot().show();
		if (obj && id) {
			this.getRoot().getBody().setValues({
				id,
				Details: obj.getItem(id).Details,
				TypeID: obj.getItem(id).TypeID,
				ContactID: obj.getItem(id).ContactID,
				date: obj.getItem(id).DueDate,
				//time: obj.getItem(id).DueDate.split(" ")[1]
			});
		}
		else {
			this.getRoot().getBody().clear();
		}
	}
}
