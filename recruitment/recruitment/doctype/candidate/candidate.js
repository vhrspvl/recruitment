frappe.ui.form.on('Candidate', {

  refresh: function(frm) {
    if (!frm.doc.user) {
      frm.set_value('user', frappe.session.user);
    }
  },
  pending_for: function(frm) {

  },
  validate: function(frm) {
    frappe.call({
      method: "recruitment.recruitment.doctype.candidate.candidate.get_parent_territory",
      args: {
        "customer": frm.doc.customer,
      },
      callback: function(r) {
        if (!frm.doc.applied && !frm.doc.not_applicable && r.message != 'India') {
          frm.toggle_reqd(["passport_no", "issued_date", "expiry_date", "place_of_issue"],
            frm.doc.pending_for == 'Proposed PSL');
        }
      }
    })

    if (frm.doc.ecr == 1) {
      frm.doc.ecr_status = 'ECR';
    } else {
      frm.doc.ecr_status = 'ECNR';
    }



  },

  issued_date: function(frm) {
    var me = new Date(frm.doc.issued_date);
    var expiry_date = new Date(me.getFullYear() + 10, me.getMonth(), me.getDate() - 1)
    frm.set_value("expiry_date", expiry_date)
  },
  associate_name: function(frm) {
    if (!frm.doc.associate_name) {
      frm.set_value('contact_no', '');
    }
  },
  'onload_post_render': function(frm) {
    $(cur_frm.fields_dict.applied.input).addClass('chb');
    $(".chb").on('change', function() {
      $('.chb').not(this).prop('checked', false)
    });
    me = $(cur_frm.fields_dict.passport_no.input);
    me.attr("maxlength", "8");

  },
  onload: function(frm) {
    if (frm.doc.ecr_status) {
      if (frm.doc.ecr_status == 'ECR') {
        frm.doc.ecr = 1;
      } else {
        frm.doc.ecr = 0;
      }
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
  refresh: function(frm) {

    if (!frm.doc.applied && !frm.doc.not_applicable) {
      frm.toggle_reqd(["passport_no", "expiry_date", "place_of_issue"],
        frm.doc.pending_for == 'Proposed PSL');
    }
  },

});
