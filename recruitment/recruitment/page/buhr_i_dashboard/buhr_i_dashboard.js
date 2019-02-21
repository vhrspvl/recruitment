frappe.pages['buhr-i-dashboard'].on_page_load = function (wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'BUHR I Dashboard',
        single_column: true
    });
    $(frappe.render_template('buhr-i-dashboard')).appendTo(page.body);
}