# -*- coding: utf-8 -*-
# Copyright (c) 2017, VHRS and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document


class StatusChangeTool(Document):
    pass


@frappe.whitelist()
def get_closure_list(project):
    closure_list = []
    project = frappe.db.get_value("Project", project, "name")

    if project:
        closure_list = frappe.get_list("Closure", fields=["name", "name1"], filters={
                                       "csl_status": "Pending for CSL", "project": project}, order_by="name1")
        return closure_list
    else:
        frappe.msgprint(_("Please select a valid Project with Closure"))
