// Copyright (c) 2016, VHRS and contributors
// For license information, please see license.txt

frappe.ui.form.on('Test Registration', {
		refresh: function(frm) {
		if (frm.doc.docstatus === 1) {
			frm.add_custom_button(__("Confirm"), function() {
						frappe.prompt({fieldtype:"Data", label: __("Registration"), fieldname:"testid"},
							function(data) {
								frappe.call({
									method:"recruitment.api.confirm_register",
									args: {
										"candidate_name":frm.doc.name,
										"testid": data.testid
									},
								callback: function(r) {
										frm.doc.test_id = r.message
										frm.doc.test_status = 'Registered'
										frm.clear_custom_buttons()
										frm.refresh()
									}
								});
							}, __("Enter Registration ID"), __("Submit"));
					 });
		}
}
});
