// Copyright (c) 2017, VHRS and contributors
// For license information, please see license.txt

frappe.ui.form.on('Registration Tool', {
  refresh: function(frm) {
    frm.disable_save();
  },
  onload_post_render: function(frm) {
//    $(cur_frm.fields_dict.term5.input).addClass('test');

  },
  submit: function(frm) {
    frappe.confirm(
      'Sure to Submit',
      function() {
        frappe.call({
          method: "register",
          doc: frm.doc,
          callback: function(r) {
            if (r) {
              var candidate = r.message;
              frappe.route_options = {
                "candidate_id": candidate.name,
                "given_name": candidate.given_name,
                "gender":candidate.gender,
                "date_of_birth":candidate.date_of_birth,
                "father_name":candidate.father_name,
              }
              frappe.set_route("Form", "Registration Confirmation");
            } else {
              msgprint(__("Save the document first."));
            }
          }
        });
      })
  }
})
