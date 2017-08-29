# -*- coding: utf-8 -*-
# Copyright (c) 2017, VHRS and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document


class RegistrationTool(Document):
    def register(self, doc):
        if self.name1 and self.mobile:
            candidate = frappe.new_doc("Candidate")
            candidate.update({
                "given_name": self.name1,
                "mobile": self.mobile,
                "gender": self.gender,
                "father_name": self.father_name,
                "date_of_birth": self.date_of_birth
            })
            candidate.save(ignore_permissions=True)
            candidate_details = {
                "name": candidate.name,
                "given_name": candidate.given_name,
                "father_name": candidate.father_name,
                "mobile": candidate.mobile,
                "gender": candidate.gender,
                "date_of_birth": candidate.date_of_birth
            }
            return candidate_details
    #        frappe.db.set_value("Token Summary", token.name, "validity", "Invalid")
        else:
            frappe.msgprint(_("Name and Mobile is Mandatory"), title=_(
                'Missing Fields'), indicator='red')
            return 'False'


@frappe.whitelist()
def confirm_register():
    print "hi"
