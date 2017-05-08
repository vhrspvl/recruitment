// Copyright (c) 2017, VHRS and contributors
// For license information, please see license.txt

frappe.ui.form.on('Registration', {

'onload_post_render': function(frm) {
  me = $(cur_frm.fields_dict.term_1.input);
  $(cur_frm.fields_dict.have_pp.input).addClass('chb');
  $(cur_frm.fields_dict.not_applied_yet.input).addClass('chb');
  $(cur_frm.fields_dict.applied.input).addClass('chb');
  $(".chb").change(function() {
    $(".chb").prop('checked', false);
    $(this).prop('checked', true);
  });

},

onload: function(frm) {
  frm.set_query("district", function() {
    return {
      query: "recruitment.api.get_district",
      filters: {
        state: frm.doc.state
      }
    };
  });
},
refresh: function(frm) {
  if (!frm.doc.__unsaved && frm.doc.status != 'Registered') {
    var btn = frm.add_custom_button(__("Register"), function() {
      if (frm.doc.photo && frm.doc.resume) {
        frappe.prompt({
            fieldtype: "Data",
            label: __("Registration"),
            fieldname: "testid"
          },
          function(data) {
            frappe.call({
              method: "recruitment.api.confirm_register",
              args: {
                "name": frm.doc.name,
                "testid": data.testid
              },
              callback: function(r) {
                frm.doc.test_id = r.message
                if (r.message == 'invalid') {} else {
                  frm.doc.status = 'Registered';
                  //frm.doc.docstatus = 1;
                }
                frm.clear_custom_buttons()
                frm.refresh()
              }
            });
          }, __("Enter Registration ID"), __("Submit"));
      } else {
        msgprint("Upload Photo and Resume before Confirming!!!")
      }
    });
    btn.addClass('btn-primary');
  }

}

});


});
