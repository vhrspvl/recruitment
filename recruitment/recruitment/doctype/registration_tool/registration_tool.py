# -*- coding: utf-8 -*-
# Copyright (c) 2017, VHRS and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document


class RegistrationTool(Document):
    def confirm_register(testid,doc):
        frappe.errprint(doc.name1)
        token = frappe.db.get("Token Summary", {"token": testid})
        if testid == token.token and token.validity == 'Valid':
            candidate = frappe.new_doc("Candidate")
            candidate.update({
                "given_name": doc.name1,
                "mobile": doc.mobile,
                "gender": doc.gender,
                "father_name": doc.father_name,
                "date_of_birth": doc.date_of_birth,
                "experience":doc.experience
            })
            
    def register(self, doc):
        if self.name1 and self.mobile:
            candidate_details = {
                "name": self.name,
                "given_name": self.name1,
                "father_name": self.father_name,
                "mobile": self.mobile,
                "gender": self.gender,
                "date_of_birth": self.date_of_birth
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
