frappe.ui.form.on('Candidate', {
refresh: function(frm) {
  if(!frm.doc.user) {
    frm.set_value('user', frappe.session.user);
  }
  
},
associate_name:function(frm){
    if(!frm.doc.associate_name) {
      frm.set_value('contact_no', '');
    }
},
 onload:function(frm){
   frm.set_query("project", function() {
	 return {
		 query: "recruitment.recruitment.doctype.candidate.candidate.get_projects",
		 filters:{
       customer:frm.doc.customer
		 }
		 };
 });

	 frm.set_query("task", function() {
	 return {
		 query: "recruitment.recruitment.doctype.candidate.candidate.get_tasks",
		 filters:{
       project:frm.doc.project
		 }
		 };
 });


}

});

frappe.ui.form.on('Task Candidate', {
refresh: function(frm) {
  if(!frm.doc.user) {
    frm.set_value('user', frappe.session.user);
  }
},
});
