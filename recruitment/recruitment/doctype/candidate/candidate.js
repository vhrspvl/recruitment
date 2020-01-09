frappe.ui.form.on('Candidate', {
    capture: function (frm) {
        // capture: (context) => {
        // var ui = $.summernote.ui;
        const capture = new frappe.ui.Capture();
        capture.open();

        capture.click((data) => {
            frm.set_value("photo", data)
            // context.invoke('editor.insertImage', data);
        });
        // },
    },
    refresh: function (frm) {
        if (!frm.doc.user) {

            // business_unit = frappe.db.get_value('Employee', user, 'business_unit')
            // console.log(business_unit)
            // frm.set_value("business_unit", business_unit);
            frm.set_value('user', frappe.session.user);
        }
        // if (frm.doc.qr_code) {
        //     frm.add_custom_button(__("Print ODR"), function () {
        //         frappe.ui.form.qz_connect({ "host": "192.168.2.47" })
        //             .then(function () {
        //                 var options = {
        //                     colorType: 'blackwhite',
        //                     units: 'mm',
        //                     // orientation:'landscape',
        //                     size: { width: 62, height: 90 }

        //                 }
        //                 var config = qz.configs.create("QL-800", options);
        //                 var data = [{
        //                     type: 'html',
        //                     format: 'plain',
        //                     data: `<html>
        //                                 <head>
        //                                     <style>
        //                                         p {
        //                                             font-size: 12;
        //                                         }

        //                                         table,
        //                                         th,
        //                                         td {
        //                                             border: 1px solid black;
        //                                             border-collapse: collapse;
        //                                         }
        //                                     </style>
        //                                 </head>

        //                                 <body>
        //                                     <table>
        //                                         <tbody>
        //                                             <tr>
        //                                                 <td>
        //                                                     <img src="http://erp.voltechgroup.com${frm.doc.qr_code}" width='100' />
        //                                                 </td>
        //                                                 <td>
        //                                                     <p>
        //                                                         &nbsp;Voltech HR Services<br />
        //                                                         &nbsp;+91 95000 06906 / +91 4397 8090<br />
        //                                                         &nbsp;http://hr.voltechgroup.com<br />
        //                                                         Project: <b>${frm.doc.project}</b><br />
        //                                                         &nbsp;Candidate: <b>${frm.doc.given_name}</b> / PP No.:<b>${frm.doc.passport_no}</b><br />
        //                                                         &nbsp;TCR No: <b>${frm.doc.name}</b> / Doc.Type:<b>Passport</b>
        //                                                         </p>
        //                                                 </td>
        //                                             </tr>
        //                                             <tr>
        //                                                 <td>
        //                                                     <img src="http://erp.voltechgroup.com${frm.doc.qr_code}" width='100' />
        //                                                 </td>
        //                                                 <td>
        //                                                     <p>
        //                                                         &nbsp;Voltech HR Services<br />
        //                                                         &nbsp;+91 95000 06906 / +91 4397 8090<br />
        //                                                         &nbsp;http://hr.voltechgroup.com<br />
        //                                                         Project: <b>${frm.doc.project}</b><br />
        //                                                         &nbsp;Candidate: <b>${frm.doc.given_name}</b> / PP No.:<b>${frm.doc.passport_no}</b><br />
        //                                                         &nbsp;TCR No: <b>${frm.doc.name}</b> / Doc.Type:<b>Passport</b>
        //                                                         </p>
        //                                                 </td>
        //                                             </tr>
        //                                         </tbody>
        //                                     </table>

        //                                 </body>

        //                                 </html>`
        //                 }]
        //                 return qz.print(config, data);
        //             })
        //             .then(frappe.ui.form.qz_success)
        //             .catch(err => {
        //                 frappe.ui.form.qz_fail(err);
        //             })
        //     });

        // }
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
    after_save: function (frm) {
        if (frm.doc.pending_for == 'Proposed PSL') {
            frappe.call('vhrs.custom.generate_qr', {
                candidate: frm.doc.name
            }).then(r => {
                console.log(r.message)
                frm.reload_doc();
            })

        }
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
        // if (frm.doc.passport_no) {
        //     if (frappe.db.exists('candidate', { 'passport_no': frm.doc.passport_no })) {
        //         frappe.throw('Passport Number is not Unique')
        //     }
        // }
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
        // frm.set_query("project", function () {
        //     return {
        //         query: "recruitment.recruitment.doctype.candidate.candidate.get_projects",
        //         filters: {
        //             customer: frm.doc.customer
        //         }
        //     };
        // });

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


frappe.ui.form.on('Task Candidate', {
    refresh: function (frm) {

        if (!frm.doc.applied && !frm.doc.not_applicable) {
            frm.toggle_reqd(["passport_no", "expiry_date", "place_of_issue"],
                frm.doc.pending_for == 'Proposed PSL');
        }
    },

});