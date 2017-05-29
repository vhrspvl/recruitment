# -*- coding: utf-8 -*-
# Copyright (c) 2015, VHRS and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.utils.data import today
from frappe.model.document import Document


class Closure(Document):
    def validate(self):
        # self.tcrdetails()
        self.validate_psl()
        # self.calculate_service_charge()

    def calculate_service_charge(self):
        self.pending_payment = self.as_on_date_collection - self.collected

    def validate_psl(self):
        if self.candidate_status == 'Dropped':
            frappe.db.set_value("Candidate", self.candidate,
                                "pending_for", "IDB")
            self.status = 'Dropped'

        elif self.candidate_status == 'Waitlisted':
            self.status = 'Waitlisted'

        elif self.candidate_status == 'Selected':
            if self.territory == 'UAE':
                if self.irf and self.passport and self.photo and self.selection_date:
                    if self.csl_status == 'CSL Confirmed':
                        if self.offer_letter:
                            if self.premedical:
                                if self.mol:
                                    if self.visa:
                                        if self.final_medical:
                                            if self.stamped_visa or self.poe or self.vhrs_affidavit:
                                                if self.payment_reciept:
                                                    if self.ticket:
                                                        self.status = 'Pending for Candidate Onboarding'
                                                        self.status_updated_on = today()
                                                    else:
                                                        self.status = 'Pending for Ticket Details'
                                                        self.status_updated_on = today()
                                                else:
                                                    self.status = 'Pending for Payment Receipt'
                                                    self.status_updated_on = today()
                                            else:
                                                self.status = 'Pending for Visa Stamping'
                                                self.status_updated_on = today()
                                        else:
                                            self.status = 'Pending for PCC'
                                            self.status_updated_on = today()
                                    else:
                                        self.status = 'Pending for Visa'
                                        self.status_updated_on = today()
                                else:
                                    self.status = 'Pending for MOL'
                                    self.status_updated_on = today()
                            else:
                                self.status = 'Pending for Premedical'
                                self.status_updated_on = today()
                        else:
                            self.status = 'Pending for Offer Letter'
                            self.status_updated_on = today()
                    else:
                        self.status = 'Pending for CSL'
                        self.status_updated_on = today()
                else:
                    self.status = 'Pending for PSL'
                    self.csl_status = 'Pending for CSL'
                    self.status_updated_on = today()

        elif self.territory == 'Dammam' or self.territory == 'Jeddah' or self.territory == 'Riyadh':
            if self.irf and self.passport and self.photo and self.selection_date:
                if self.csl_status == 'CSL Confirmed':
                    if self.offer_letter:
                        if self.visa:
                            if self.final_medical:
                                if self.stamped_visa or self.poe or self.vhrs_affidavit:
                                    if self.payment_reciept:
                                        if self.ticket:
                                            self.status = 'Pending for Candidate Onboarding'
                                            self.status_updated_on = today()
                                        else:
                                            self.status = 'Pending for Ticket Details'
                                            self.status_updated_on = today()
                                    else:
                                        self.status = 'Pending for Payment Receipt'
                                        self.status_updated_on = today()
                                else:
                                    self.status = 'Pending for Visa Stamping'
                                    self.status_updated_on = today()
                            else:
                                self.status = 'Pending for Final Medical'
                                self.status_updated_on = today()
                        else:
                            self.status = 'Pending for Visa'
                            self.status_updated_on = today()
                    else:
                        self.status = 'Pending for Offer Letter'
                        self.status_updated_on = today()
                else:
                    self.status = 'Pending for CSL'
                    self.status_updated_on = today()
            else:
                self.status = 'Pending for PSL'
                self.csl_status = 'Pending for CSL'
                self.status_updated_on = today()

        elif self.territory == 'Oman' or self.territory == 'Qatar':
            if self.irf and self.passport and self.photo and self.selection_date:
                if self.csl_status == 'CSL Confirmed':
                    if self.offer_letter:
                        if self.premedical:
                            if self.visa:
                                if self.poe or self.vhrs_affidavit:
                                    if self.payment_reciept:
                                        if self.ticket:
                                            self.status = 'Pending for Candidate Onboarding'
                                            self.status_updated_on = today()
                                        else:
                                            self.status = 'Pending for Ticket Details'
                                            self.status_updated_on = today()
                                    else:
                                        self.status = 'Pending for Payment Receipt'
                                        self.status_updated_on = today()
                                else:
                                    self.status = 'Pending for Visa Stamping'
                                    self.status_updated_on = today()
                            else:
                                self.status = 'Pending for Visa'
                                self.status_updated_on = today()
                        else:
                            self.status = 'Pending for Premedical'
                            self.status_updated_on = today()
                    else:
                        self.status = 'Pending for Offer Letter'
                        self.status_updated_on = today()
                else:
                    self.status = 'Pending for CSL'
                    self.status_updated_on = today()
            else:
                self.status = 'Pending for PSL'
                self.csl_status = 'Pending for CSL'
                self.status_updated_on = today()

        elif self.territory == 'Kuwait':
            if self.irf and self.passport and self.photo and self.selection_date:
                if self.csl_status == 'CSL Confirmed':
                    if self.premedical:
                        if self.offer_letter:
                            if self.visa:
                                if self.pcc:
                                    if self.final_medical:
                                        if self.stamped_visa or self.poe or self.vhrs_affidavit:
                                            if self.payment_reciept:
                                                if self.ticket:
                                                    self.status = 'Pending for Candidate Onboarding'
                                                    self.status_updated_on = today()
                                                else:
                                                    self.status = 'Pending for Ticket Details'
                                                    self.status_updated_on = today()
                                            else:
                                                self.status = 'Pending for Payment Receipt'
                                                self.status_updated_on = today()
                                        else:
                                            self.status = 'Pending for Visa Stamping'
                                            self.status_updated_on = today()
                                    else:
                                        self.status = 'Pending for Final Medical'
                                        self.status_updated_on = today()
                                else:
                                    self.status = 'Pending for PCC'
                                    self.status_updated_on = today()
                            else:
                                self.status = 'Pending for Visa'
                                self.status_updated_on = today()
                        else:
                            self.status = 'Pending for Premedical'
                            self.status_updated_on = today()
                    else:
                        self.status = 'Pending for Offer Letter'
                        self.status_updated_on = today()
                else:
                    self.status = 'Pending for CSL'
                    self.status_updated_on = today()
            else:
                self.status = 'Pending for PSL'
                self.csl_status = 'Pending for CSL'
                self.status_updated_on = today()


@frappe.whitelist()
def get_dle(doctype, txt, searchfield, start, page_len, filters):
    if not filters.get("candidate"):
        frappe.throw(_("Please select candidate first."))

    dle = frappe.db.sql(
        """select candidate.user from tabCandidate candidate where candidate.name = %s""", (filters.get("candidate")))
#    dle_user = frappe.db.sql("""select employee.user_id from tabEmployee employee where employee.name=%s""",dle)
    return dle_user


def get_tl(doctype, txt, searchfield, start, page_len, filters):
    if not filters.get("dle"):
        frappe.throw(_("Please select Delivery Executive first."))

    tl = frappe.db.sql(
        """select employee.reports_to from tabEmployee employee where employee.user_id=%s""", (filters.get("dle")))
    tl_user = frappe.db.sql(
        """select employee.user_id from tabEmployee employee where employee.name=%s""", tl)
    return tl_user
