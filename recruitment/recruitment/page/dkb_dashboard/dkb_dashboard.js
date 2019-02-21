frappe.pages['dkb-dashboard'].on_page_load = function (wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'DKB Dashboard',
        single_column: true
    });
    this.page.add_menu_item(__('Add to Desktop'), function () {
        frappe.add_to_desktop(this.frm.doctype, this.frm.doctype);
    }, true);
    $(frappe.render_template('dkb_dashboard')).appendTo(page.body);
}