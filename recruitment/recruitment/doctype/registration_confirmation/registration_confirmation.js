// Copyright (c) 2017, VHRS and contributors
// For license information, please see license.txt

frappe.ui.form.on('Registration Confirmation', {
  refresh: function(frm) {
    if (frappe.route_options) {
      var candid = frappe.route_options;
      frm.set_value("candidate_id",candid.candidate_id)
      frm.students_area = $('<div class="panel panel-default"><div class="panel-body"><div class="row">  <div class="col-lg-2 text-danger"><h5>Personal Details</h5></div></div><div class="row"><div class="col-lg-3"><label>Name:</label>'+ candid.given_name +'</div><div class="col-lg-2"><label>Gender:</label>'+ candid.gender +'</div><div class="col-lg-3"><label>DOB:</label>'+candid.date_of_birth +'</div><div class="col-lg-2"><label>Contact No.:</label>'+ candid.mobile +'</div></div></div></div>')
        .appendTo(frm.fields_dict.show_candidate_details.wrapper);
    }
    frm.disable_save();
    frm.page.clear_indicator();
    frm.page.set_primary_action(__("Confirm Registration"), function() {
      	frappe.prompt({fieldtype:"Data", label: __("Registration"), fieldname:"testid"},
          function(data) {
            frappe.call({
              method:"recruitment.api.confirm_register",
              args: {
                "name":candid.candidate_id,
                "testid": data.testid
              },
            callback: function(r) {
              	frappe.msgprint({
                  title:'Registered',
                  indicator:'Green',
                  message:'Registration Completed'
                })
              }
            });
          }, __("Enter Registration ID"), __("Submit"));
		});
  },
})
