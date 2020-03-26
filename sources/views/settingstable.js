import {JetView} from "webix-jet";
import PopupFormForSettingsView from "./popupFormForSettings";

export default class SettingsTableView extends JetView {
	constructor(app, name, data, header, label) {
		super(app, name);
		this._tdata = data;
		this.header = header;
		this.label = label;
	}

	config() {
		const _ = this.app.getService("locale")._;

		const label = {
			view: "label",
			label: _(this.label),
			css: "settings_header"
		};

		const table = {
			view: "datatable",
			localId: "datatable",
			autoconfig: true,
			css: "webix_data_border webix_header_border",
			columns: [
				{
					id: "Value",
					header: _(this.header),
					fillspace: true
				},
				{
					id: "Icon",
					header: _("Icon"),
					adjust: true,
					template: "<span class='webix_icon wxi-#Icon#'></span> #Icon#"
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
						text: _("Are you sure you want to remove this note?"),
						ok: _("Yes"),
						cancel: _("Cancel")
					}).then(() => {
						this._tdata.remove(id);
					});
					return false;
				},
				myicon: (e, id) => {
					this.editOrAddItem(id.row);
				}
			}
		};

		const button = {
			view: "button",
			label: _(this.label),
			type: "icon",
			icon: "wxi-plus-square",
			css: "webix_primary",
			autowidth: true,
			align: "center",
			click: () => {
				this.editOrAddItem();
			}
		};

		return {
			rows: [
				label,
				table,
				{
					cols: [
						{},
						button,
						{}
					]
				}
			]
		};
	}

	init() {
		this.$$("datatable").sync(this._tdata);
		this._jetPopupForm = this.ui(new PopupFormForSettingsView(this.app, "", this._tdata, this.header, this.icons));
	}

	editOrAddItem(id) {
		this._jetPopupForm.showPopupForm(id);
	}
}
