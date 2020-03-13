import {JetView} from "webix-jet";

export default class PopupView extends JetView {
	constructor(app, name, head, body) {
		super(app, name);
		this._head = head;
		this._body = body;
	}

	config() {
		return {
			view: "window",
			position: "center",
			width: 450,
			move: true,
			head: this._head,
			body: this._body
		};
	}

	showWindow(obj = "", id = "") {
		this.getRoot().show();
		if (obj && id) {
			this.getRoot().getBody().setValues({
				id,
				Details: obj.getItem(id).Details,
				TypeID: obj.getItem(id).TypeID,
				ContactID: obj.getItem(id).ContactID,
				date: obj.getItem(id).DueDate,
				time: obj.getItem(id).DueDate.split(" ")[1]
			});
		}
		else {
			this.getRoot().getBody().clear();
		}
	}
}
