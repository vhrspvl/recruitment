// Copyright (c) 2020, VHRS and contributors
// For license information, please see license.txt

frappe.ui.form.on('Candidate', {
    
    refresh: function (frm) {
        if (!frm.doc.user) {

            frm.set_value('user', frappe.session.user);
        }
    },

    ecr_status: function (frm) {
        frappe.confirm(
            'Are you confirm with the selection? -> ' + frm.doc.ecr_status,
            function () {

            }
        );
    },
    pending_for: function (frm) {
        frm.toggle_reqd(["customer", "project", "task"],
            frm.doc.pending_for == 'Proposed PSL')
    },
    validate: function (frm) {

        if (frm.doc.candidate_payment_applicable) {
            if (frm.doc.candidate_payment_applicable && frm.doc.candidate_sc <= 0) {
                msgprint("Please Enter Candidate Service Charge Value");
                return False;
            }
        }
        if (frm.doc.pending_for == 'Proposed PSL' && frm.doc.customer && frm.doc.project && frm.doc.task) {
            frappe.call({
                method: "recruitment.recruitment.doctype.candidate.candidate.get_parent_territory",
                args: {
                    "customer": frm.doc.customer,
                },
                callback: function (r) {
                    if (!frm.doc.applied && !frm.doc.not_applicable && r.message != 'India') {
                        frm.toggle_reqd(["ecr_status", "passport_no", "issued_date", "expiry_date", "place_of_issue", "interview_date", "interview_location"],
                            frm.doc.pending_for == 'Proposed PSL');
                    }
                }
            })
        }
    },


    issued_date: function (frm) {
        var me = new Date(frm.doc.issued_date);
        var expiry_date = new Date(me.getFullYear() + 10, me.getMonth(), me.getDate() - 1)
        frm.set_value("expiry_date", expiry_date)
    },
    associate_name: function (frm) {
        if (!frm.doc.associate_name) {
            frm.set_value('contact_no', '');
            frm.set_value('associate', '');
        }
    },
    'onload_post_render': function (frm) {
        $(cur_frm.fields_dict.applied.input).addClass('chb');
        $(".chb").on('change', function () {
            $('.chb').not(this).prop('checked', false)
        });
        me = $(cur_frm.fields_dict.passport_no.input);
        me.attr("maxlength", "8");

    },
    onload: function (frm) {
        if (frm.doc.ecr_status) {
            if (frm.doc.ecr_status == 'ECR') {
                frm.doc.ecr = 1;
            } else {
                frm.doc.ecr = 0;
            }
        }
    
    frm.set_query("task", function () {
        return {
            query: "recruitment.recruitment.doctype.candidate.candidate.get_tasks",
            filters: {
                project: frm.doc.project
            }
        };
    });
    }
});
