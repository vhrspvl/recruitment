# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from frappe import _

def get_data():
	return [
		{
			"module_name": "Recruitment",
			"color": "grey",
			"icon": "octicon octicon-organization",
			"type": "module",
			"label": _("Recruitment")
			"items": [
				{
					"type": "doctype",
					"name": "Candidate",
					"label": _("Candidate"),
					"description": _("VHRS Candidate Database"),
				},
				{
					"type": "doctype",
					"name": "Associate",
					"label": _("Associate"),
					"description": _("VHRS Associate Database"),
				},
			]

		}
	]
