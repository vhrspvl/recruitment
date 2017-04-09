// Copyright (c) 2016, VHRS and contributors
// For license information, please see license.txt

frappe.ui.form.on('Generate Token', {
generate:function(frm){
				frappe.call({
					method:"recruitment.api.generate_token",
					args: {
						"token_type":frm.doc.token_type,
						"no_of_tokens": frm.doc.no_of_tokens
					},
				callback: function(r) {
						alert("Generated and Saved")
						frm.refresh()
					}
				});

	}
});
