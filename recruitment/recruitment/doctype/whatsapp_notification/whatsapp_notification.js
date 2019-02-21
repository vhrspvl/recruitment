// Copyright (c) 2018, VHRS and contributors
// For license information, please see license.txt

frappe.ui.form.on('Whatsapp Notification', {
    refresh: function (frm) {

    },
    send: function (frm) {
        frappe.call({
            method: "vhrs.custom.send_whatsapp_notification",
            args: {
                "message": frm.doc.message,
                "recipient": frm.doc.recipient
            },
            callback: function (r) {
                console.log(r.message)
                frappe.msgprint(__('Sent'))
            }
        })
    }
});

