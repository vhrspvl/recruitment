# -*- coding: utf-8 -*-
# Copyright (c) 2018, VHRS and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.model.naming import make_autoname
from frappe.utils import today


class OriginalDocumentManagement(Document):
    def autoname(self):
        self.name = make_autoname(
            self.candidate + "/" + self.document_ref_no + "/.###")
