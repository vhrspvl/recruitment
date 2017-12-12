cur_frm.add_fetch("project", "cpc", "cpc");
cur_frm.add_fetch("customer", "customer_owner", "bde");

frappe.ui.form.on('Closure', {
  'onload_post_render': function (frm) {

  },

  candidate_boarded: function (frm) {
    frm.set_value("status", "Onboarded");
    frm.save();

  },

  generate_sales_order: function (frm) {
    if (frm.doc.sales_order_confirmed_date) {
      frappe.call({
        method: "vhrs.custom.create_sales_order",
        args: {
          "closure": frm.doc.name,
        },
        callback: function (r) {

        }
      })
    }
  },

  refresh: function (frm) {
    frm.toggle_display("poe", frm.doc.ecr_status === 'ECR');
    if (frm.doc.status == 'Onboarded' && frm.doc.territory != 'India') {
      frm.add_custom_button(__("Revert to Pending"), function () {
        frm.set_value("status", "Onboarding");
        frm.save();
      });
    }
    if (frm.doc.ecr_status === 'ECNR') {
      frm.add_custom_button(__("ECNR")).addClass('btn btn-success');
    } else if (frm.doc.ecr_status === 'ECR') {
      frm.add_custom_button(__("ECR")).addClass('btn btn-danger');
    }
    if (frm.perm[0].write) {
      if (frm.doc.status == "Sales Order") {
        if (!frm.doc.sales_order_confirmed_date && frappe.user.has_role("Project Leader")) {
          frm.add_custom_button(__("Confirm Sales Order"), function () {
            if (frm.doc.client_payment_applicable || frm.doc.candidate_payment_applicable) {
              if (frm.doc.client_payment_applicable && frm.doc.client_sc <= 0) {
                msgprint("Please Enter Client Service Charge Value")
              } else if (frm.doc.candidate_payment_applicable && frm.doc.candidate_sc <= 0) {
                msgprint("Please Enter Candidate Service Charge Value")
              } else {
                frappe.confirm(
                  'Did you verified the payment terms?',
                  function () {
                    frm.set_value("csl_status", "Sales Order Confirmed");
                    frm.set_value("sales_order_confirmed_date", frappe.datetime.get_today())
                    frm.save();
                  })
              }
            } else {
              msgprint("Please Select Applicable Service Charge Details !")
            }
          });
        }
      }
      if (frm.doc.csl_status == 'Sales Order Confirmed' && frm.doc.candidate_status == 'Selected') {
        me = frm.add_custom_button(__("Confirm Sales Invoice"), function () {
          frappe.confirm(
            'Confirm Sales Invoice?',
            function () {
              frm.set_value("csl_status", "Sales Invoice Confirmed");
              frm.set_value("sales_invoice_confirmed_date", frappe.datetime.get_today())
              frm.save();
            })
        });
        me.addClass('btn btn-primary');

      }
    }

    client_pending = 0;
    client_pending = frm.doc.client_sc - frm.doc.client_advance;
    frm.set_value("client_pending", client_pending);

    candidate_pending = 0;
    candidate_pending = frm.doc.candidate_sc - frm.doc.candidate_advance;
    frm.set_value("candidate_pending", candidate_pending);
  },
  onload: function (frm) {
    frm.set_query("project", function () {
      return {
        query: "recruitment.recruitment.doctype.candidate.candidate.get_projects",
        filters: {
          customer: frm.doc.customer
        }
      };
    });

    frm.set_query("task", function () {
      return {
        query: "recruitment.recruitment.doctype.candidate.candidate.get_tasks",
        filters: {
          project: frm.doc.project
        }
      };
    });

    frm.set_query("candidate", function () {
      return {
        query: "recruitment.recruitment.doctype.candidate.candidate.get_candidates",
        filters: {
          task: frm.doc.task
        }
      };
    });

  }

});