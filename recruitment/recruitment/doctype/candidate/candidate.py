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
		self.total_exp()
		self.check_closure_exists()


	def before_save(self):
		self.check_project_details()

	def check_project_details(self):
		if self.pending_for != 'IDB' or self.pending_for != 'Do Not Disturb':
			if not self.customer:
				frappe.msgprint(_('Customer is mandatory'))
			elif not self.project:
				frappe.msgprint(_('Project is mandatory'))
			elif not self.task:
				frappe.msgprint(_('Task is mandatory'))

	def total_exp(self):
		if self.india_experience or self.gulf_experience:
			self.total_experience = self.india_experience + self.gulf_experience
		elif not self.india_experience and not self.gulf_experience:
			self.total_experience = 0

		# Check if any previous balance exists
	def check_closure_exists(self):
		closure = frappe.db.get_value("Closure", {"candidate": self.name})
		if closure:
			self.pending_for = 'Proposed PSL'

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

def get_candidates(doctype, txt, searchfield, start, page_len, filters):
	if not filters.get("task"):
		frappe.throw(_("Please select Position first."))

	candidate_list = frappe.db.sql("""select candidate.name,candidate.given_name from tabCandidate candidate where candidate.task = %s""", (filters.get("task")))
	return candidate_list

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
