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
						labelWidth: 150,
						name: "Value",
						required: true,
						invalidMessage: _("The field must be filled")
					},
					{
						view: "richselect",
						label: "Icons",
						labelWidth: 150,
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
						},
						required: true,
						invalidMessage: _("Icon must be selected")
					},
					{cols: [
						{
							view: "button",
							value: _("Add"),
							localId: "btn",
							type: "form",
							height: 50,
							click: () => this.addOrEdit()
						},
						{
							view: "button",
							value: _("Cancel"),
							type: "form",
							height: 50,
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
		this.getRoot().getHead().setHTML(`${someAction} ${_(this.label).toLowerCase()}`);
		this.$$("btn").setValue(`${someAction} ${_(this.label).toLowerCase()}`);
	}

	closeForm() {
		this.form.clear();
		this.getRoot().hide();
	}

	addOrEdit() {
		if (this.form.validate()) {
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
}
