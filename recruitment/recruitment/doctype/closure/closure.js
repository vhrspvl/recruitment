cur_frm.add_fetch("project", "cpc", "cpc");
cur_frm.add_fetch("customer", "customer_owner", "bde");

frappe.ui.form.on('Closure', {
    onload: function (frm) {
        var t = ['Oman', 'Dubai', 'Bahrain']
        if (t.includes(frm.doc.territory)) {
            hide_field("section_break_60")
        }
        $(cur_frm.fields_dict.passport_no.input).attr("maxlength", "8");

    },
    validate: function (frm) {
        if (frm.doc.dnd_incharge) {
            frappe.call({
                "method": "recruitment.recruitment.doctype.closure.closure.update_dnd_incharge",
                args: {
                    "project": frm.doc.project,
                    "dnd": frm.doc.dnd_incharge
                },
                callback: function (r) {
                    if (r.message) {
                        frm.set_df_property('dnd_incharge', 'read_only', 1);
                    }
                }
            })
        }
    },
    document_type: function (frm) {
        frm.toggle_reqd("degree_certificate_no", frm.doc.document_type == "Degree Certificate");
        frm.toggle_reqd("custodian_type", frm.doc.document_type);
        frm.toggle_reqd("custodian", frm.doc.document_type);
    },

    candidate_boarded: function (frm) {
        if (frm.doc.candidate_pending > 0) {
            frappe.msgprint("Pending Payment is greater than 0, So you cannot Onboard the Candidate")
        } else {
            frm.set_value("status", "Onboarded");
            frm.save();
        }


    },
    date_of_issue: function (frm) {
        var me = new Date(frm.doc.date_of_issue);
        var expiry_date = new Date(me.getFullYear() + 10, me.getMonth(), me.getDate() - 1)
        frm.set_value("expiry_date", expiry_date)
    },
    refresh: function (frm) {
        if (frm.doc.dnd_incharge) {
            frm.set_df_property('dnd_incharge', 'read_only', 1);
        }
        frm.toggle_display("poe", frm.doc.ecr_status === 'ECR');
        if (frm.doc.status == 'Onboarded' && frm.doc.territory != 'India') {
            frm.add_custom_button(__("Revert to Pending"), function () {
                frm.set_value("status", "Onboarding");
                frm.save();
            });
        }
        if (frm.doc.ecr_status === 'ECNR') {
            frm.add_custom_button(__("ECNR")).addClass('btn btn-success');
        } else if (frm.doc.ecr_status === 'ECR') {
            frm.add_custom_button(__("ECR")).addClass('btn btn-danger');
        }
        if (frm.perm[0].write) {
            if (frm.doc.status == "Sales Order") {
                if (!frm.doc.sales_order_confirmed_date && frappe.user.has_role("Project Leader")) {
                    frm.add_custom_button(__("Confirm Sales Order"), function () {
                        if (frm.doc.client_payment_applicable || frm.doc.candidate_payment_applicable) {
                            if (frm.doc.client_payment_applicable && frm.doc.client_sc <= 0) {
                                msgprint("Please Enter Client Service Charge Value")
                            } else if (frm.doc.candidate_payment_applicable && frm.doc.candidate_sc <= 0) {
                                msgprint("Please Enter Candidate Service Charge Value")
                            } else {
                                frappe.confirm(
                                    'Did you verified the payment terms?',
                                    function () {
                                        frappe.call({
                                            method: "vhrs.custom.create_sales_order",
                                            args: {
                                                "name": frm.doc.name,
                                                "customer": frm.doc.customer,
                                                "project": frm.doc.project,
                                                "name1": frm.doc.name1,
                                                "passport_no": frm.doc.passport_no || " ",
                                                "client_sc": frm.doc.client_sc,
                                                "designation": frm.doc.designation,
                                                "candidate_sc": frm.doc.candidate_sc,
                                                "source_executive": frm.doc.source_executive || " ",
                                                "ca_executive": frm.doc.ca_executive || " ",
                                                "is_candidate": frm.doc.candidate_payment_applicable,
                                                "is_client": frm.doc.client_payment_applicable,
                                            },
                                            callback: function (r) {
                                                frm.set_value("csl_status", "Sales Order Confirmed");
                                                frm.set_value("sales_order_confirmed_date", frappe.datetime.get_today())
                                                frm.save();
                                            }
                                        })

                                    })
                            }
                        } else {
                            msgprint("Please Select Applicable Service Charge Details !")
                        }
                    });
                }
            }

            if (frm.doc.status == "Onboarded") {
                if (!frm.doc.resales_order_confirmed_date && frappe.user.has_role("Project Leader")) {
                    frm.add_custom_button(__("Redepute"), function () {
                        frappe.confirm(
                            'Are you confirm with the selection?',
                            function () {
                                if (frm.doc.client_payment_applicable || frm.doc.candidate_payment_applicable) {
                                    if (frm.doc.redeputation_cost <= 0) {
                                        msgprint("Please Enter Redeputation Cost")
                                    } else {
                                        frappe.confirm(
                                            'Did you verified the payment terms?',
                                            function () {
                                                frappe.call({
                                                    method: "vhrs.custom.recreate_sales_order",
                                                    args: {
                                                        "name": frm.doc.name,
                                                        "customer": frm.doc.customer,
                                                        "project": frm.doc.project,
                                                        "name1": frm.doc.name1,
                                                        "designation": frm.doc.designation,
                                                        "passport_no": frm.doc.passport_no || " ",
                                                        "redeputation_cost": frm.doc.redeputation_cost,
                                                    },
                                                    callback: function (r) {
                                                        frm.set_value("resales_order_confirmed_date", frappe.datetime.get_today())
                                                        frm.save();
                                                    }
                                                })

                                            })
                                    }
                                } else {
                                    msgprint("Please Select Applicable Service Charge Details !")
                                }
                            });
                    });


                }
            }

            // if (frm.doc.csl_status == 'Sales Order Confirmed' && frm.doc.candidate_status == 'Selected') {
            //     me = frm.add_custom_button(__("Confirm Sales Invoice"), function () {
            //         frappe.confirm(
            //             'Confirm Sales Invoice?',
            //             function () {
            //                 frm.set_value("csl_status", "Sales Invoice Confirmed");
            //                 frm.set_value("sales_invoice_confirmed_date", frappe.datetime.get_today())
            //                 frm.save();
            //             })
            //     });
            //     me.addClass('btn btn-primary');

            // }


            // client_pending = 0;
            // client_pending = frm.doc.client_sc - frm.doc.client_advance;
            // frm.set_value("client_pending", client_pending);

            // candidate_pending = 0;
            // candidate_pending = frm.doc.candidate_sc - frm.doc.candidate_advance;
            // frm.set_value("candidate_pending", candidate_pending);
        }
    },
    associate_name: function (frm) {
        if (!frm.doc.associate_name) {
            frm.set_value('associate_contact_no', '');
            frm.set_value('associate', '');
        }
    },
    return_needed: function (frm) {
        frm.save()
    },
    custodian_type: function (frm) {
        if (frm.doc.custodian_type == "Branch") {
            frappe.dynamic_link = { doc: frm.doc, fieldname: 'custodian', doctype: 'Branch' }
        }
        else if (frm.doc.custodian_type == "Associate") {
            frappe.dynamic_link = { doc: frm.doc, fieldname: 'custodian', doctype: 'Associate' }
        }
        else if (frm.doc.custodian_type == "Supplier") {
            frappe.dynamic_link = { doc: frm.doc, fieldname: 'custodian', doctype: 'Supplier' }
        }
        else if (frm.doc.custodian_type == "Candidate") {
            frappe.dynamic_link = { doc: frm.doc, fieldname: 'custodian', doctype: 'Candidate' }
        }
    }

});