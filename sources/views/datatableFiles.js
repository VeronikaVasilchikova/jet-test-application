import {JetView} from "webix-jet";

export default class DatatableFilesView extends JetView {
	config() {
		return {
			rows: [
				{
					view: "datatable",
					id: "datatableFile",
					type: "uploader",
					scroll: "y",
					css: "webix_data_border webix_header_border",
					columns: [
						{
							id: "name",
							header: "Name",
							fillspace: true
						},
						{
							id: "changeDate",
							header: "Change Date",
							fillspace: true
						},
						{
							id: "sizetext",
							header: "Size",
							fillspace: true
						},
						{
							header: "",
							template: "{common.trashIcon()}",
							adjust: true
						}
					],
					// onClick: {
					// 	"wxi-trash": (e, id) => {
					// 		webix.confirm({
					// 			title: "Remove this note",
					// 			ok: "Yes",
					// 			cancel: "No",
					// 			text: "Are you sure you want to remove this note?"
					// 		})
					// 			.then(() => {
					// 				webix.confirm({
					// 					title: "Warning!",
					// 					type: "confirm-warning",
					// 					text: "You are about to agree. Are you sure?"
					// 				})
					// 					.then(() => {
					// 						activities.remove(id);
					// 					});
					// 			});
					// 		return false;
					// 	}
					// }
				},
				{
					view: "toolbar",
					cols: [
						{
							view: "uploader",
							link: "datatableFile",
							id: "files",
							name: "files",
							//upload: "php/upload.php",
							upload: "https://docs.webix.com/samples/server/upload",
							// accept: "text/plain, text/html, application/vnd.ms-excel",
							type: "icon",
							icon: "fas fa-cloud-upload-alt",
							label: "Upload file",
							inputWidth: 300,
							align: "center",
							on: {
								onBeforeFileAdd: (item) => {
									// let type = item.type.toLowerCase();
									// if (type !== "jpg" && type !== "png") {
									// 	webix.message("Only PNG or JPG images are supported");
									// 	return false;
									// }
									this.$$("datatableFile").changeDate = item.file.lastModifiedDate;
									console.log(item.file.lastModifiedDate);
								},
								onFileUpload: (item) => {
									// let id = item.context.rowid;
									// let row = $$("people").getItem(id);

									// row.photo = item.sname;
									// $$("people").updateItem(id, row);
									console.log(item);
								},
								onFileUploadError: () => {
									webix.alert("Error during file upload");
								}
							}
						}
					]
				}
			]
		};
	}
}
