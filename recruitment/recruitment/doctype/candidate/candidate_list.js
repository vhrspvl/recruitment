frappe.listview_settings['Candidate'] = {
	add_fields: ["given_name", "position","candidate_image","pending_for"],
	get_indicator: function(doc) {
		var indicator = [__(doc.pending_for), frappe.utils.guess_colour(doc.pending_for), "pending_for,=," + doc.pending_for];
		indicator[1] = {"IDB":"blue","Sourced":"darkgrey","Submitted":"yellow","Shortlisted": "orange", "Interviewed": "blue","Proposed PSL":"green"}[doc.pending_for];
		return indicator;
	}
};
