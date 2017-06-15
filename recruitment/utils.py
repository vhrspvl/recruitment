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
