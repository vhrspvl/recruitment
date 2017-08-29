from __future__ import unicode_literals
from frappe import _

def get_data():
	return [
		{
			"module_name": "Recruitment",
			"label": _("Recruitment"),
			"color": "#FFF5A7",
			"reverse": 1,
			"icon": "octicon octicon-calendar",
			"type": "module"
		},
		{
			"module_name": "Recruitment",
			"color": "#589494",
			"icon": "fa fa-th",
			"icon": "octicon octicon dashboard",
			"type": "page",
			"link": "dashboard",
			"label": _("Dashboard")
		}
	]
