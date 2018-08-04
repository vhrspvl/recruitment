from frappe import _


def get_data():
    return [
        {
            "module_name": "Recruitment",
            "color": "grey",
            "icon": "fa fa-star",
                    "type": "module",
                    "label": _("Recruitment"),
                    "items": [
                        {
                            "type": "page",
                            "name": "dashboard",
                            "icon": "fa fa-dashboard",
                            "label": _("Dashboard"),
                            "description": _("VHRS Candidate Database"),
                        },
                        {
                            "type": "doctype",
                            "name": "Candidate",
                            "icon": "fa fa-star",
                            "label": _("Candidate"),
                            "description": _("VHRS Candidate Database"),
                        },
                        {
                            "type": "doctype",
                            "name": "Closure",
                            "icon": "fa fa-star",
                            "label": _("closure"),
                            "description": _("Recruitment Documentation"),
                        },
                        {
                            "type": "doctype",
                            "name": "Interview",
                            "label": _("Interview"),
                            "description": _("Interviews for Projects"),
                        },

                        {
                            "type": "doctype",
                            "name": "Associate",
                            "label": _("Associate"),
                            "description": _("VHRS Associate Database"),
                            "hide_count": False
                        }
                    ]
        }
    ]
