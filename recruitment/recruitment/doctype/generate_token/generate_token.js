// Copyright (c) 2016, VHRS and contributors
// For license information, please see license.txt

frappe.ui.form.on('Generate Token', {
  'onload_post_render': function(frm) {
    $(cur_frm.fields_dict.generate.input).removeClass('btn btn-default btn-xs');
    $(cur_frm.fields_dict.generate.input).addClass('btn btn-default btn-lg');
    cur_frm.disable_save();
    cur_frm.toolbar.print_icon.addClass("hide");
  },
  generate: function(frm) {
    frappe.call({
      method: "recruitment.api.generate_token",
      args: {
        "token_type": frm.doc.token_type,
        "no_of_tokens": frm.doc.no_of_tokens
      },
      callback: function(r) {
        alert("Generated and Saved")
        frm.refresh()
      }
    });
  }
})
