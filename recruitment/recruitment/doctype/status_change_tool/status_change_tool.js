// Copyright (c) 2016, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt
//frappe.provide("schools")
frappe.provide('closure')

frappe.ui.form.on('Status Change Tool', {
  refresh: function(frm) {
    frm.disable_save();
  },

  project: function(frm) {
    if (frm.doc.project) {
      var method = "recruitment.recruitment.doctype.status_change_tool.status_change_tool.get_closure_list";

      frappe.call({
        method: method,
        args: {
          project: frm.doc.project,
        },
        callback: function(r) {
          msgprint(r)
          frm.events.get_closures(frm, r.message);
        }
      })
    }
  },

  get_closures: function(frm, closures) {
    if (!frm.closure_area) {
      frm.closure_area = $('<div>')
        .appendTo(frm.fields_dict.closure_html.wrapper);
    }
    frm.closure_editor = new closure.ClosureEditor(frm, frm.closure_area, closures)
  }
});


closure.ClosureEditor = Class.extend({
  init: function(frm, wrapper, closures) {
    this.wrapper = wrapper;
    this.frm = frm;
    this.make(frm, closures);
  },
  make: function(frm, closures) {
    var me = this;

    $(this.wrapper).empty();
    var closure_toolbar = $('<p>\
			<button class="btn btn-default btn-add btn-xs" style="margin-right: 5px;"></button>\
			<button class="btn btn-xs btn-default btn-remove" style="margin-right: 5px;"></button>\
			<button class="btn btn-default btn-primary btn-mark-att btn-xs"></button></p>').appendTo($(this.wrapper));

    closure_toolbar.find(".btn-add")
      .html(__('Check all'))
      .on("click", function() {
        $(me.wrapper).find('input[type="checkbox"]').each(function(i, check) {
          if (!$(check).prop("disabled")) {
            check.checked = true;
          }
        });
      });

    closure_toolbar.find(".btn-remove")
      .html(__('Uncheck all'))
      .on("click", function() {
        $(me.wrapper).find('input[type="checkbox"]').each(function(i, check) {
          if (!$(check).prop("disabled")) {
            check.checked = false;
          }
        });
      });

    closure_toolbar.find(".btn-mark-status")
      .html(__('Confirm CSL'))
      .on("click", function() {
        $(me.wrapper.find(".btn-mark-status")).attr("disabled", true);
        var clos = [];
        $(me.wrapper.find('input[type="checkbox"]')).each(function(i, check) {
          var $check = $(check);
          clos.push({
            name: $check.data().name,
            idx: $check.data().idx,
            disabled: $check.prop("disabled"),
            checked: $check.is(":checked")
          });
        });

      });
  }
});
