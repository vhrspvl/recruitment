# Copyright (c) 2015, Voltech HR Services Pvt.Ltd., and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe
from frappe.utils.data import today, formatdate
from frappe.integrations.utils import get_checkout_url


def apply_perm(doc, method):
    assigned_to = frappe.db.get_value("Project", doc.name, "_assign")
    frappe.errprint(assigned_to.type())
    # for user in assigned_to:
    # frappe.errprint(user)
    #    frappe.permissions.add_user_permission("Project", doc.name, user)


@frappe.whitelist()
def generate_so(so_date):
    frappe.errprint(so_date)
    closure_list = frappe.db.get_list("Closure", filters={"sales_order_confirmed_date": formatdate(
        so_date)}, fields=("name", "candidate", "name1", "candidate_sc", "client_sc"))
    return closure_list


@frappe.whitelist(allow_guest=True)
def make_payment(name):
    # make order
    closure = frappe.get_doc('Closure', name)

    # get razorpay url
    url = get_checkout_url(**{
        'payment_gateway': 'Razorpay',
        'amount': closure.candidate_pending,
        'payer_email': 'abdulla.pi@voltechgroup.com',
        'title': 'VHRS Pending Payment',
        'payer_name': closure.name1,
        'description': 'Pending Payment for the Position',
        'reference_doctype': closure.doctype,
        'reference_docname': closure.name,
        'order_id': closure.passport_no,
        'currency': 'INR'
    })
    return url
