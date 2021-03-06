import {JetView} from "webix-jet";
import {fileStorage} from "../models/filestorage";
import {contacts} from "../models/contacts";

export default class DatatableFilesView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return {
			rows: [
				{
					view: "datatable",
					localId: "datatableFile",
					type: "uploader",
					scroll: "y",
					css: "webix_data_border webix_header_border",
					columns: [
						{
							id: "name",
							header: _("Name"),
							fillspace: true,
							sort: "text"
						},
						{
							id: "changeDate",
							header: _("Change Date"),
							fillspace: true,
							sort: "date",
							format: webix.i18n.longDateFormatStr
						},
						{
							id: "sizetext",
							header: _("Size"),
							fillspace: true,
							sort: (a, b) => parseInt(a.sizetext) - parseInt(b.sizetext)
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
								title: _("Remove this note"),
								ok: _("Yes"),
								cancel: _("No"),
								text: _("Are you sure you want to remove this note?")
							}).then(() => webix.confirm({
								title: _("Warning!"),
								type: "confirm-warning",
								text: _("You are about to agree. Are you sure?")
							})).then(() => {
								fileStorage.remove(id);
							});
							return false;
						}
					}
				},
				{
					view: "uploader",
					localId: "uploader",
					autosend: false,
					upload: "",
					type: "icon",
					icon: "fas fa-cloud-upload-alt",
					label: _("Upload file"),
					inputWidth: 300,
					align: "center",
					on: {
						onBeforeFileAdd: (obj) => {
							const id = this.getParam("id", true);
							const strToDate = webix.Date.strToDate("%Y-%m-%d");
							if (id && contacts.exists(id)) {
								const sendFile = {
									ContactID: this.getParam("id", true),
									name: obj.name,
									changeDate: strToDate(obj.file.lastModifiedDate),
									sizetext: obj.sizetext
								};
								fileStorage.add(sendFile);
							}
						},
						onFileUploadError: () => {
							webix.alert(_("Error during file upload"));
						}
					}
				}
			]
		};
	}

	init() {
		this.$$("datatableFile").sync(fileStorage);
	}

	urlChange() {
		const id = this.getParam("id", true);
		this.$$("datatableFile").sync(fileStorage, () => {
			this.$$("datatableFile").filter(item => item.ContactID.toString() === id.toString());
		});
	}
}
