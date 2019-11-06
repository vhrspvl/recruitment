# -*- coding: utf-8 -*-
# Copyright (c) 2015, VHRS and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document


class Associate(Document):
    def validate(self):
        self.validate_levels()

    def validate_levels(self):
        if self.terms_and_condition:
            if self.aerp_attachment:
                if self.l3_manager_visited_by:
                    if self.l4_heads_visited_by:
                        if self.l5_trusted_by:
                            self.empanelment_level = 'L5 - Trusted Associate'
                        else:
                            self.empanelment_level = 'L4 - TH,DIrector visit completed'
                    else:
                        self.empanelment_level = 'L3 - Manager Executive visit completed'
                else:
                    self.empanelment_level = 'L2 - AERP Completed'
            else:
                self.empanelment_level = 'L1 - Terms Accepted'
        else:
            self.empanelment_level = 'L0 - Identified'
