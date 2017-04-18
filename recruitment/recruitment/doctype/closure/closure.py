# -*- coding: utf-8 -*-
# Copyright (c) 2015, VHRS and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.utils.data import today
from frappe.model.document import Document

class Closure(Document):
	def validate(self):
		#self.tcrdetails()
		self.validate_psl()
		#self.calculate_service_charge()

	def calculate_service_charge(self):
		self.pending_payment = self.as_on_date_collection - self.collected

	def validate_psl(self):
		if self.candidate_status == 'Dropped':
			frappe.db.set_value("Candidate",self.candidate,"pending_for","IDB")
			self.status = 'Dropped'

		elif self.candidate_status == 'Waitlisted':
			self.status = 'Waitlisted'

		elif self.candidate_status == 'Selected':
			if self.territory == 'UAE':
				if self.irf and self.passport and self.photo :
					if self.premedical and self.offer_letter and self.mol:
						if self.visa:
							if self.pcc and self.final_medical:
								self.status = 'DnD-F Completed'
							else:
								self.status = 'Pending for D3'
						else:
							self.status = 'Pending for D2'
					else:
						self.status = 'Pending for D1'
				else:
					self.status = 'Pending for PSL'

			elif self.territory == 'Dammam' or self.territory == 'Jeddah' or self.territory == 'Riyadh'or self.territory == 'Kuwait':
				if self.irf and self.passport and self.photo :
					if self.offer_letter:
						if self.visa:
							if self.pcc and self.final_medical:
								self.status = 'DnD-F Completed'
							else:
								self.status = 'Pending for D3'
						else:
							self.status = 'Pending for D2'
					else:
						self.status = 'Pending for D1'
				else:
					self.status = 'Pending for PSL'

			elif self.territory == 'Qatar' or self.territory == 'Oman':
				if self.irf and self.passport and self.photo :
					if self.status == 'CSL Confirmed':
						if self.premedical and self.offer_letter:
							if self.visa:
								if self.pcc:
									self.status = 'DnD-F Completed'
									self.status_updated_on = today()
								else:
									self.status = 'Pending for D3'
									self.status_updated_on = today()
							else:
								self.status = 'Pending for D2'
								self.status_updated_on = today()
						else:
							self.status = 'Pending for D1'
							self.status_updated_on = today()
					else:
						self.status = 'Pending for CSL'
						self.status_updated_on = today()
				else:
					self.status = 'Pending for PSL'
					self.status_updated_on = today()

			elif self.territory == 'Kuwait':
				if self.irf and self.passport and self.photo :
					if self.premedical and self.offer_letter:
						if self.visa:
							if self.pcc and self.final_medical:
								self.status = 'DnD-F Completed'
							else:
								self.status = 'Pending for D3'
						else:
							self.status = 'Pending for D2'
					else:
						self.status = 'Pending for D1'
				else:
					self.status = 'Pending for PSL'

@frappe.whitelist()
def get_dle(doctype, txt, searchfield, start, page_len, filters):
	if not filters.get("candidate"):
		frappe.throw(_("Please select candidate first."))

	dle = 	frappe.db.sql("""select candidate.user from tabCandidate candidate where candidate.name = %s""", (filters.get("candidate")))
#	dle_user = frappe.db.sql("""select employee.user_id from tabEmployee employee where employee.name=%s""",dle)
	return dle_user

def get_tl(doctype, txt, searchfield, start, page_len, filters):
	if not filters.get("dle"):
		frappe.throw(_("Please select Delivery Executive first."))

	tl = 	frappe.db.sql("""select employee.reports_to from tabEmployee employee where employee.user_id=%s""", (filters.get("dle")))
	tl_user = frappe.db.sql("""select employee.user_id from tabEmployee employee where employee.name=%s""",tl)
	return tl_user
