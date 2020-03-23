import {JetView} from "webix-jet";
import {icons} from "../models/icons";

export default class PopupFormForSettingsView extends JetView {
	constructor(app, name, data, label) {
		super(app, name);
		this._tdata = data;
		this.label = label;
	}

	config() {
		const _ = this.app.getService("locale")._;

		return {
			view: "window",
			localId: "window",
			position: "center",
			width: 450,
			move: true,
			head: " ",
			body: {
				view: "form",
				localId: "form",
				elements: [
					{
						view: "text",
						label: _(this.label),
						labelWidth: 100,
						name: "Value"
					},
					{
						view: "richselect",
						label: "Icons",
						labelWidth: 100,
						name: "Icon",
						options: {
							view: "datasuggest",
							template: "<span class='webix_icon wxi-#Icon#'></span> #Icon#",
							data: icons,
							body: {
								template: "<span class='webix_icon wxi-#Icon#'></span> #Icon#",
								type: {
									width: 170,
									height: 40
								},
								data: icons
							}
						}
					},
					{cols: [
						{},
						{
							view: "button",
							value: _("Add"),
							localId: "btn",
							type: "form",
							width: 150,
							click: () => this.addOrEdit()
						},
						{
							view: "button",
							value: _("Cancel"),
							type: "form",
							width: 150,
							click: () => this.closeForm()
						}
					]},
					{}
				]
			}
		};
	}


	init() {
		this.form = this.$$("form");
	}

	showPopupForm(id) {
		const _ = this.app.getService("locale")._;

		if (id && this._tdata.exists(id)) {
			const item = this._tdata.getItem(id);
			const icon = icons.find(obj => obj.Icon === item.Icon, true);
			if (icon) {
				this.form.setValues({
					id: item.id,
					Icon: icon.id,
					Value: item.Value
				});
			}
			else {
				this.form.setValues({
					id: item.id,
					Icon: "",
					Value: item.Value
				});
			}
		}
		this.getRoot().show();
		const someAction = id ? _("Edit") : _("Add");
		this.getRoot().getHead().setHTML(someAction);
		this.$$("btn").setValue(someAction);
	}

	closeForm() {
		this.form.clear();
		this.getRoot().hide();
	}

	addOrEdit() {
		const values = this.form.getValues();
		values.Icon = icons.getItem(values.Icon).Icon;
		this._tdata.waitSave(() => {
			if (values && values.id) {
				this._tdata.updateItem(values.id, values);
			}
			else {
				this._tdata.add(values, 0);
			}
		});
		this.closeForm();
	}
}
