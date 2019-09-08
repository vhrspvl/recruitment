cur_frm.add_fetch("project", "cpc", "cpc");
cur_frm.add_fetch("customer", "customer_owner", "bde");

frappe.ui.form.on('Closure', {
    'onload_post_render': function (frm) {
        frm.toggle_display("capture_fingerprint", !frm.doc.fp_template);
        frm.toggle_display("fingerprint_verification", frm.doc.fp_template);
    },

    onload: function (frm) {
        frm.set_query("project", function () {
            return {
                query: "recruitment.recruitment.doctype.candidate.candidate.get_projects",
                filters: {
                    customer: frm.doc.customer
                }
            };
        });

        frm.set_query("task", function () {
            return {
                query: "recruitment.recruitment.doctype.candidate.candidate.get_tasks",
                filters: {
                    project: frm.doc.project
                }
            };
        });

        frm.set_query("candidate", function () {
            return {
                query: "recruitment.recruitment.doctype.candidate.candidate.get_candidates",
                filters: {
                    task: frm.doc.task
                }
            };
        });

        var template = `<img width="200px" height="200px" alt="Finger Image" src="/files/fp.gif">`;
        cur_frm.fields_dict.fp_image.$wrapper.html(template);
        frm.toggle_display("fingerprint_verification", frm.doc.fp_template);
        frm.toggle_display("capture_fingerprint", !frm.doc.fp_template);
        $(cur_frm.fields_dict.passport_no.input).attr("maxlength", "8");

    },

    validate: function (frm) {
        var template = `<img width="145px" height="188px" alt="Finger Image" src="/files/fp.gif">`;
        cur_frm.fields_dict.fp_image.$wrapper.html(template)
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

    candidate_boarded: function (frm) {
        frm.set_value("status", "Onboarded");
        frm.save();

    },
    date_of_issue: function (frm) {
        var me = new Date(frm.doc.date_of_issue);
        var expiry_date = new Date(me.getFullYear() + 10, me.getMonth(), me.getDate() - 1)
        frm.set_value("expiry_date", expiry_date)
    },

    verify: function (frm) {
        jsondata = { 'BioType': 'FMR', 'GalleryTemplate': frm.doc.fp_template }
        $.ajax({
            type: "POST",
            url: "http://localhost:8004/mfs100/match",
            data: jsondata,
            dataType: "json",
            success: function (data) {
                if (data.Status) {
                    frappe.msgprint(
                        "<img src=http://192.168.3.44:8080/files/verified%202018-09-06%2000:31:39.gif>" +
                        __("Finger Matched"))
                }
                else {
                    if (data.ErrorCode != "0") {
                        if (data.ErrorCode === "-1307") {
                            frappe.msgprint(__("Machine Not Connected"))
                        }
                        else {
                            frappe.msgprint(__(data.ErrorDescription))
                        }

                    }
                    else {
                        frappe.msgprint(
                            "<img src=http://192.168.3.44:8080/files/rubber_stamp_rejected_md_wm%202018-09-06%2000:48:08.gif>" +
                            __("Finger Not Matched"))
                    }
                }
            },
            error: function (jqXHR, ajaxOptions, thrownError) {
                if (jqXHR.status === 0) {
                    frappe.msgprint(__("Service Unavailable,Check drivers installed correcty"))
                }
            }
        })
    },
    create_qr: function (frm) {
        frappe.call({
            method: "vhrs.custom.generate_qr",
            args: {
                "closure": frm.doc.name
            },
            callback: function (r) {
                refresh_field("qr_code");
            }
        })
    },
    capture: function (frm) {
        var jsondata = { 'Quality': '', 'Timeout': '' }
        $.ajax({
            type: "POST",
            url: "http://localhost:8004/mfs100/capture",
            data: jsondata,
            dataType: "json",
            success: function (data) {
                frm.set_value("fp_template", data.AnsiTemplate)
                var test = data.BitmapData
                var template = `<img width="145px" height="188px" alt="Finger Image" src="data:image/bmp;base64,${test}">`;
                cur_frm.fields_dict.fp_image.$wrapper.html(template);
                console.log(data)
                httpStaus = true;
                res = { httpStaus: httpStaus, data: data };
            }
        })
    },

    // generate_sales_order: function (frm) {
    //     if (frm.doc.client_payment_applicable || frm.doc.candidate_payment_applicable) {
    //         if (frm.doc.client_payment_applicable && frm.doc.client_sc <= 0) {
    //             msgprint("Please Enter Client Service Charge Value")
    //         } else if (frm.doc.candidate_payment_applicable && frm.doc.candidate_sc <= 0) {
    //             msgprint("Please Enter Candidate Service Charge Value")
    //         } else {
    //             frappe.confirm(
    //                 'Did you verified the payment terms?',
    //                 function () {
    //                     frm.set_value("csl_status", "Sales Order Confirmed");
    //                     frm.set_value("sales_order_confirmed_date", frappe.datetime.get_today())
    //                     frm.save();
    //                 })
    //         }
    //     } else {
    //         msgprint("Please Select Applicable Service Charge Details !")
    //     }

    // },

    refresh: function (frm) {
        if (frm.doc.dnd_incharge) {
            frm.set_df_property('dnd_incharge', 'read_only', 1);
        }
        if (frm.doc.fp_template) {
            frm.add_custom_button(__("FP Attached"), function () {
            }).addClass('btn btn-success')
        }
        frm.add_custom_button(__("View ODR"), function () {
            frappe.set_route('List', 'Original Document Management', { candidate: frm.doc.name });
        }).addClass('btn btn-primary'),
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
                                                "business_unit": frm.doc.business_unit || " ",
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


            client_pending = 0;
            client_pending = frm.doc.client_sc - frm.doc.client_advance;
            frm.set_value("client_pending", client_pending);

            candidate_pending = 0;
            candidate_pending = frm.doc.candidate_sc - frm.doc.candidate_advance;
            frm.set_value("candidate_pending", candidate_pending);
        }
    },
    associate_name: function (frm) {
        if (!frm.doc.associate_name) {
            frm.set_value('associate_contact_no', '');
            frm.set_value('associate', '');
        }
    },


});