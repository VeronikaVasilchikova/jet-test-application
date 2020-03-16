// export const activitytypes = new webix.DataCollection({
// 	url: "rest->http://localhost:8096/api/v1/activitytypes/",
// 	save: "rest->http://localhost:8096/api/v1/activitytypes/"
// });

export const activitytypes = new webix.DataCollection({
	data: [{"id":7,"Value":"Meeting","Icon":"flag"},{"id":9,"Value":"Chat","Icon":"comment"},{"id":13,"Value":"Lunch","Icon":"clock"},{"id":15,"Value":"Phone call","Icon":"phone"}],
	scheme: {
		$init: (obj) => {
			obj.value = obj.Value;
		}
	}
});
