frappe.ui.form.on('Candidate', {
  refresh: function(frm) {
    if (!frm.doc.user) {
      frm.set_value('user', frappe.session.user);
    }
  },
  validate: function(frm) {
    if (!frm.doc.applied && !frm.doc.not_applicable) {
      frm.toggle_reqd(["passport_no", "expiry_date", "place_of_issue"],
        frm.doc.pending_for == 'Proposed PSL');
    }

  },
  associate_name: function(frm) {
    if (!frm.doc.associate_name) {
      frm.set_value('contact_no', '');
    }
  },
  'onload_post_render': function(frm) {
    $(cur_frm.fields_dict.not_applicable.input).addClass('chb');
    $(cur_frm.fields_dict.applied.input).addClass('chb');
    $(".chb").on('change', function() {
      $('.chb').not(this).prop('checked', false)
    });
    me = $(cur_frm.fields_dict.passport_no.input);
    me.attr("maxlength", "8");

  },
  onload: function(frm) {
    if (frm.doc.ecr_status && frm.doc.ecr_status == 'ECR') {
      frm.doc.ecr = 1;
      frm.doc.ecr_status = 'ECR';
    } else {
      frm.doc.ecr = 0;
      frm.doc.ecr_status = 'ECNR';
    }
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


  }

});


frappe.ui.form.on('Task Candidate', {
  user: function(frm) {
    if (!frm.doc.user) {
      frm.set_value('user', frappe.session.user);
    }
  },
});
