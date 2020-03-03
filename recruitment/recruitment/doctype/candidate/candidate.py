# Copyright (c) 2015, VHRS and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
import re
from frappe.utils import flt, getdate, get_url
from frappe.model.mapper import get_mapped_doc
from frappe import _
from frappe.model.document import Document
from frappe.utils.data import today
from frappe.utils import add_months


class Candidate(Document):
    def validate(self):
        self.total_exp()
        self.check_closure_exists()
        # self.validate_passport()

    def validate_passport(self):
        if(self.passport_no):
            pp = self.passport_no
            match = re.match("[A-Z0-9]{8}$", pp)
            if not match:
                frappe.msgprint(_("{0} is not a valid Passport No").format(pp))
                self.passport_no = ''

    def total_exp(self):
        if self.india_experience or self.gulf_experience:
            self.total_experience = self.india_experience + self.gulf_experience
        elif not self.india_experience and not self.gulf_experience:
            self.total_experience = 0

        # Check if any previous closure exists
    def check_closure_exists(self):
        closure = frappe.db.get_value("Closure", {"candidate": self.name})
        if closure:
            self.pending_for = 'Proposed PSL'

@frappe.whitelist()
def get_parent_territory(customer):
    territory = frappe.db.get_value("Customer", customer, "territory")
    return territory

def get_tasks(doctype, txt, searchfield, start, page_len, filters):
    if not filters.get("project"):
        frappe.throw(_("Please select Project first."))

    task_list = frappe.db.sql(
        """select task.name,task.subject from tabTask task where task.project = %s order by creation desc""", (filters.get("project")))
    return task_list
