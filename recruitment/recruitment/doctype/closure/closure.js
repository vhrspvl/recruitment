cur_frm.add_fetch("project", "cpc", "cpc");
cur_frm.add_fetch("customer", "customer_owner", "bde");

frappe.ui.form.on('Closure', {
  'onload_post_render': function(frm) {

  },
  validate: function(frm) {
    console.log(frm.doc.status)
  },
  candidate_boarded: function(frm) {
    frm.set_value("status", "Candidate Onboarded");
    frm.save();
  },

  refresh: function(frm) {
    /*  var wrapper = frm.get_field("offer_letter_html").$wrapper;
      var is_viewable = frappe.utils.is_image_file(frm.doc.offer_letter);

      frm.toggle_display("preview_html", is_viewable);

      if (is_viewable) {
        frm.toggle_display("offer_letter", !is_viewable);
        wrapper.html('<div class="img_preview"><a href="' + frm.doc.offer_letter + '" target="\
        _blank"><img class="img-responsive" src="' + frm.doc.offer_letter + '"></img></a></div>');
      } else {
        wrapper.empty();
      }*/


    if (frm.doc.ecr_status === 'ECNR') {
      frm.add_custom_button(__("ECNR")).addClass('btn btn-success');
    } else if (frm.doc.ecr_status === 'ECR') {
      frm.add_custom_button(__("ECR")).addClass('btn btn-danger');
    }
    if (frm.perm[0].write) {
      if (frm.doc.status == "Pending for CSL") {
        frm.add_custom_button(__("Confirm CSL"), function() {
          if (frm.doc.client_payment_applicable && frm.doc.client_sc <= 0) {
            msgprint("Please Enter Client Service Charge Value")
          } else if (frm.doc.candidate_payment_applicable && frm.doc.candidate_sc <= 0) {
            msgprint("Please Enter Candidate Service Charge Value")
          } else {
            frappe.confirm(
              'Did you verified the payment terms?',
              function() {
                frm.set_value("csl_status", "CSL Confirmed");
                frm.save();

              })
          }
        });
      } else {
        if (frm.doc.status != "Pending for PSL") {
          frm.add_custom_button(__("revert to PSL"), function() {
            frm.set_value("csl_status", "Pending for CSL");
            frm.save();
          });
        }
      }
    }

    client_pending = 0;
    client_pending = frm.doc.client_sc - frm.doc.client_advance;
    frm.set_value("client_pending", client_pending);

    candidate_pending = 0;
    candidate_pending = frm.doc.candidate_sc - frm.doc.candidate_advance;
    frm.set_value("candidate_pending", candidate_pending);
  },
  onload: function(frm) {
    frm.set_query("project", function() {
      return {
        query: "recruitment.recruitment.doctype.candidate.candidate.get_projects",
        filters: {
          customer: frm.doc.customer
        }
      };
    });

    frm.set_query("task", function() {
      return {
        query: "recruitment.recruitment.doctype.candidate.candidate.get_tasks",
        filters: {
          project: frm.doc.project
        }
      };
    });

    frm.set_query("candidate", function() {
      return {
        query: "recruitment.recruitment.doctype.candidate.candidate.get_candidates",
        filters: {
          task: frm.doc.task
        }
      };
    });

  }

});
