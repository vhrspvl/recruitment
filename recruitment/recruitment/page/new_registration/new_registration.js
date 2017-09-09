frappe.pages['new-registration'].on_page_load = function(wrapper) {
  var page = frappe.ui.make_app_page({
    parent: wrapper,
    title: __('New Registration'),
    single_column: true
  });

  if (frappe.model.can_read('Registration Tool')) {
    page.add_menu_item(__('New Registration'), function() {
      frappe.set_route('Form', 'Registration Tool');
    });
  }
}
