frappe.ui.form.on("Task", {
  validate: function(frm) {
    var candidates = frm.doc.candidates
    sourced = 0
    shortlisted = 0
    interviewed = 0
    proposed_psl = 0

    for (var i in candidates) {
      if (candidates[i].pending_for === 'Sourced' || candidates[i].pending_for === 'Submitted') {
        sourced = sourced + 1;
      }
      if (candidates[i].pending_for === 'Shortlisted') {
        shortlisted = shortlisted + 1;
      }
      if (candidates[i].pending_for === 'Interviewed') {
        interviewed = interviewed + 1;
      }
      if (candidates[i].pending_for === 'Proposed PSL') {
        proposed_psl = proposed_psl + 1;
      }
    }
    frm.set_value("r7_count", sourced);
    frm.set_value("r4_count", shortlisted);
    frm.set_value("r6_count", interviewed);
    frm.set_value("r3_count", proposed_psl);

  }
})
