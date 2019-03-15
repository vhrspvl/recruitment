frappe.ready(function () {
    // bind events here
    $(':submit').on("click", function (e) {
        var token = prompt("Enter the registration ID");
        if (person != null) {
            frappe.call({
                method: "frappe.client.get_list",
                args: {
                    doctype: "Token Summary",
                    fields: ["token"],
                    filters: [["token", "=", token]]
                },
                callback: function (r) {
                    $.each(r.message, function (i, d) {
                        frappe.msgprint("Registration ID " + d.token)
                    })
                }
            });

        }
    })
})