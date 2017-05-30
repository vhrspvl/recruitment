frappe.listview_settings['Closure'] = {
  add_fields: ["photo"],
  onload: function(me) {
    frappe.route_options = {
      "status": ["Pending for PSL", "Pending for Candidate Onboarding"]
    };
  }
}
