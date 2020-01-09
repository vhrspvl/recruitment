// Copyright (c) 2018, VHRS and contributors
// For license information, please see license.txt

frappe.ui.form.on('Whatsapp Notification', {
    refresh: function (frm) {

    },
    send: function (frm) {
        frappe.call({
            method: "vhrs.custom.send_whatsapp_notification",
            freeze: 'true',
            freeze_message: __("Sending"),
            args: {
                "message": frm.doc.message,
                "filename": frm.doc.file,
                "recipient": frm.doc.recipient,
                "lat": frm.doc.lat,
                "lng": frm.doc.lng,
                "address": frm.doc.address
            },
            callback: function (r) {
                frappe.msgprint(__('Sent'))
            }
        })
    }
    // send: function (frm) {
    //     var settings = {
    //         "async": true,
    //         "crossDomain": true,
    //         "url": "https://api.wassenger.com/v1/messages",
    //         "method": "POST",
    //         "headers": {
    //             "content-type": "application/json",
    //             "token": "06554ceb00b8d784a61fd7f5939d1aba0b8ab2c4375774814e78428536a451e78974f816ce9ad8c7"
    //         },
    //         "processData": false,
    //         "data": { "phone": frm.doc.recipient, "message": frm.doc.message, "enqueue": "never" }
    //     }

    //     $.ajax(settings).done(function (response) {
    //         console.log(response);
    //     });
    // }
});

