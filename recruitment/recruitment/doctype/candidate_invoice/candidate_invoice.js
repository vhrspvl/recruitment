// Copyright (c) 2016, VHRS and contributors
// For license information, please see license.txt

frappe.ui.form.on('Candidate Invoice', {

	project: function() {
		frappe.call({
			method:"recruitment.api.fetch_candidate",
			args: {
				project:cur_frm.doc.project,
				payment_type:"candidate",
			},
		callback: function(r) {
			$.each(r.message, function(i, d) {
					var row = frappe.model.add_child(cur_frm.doc, "Task Candidate", "candidates");
					row.given_name = d.name1;
					row.mobile = d.contact_no;
					 })
					refresh_field("candidates");
			}
		});
	},

});
