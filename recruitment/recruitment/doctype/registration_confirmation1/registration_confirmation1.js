// Copyright (c) 2017, VHRS and contributors
// For license information, please see license.txt

frappe.ui.form.on('Registration Confirmation1', {
  refresh: function(frm) {
    if (frappe.route_options) {
      frm.set_value("candidate_id", frappe.route_options.candidate_id);
      frm.students_area = $('<div>Hello World {{ frappe.route_options.candidate_id }} </div>')
        .appendTo(frm.fields_dict.show_candidate_details.wrapper);
    }
    frm.disable_save();
    frm.page.clear_indicator();
  },
});
