frappe.pages['dashboard'].on_page_load = function (wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Dashboard',
        single_column: true
    });
    this.page.add_menu_item(__('Add to Desktop'), function () {
        frappe.add_to_desktop(me.frm.doctype, me.frm.doctype);
    }, true);
    console.log("frappe.user.name")
    $(frappe.render_template("dashboard")).appendTo(page.body.addClass("no-border"));
    // page.main.html(frappe.render_template("dashboard", {}));
    // console.log(page)
}