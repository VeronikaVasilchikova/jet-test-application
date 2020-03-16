// export const statuses = new webix.DataCollection({
// 	url: "http://localhost:8096/api/v1/statuses/",
// 	save: "http://localhost:8096/api/v1/statuses/"
// });

export const statuses = new webix.DataCollection({
	data: [{"id":1,"Value":"In Progress","Icon":"cogs"},{"id":2,"Value":"Active","Icon":"user"},{"id":3,"Value":"Waiting","Icon":"pencil"},{"id":4,"Value":"Closed","Icon":"plus"}]
});
