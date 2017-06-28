# Copyright (c) 2015, Voltech HR Services Pvt.Ltd., and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe
from frappe.utils.data import today, formatdate


def apply_perm(doc, method):
    assigned_to = frappe.db.get_value("Project", doc.name, "_assign")
    frappe.errprint(assigned_to.type())
    # for user in assigned_to:
    # frappe.errprint(user)
    #    frappe.permissions.add_user_permission("Project", doc.name, user)


def send_email():

    #    """send email for Sales Order Conversion"""
    #    frappe.sendmail(recipients=self.email_to, sender=None, subject=self.subject,
    #                    message=self.get_message(), attachments=[frappe.attach_print(self.reference_doctype,
    #                                                                                 self.reference_name, file_name=self.reference_name, print_format=self.print_format)])


@frappe.whitelist()
def generate_so(so_date):
    closure_list = frappe.db.get_list("Closure", filters={"sales_order_confirmed_date": formatdate(
        so_date)}, fields=("name", "candidate", "name1", "candidate_sc", "client_sc"))
    return closure_list
