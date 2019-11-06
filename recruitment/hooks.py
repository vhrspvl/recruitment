# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "recruitment"
app_title = "Recruitment"
app_publisher = "VHRS"
app_description = "VHRS Custom for Recruitment"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "hr@voltechgroup.com"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/recruitment/css/recruitment.css"
# app_include_js = "/assets/recruitment/js/recruitment.js"

# include js, css files in header of web template
# web_include_css = "/assets/recruitment/css/recruitment.css"
# web_include_js = "/assets/recruitment/js/recruitment.js"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "recruitment.utils.get_home_page"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "recruitment.install.before_install"
# after_install = "recruitment.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "recruitment.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events
doc_events = {
    "Candidate": {
        "on_update": "recruitment.api.create_closure"
    },
    "Task Candidate": {
        "on_update": "recruitment.api.create_closure"
    },
    # "Project": {
    #    "on_update": "recruitment.utils.apply_perm"
    # }
}
# Jinja Filters
# ---------------
# Methods accessible to print template
jenv = {
    "methods": [
        'get_qrcode:recruitment.api.get_qrcode'
    ]
}
# website
fixtures = ["Custom Script", "Custom Field"]
# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

scheduler_events = {
    # 	"all": [
    # 		"recruitment.tasks.all"
    # 	],
    "daily": [
        "recruitment.api.send_anniversary_reminders",
        "recruitment.api.set_dow",
        "recruitment.api.set_project_as_overdue"
    ],
    # 	"hourly": [
    # 		"recruitment.tasks.hourly"
    # 	],
    # 	"weekly": [
    # 		"recruitment.tasks.weekly"
    # 	]
    # 	"monthly": [
    # 		"recruitment.tasks.monthly"
    # 	]
}

# Testing
# -------

# before_tests = "recruitment.install.before_tests"

# Overriding Whitelisted Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "recruitment.event.get_events"
# }
