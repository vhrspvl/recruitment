cur_frm.add_fetch("project", "cpc", "cpc");
cur_frm.add_fetch("customer", "customer_owner", "bde");

frappe.ui.form.on('Closure', {
    refresh: function(frm) {
    if(frm.perm[0].write) {
      if(frm.doc.status =="Pending for PSL") {
        frm.add_custom_button(__("Confirm CSL"), function() {
          frm.set_value("status", "Pending for D1");
          frm.save();
        });
      }
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

 	frm.set_query("candidate", function() {
	return {
		query: "recruitment.recruitment.doctype.candidate.candidate.get_candidates",
		filters:{
			task:frm.doc.task
		}
		};
});

 frm.set_query("dle", function() {
 return {
   query: "recruitment.recruitment.doctype.closure.closure.get_dle",
   filters:{
     candidate:frm.doc.candidate
   }
   }
});

  frm.set_query("tl", function() {
return {
 query: "recruitment.recruitment.doctype.closure.closure.get_tl",
 filters:{
   dle:frm.doc.dle
 }
 }
});
}

});
