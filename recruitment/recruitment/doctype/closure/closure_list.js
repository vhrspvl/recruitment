frappe.listview_settings['Closure'] = {
    add_fields: ["photo"],
    onload: function (listview) {
        listview.page.add_menu_item(__("Send Ticket Request"), function () {
            var method = "vhrs.custom.bulk_ticket_request"
            listview.call_for_selected_items(method);
        })
    }
}