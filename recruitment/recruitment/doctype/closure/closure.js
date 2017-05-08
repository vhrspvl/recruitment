cur_frm.add_fetch("project", "cpc", "cpc");
cur_frm.add_fetch("customer", "customer_owner", "bde");

frappe.ui.form.on('Closure', {
    refresh: function(frm) {
    if(frm.perm[0].write) {
      if(frm.doc.status =="Pending for CSL") {
        frm.add_custom_button(__("Confirm CSL"), function() {
          frm.set_value("csl_status", "CSL Confirmed");
          frm.save();
        });
      }
      else {
      if(frm.doc.status !="Pending for PSL") {
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
/*
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
});*/
}

});
