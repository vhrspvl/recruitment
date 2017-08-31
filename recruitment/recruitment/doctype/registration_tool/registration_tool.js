// Copyright (c) 2017, VHRS and contributors
// For license information, please see license.txt

frappe.ui.form.on('Registration Tool', {
  refresh: function(frm) {
    frm.disable_save();
  },
  'onload_post_render': function(frm) {
    me = $(cur_frm.fields_dict.term_1.input);
    $(cur_frm.fields_dict.have_pp.input).addClass('chb');
    $(cur_frm.fields_dict.not_applied_yet.input).addClass('chb');
    $(cur_frm.fields_dict.applied.input).addClass('chb');
    $(".chb").change(function() {
      $(".chb").prop('checked', false);
      $(this).prop('checked', true);
    });

    $(cur_frm.fields_dict.relative_yes.input).addClass('chb1');
    $(cur_frm.fields_dict.relative_no.input).addClass('chb1');
    $(".chb1").change(function() {
      $(".chb1").prop('checked', false);
      $(this).prop('checked', true);
    });

  },
  submit: function(frm) {
    frappe.call({
      method: "register",
      doc: frm.doc,
      callback: function(r) {
        var candidate = r.message;
        frappe.confirm(
          '<div class="panel panel-default">\
        <div class="panel-body">\
        <div class="row">\
        <div class="col-lg-2 text-danger">\
        <h5>Personal Details</h5></div>\
        </div>\
        <div class="row">\
        <div class="col-lg-3"><label>Name:</label>' + candidate.given_name + '</div>\
        <div class="col-lg-2"><label>Gender:</label>' + candidate.gender + '</div>\
        <div class="col-lg-3"><label>DOB:</label>' + candidate.date_of_birth + '</div>\
        <div class="col-lg-2"><label>Contact No.:</label>' + candidate.mobile + '</div>\
        </div>\
        </div>\
        </div>',
          function() {
            frappe.prompt({
                fieldtype: "Data",
                label: __("Registration"),
                fieldname: "testid",
              },
              function(data) {
                frappe.call({
                  method: "recruitment.api.confirm_register",
                  args: {
                    "testid": data.testid,
                    "doc": frm.doc
                  },
                  callback: function(r) {
                    if (r.message == 'invalid') {
                      frappe.msgprint({
                        message: __('Entered Token is Invalid'),
                        indicator: 'red',
                        title: __('Invalid Token')
                      })
                    } else {
                      var message = __('<div>Kindly Note down your Registration No.</div>\
                       <div><ul><li><h3>{0}<h3></li></ul></div></div>', [r.message])
                      frappe.confirm(
                        message,
                        function() {
                          location.reload();
                        })
                    }

                  }
                });
              }, __("Enter Registration ID"), __("Submit"));
          })
      }
    });
  }
})
