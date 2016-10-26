# Copyright (c) 2015, VHRS and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe,re
from frappe.utils import flt, getdate, get_url
from frappe.model.mapper import get_mapped_doc
from frappe import _
from frappe.model.document import Document

class Candidate(Document):
	def validate(self):
		self.validate_passport()
		self.total_exp()

	def total_exp(self):
		if self.india_experience or self.gulf_experience:
			self.total_experience = self.india_experience + self.gulf_experience
		elif not self.india_experience and not self.gulf_experience:
			self.total_experience = 0

	def validate_passport(self):
		"""Validates the Passport string"""
		passport_str = (self.passport_no or "").strip()

		if not passport_str:
			return False

		match = re.match("[a-z0-9]", passport_str)

		if not match:
			frappe.throw(frappe._("{0} is not a valid Passport No").format(passport_str),
					frappe.InvalidEmailAddressError)

@frappe.whitelist()
def get_projects(doctype, txt, searchfield, start, page_len, filters):
	if not filters.get("customer"):
		frappe.throw(_("Please select Customer first."))

	project_list = 	frappe.db.sql("""select project.name from tabProject project where project.customer = %s""", (filters.get("customer")))
	return project_list

def get_tasks(doctype, txt, searchfield, start, page_len, filters):
	if not filters.get("project"):
		frappe.throw(_("Please select Project first."))

	task_list = frappe.db.sql("""select task.name,task.subject from tabTask task where task.project = %s""", (filters.get("project")))
	return task_list

@frappe.whitelist()
def make_candidate(source_name, target_doc=None, ignore_permissions=False):
	doclist = get_mapped_doc("Task", source_name, {
		"Task": {
			"doctype": "Candidate",
				},
		"Task Candidate": {
			"doctype": "Sales Invoice Candidate",
			"field_map": {
				"parent": "task"
			},
			"add_if_empty": True
		}

	}, target_doc,ignore_permissions=ignore_permissions)

	return doclist
