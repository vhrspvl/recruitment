// Copyright (c) 2017, VHRS and contributors
// For license information, please see license.txt

frappe.ui.form.on('Generate Sales Order', {
<<<<<<< HEAD
	refresh: function(frm) {

	}
=======

	sales_order_confirmed_date: function (frm) {
		frm.set_value("sales_order_list", "");
		if (frm.doc.sales_order_confirmed_date) {
			frappe.call({
				method: "recruitment.utils.generate_so",
				args: {
					"so_date": frm.doc.sales_order_confirmed_date,
				},
				callback: function (r) {
					if (r.message) {
						$.each(r.message, function (i, d) {
							var row = frappe.model.add_child(frm.doc, "Sales Order Component", "sales_order_list");
							row.closure = d.name;
							row.candidate_name = d.name1,
								row.candidate_sc = d.candidate_sc,
								row.client_sc = d.client_sc;
						});
					}
					refresh_field("sales_order_list");
					//frm.trigger("calculate_total_amount");
				}
			});
		}
	},


>>>>>>> 40b8de14c33439070e59bfdecaf221510502efaa
});
