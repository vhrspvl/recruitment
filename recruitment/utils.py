# Copyright (c) 2015, Voltech HR Services Pvt.Ltd., and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe


def apply_perm(doc, method):
    assigned_to = frappe.db.get_value("Project", doc.name, "_assign")
    frappe.errprint(assigned_to.type())
    # for user in assigned_to:
    # frappe.errprint(user)
    #    frappe.permissions.add_user_permission("Project", doc.name, user)


def send_email(doc, method):
    """send email for Sales Order Conversion"""
    frappe.sendmail(recipients=self.email_to, sender=None, subject=self.subject,
                    message=self.get_message(), attachments=[frappe.attach_print(self.reference_doctype,
                                                                                 self.reference_name, file_name=self.reference_name, print_format=self.print_format)])


def get_message(self):
    """return message with payment gateway link"""

    context = {
        "doc": frappe.get_doc(self.reference_doctype, self.reference_name),
        "payment_url": self.payment_url
    }

    if self.message:
        return frappe.render_template(self.message, context)
