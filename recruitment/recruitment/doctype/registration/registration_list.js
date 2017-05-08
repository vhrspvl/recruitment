frappe.listview_settings['Registration'] = {
	add_fields: ["name1", "status","mobile","photo"],
	get_indicator: function(doc) {
		var indicator = [__(doc.status), frappe.utils.guess_colour(doc.status), "status,=," + doc.status];
		indicator[1] = {"Registered":"green","Unregistered":"red"}[doc.status];
		return indicator;
	}
};
