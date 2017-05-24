import frappe
import shortuuid
from frappe import _
from frappe.utils.data import today
from frappe.utils import datetime, nowdate, add_days


@frappe.whitelist()
def confirm_register(name, testid):
    candidate = frappe.db.get_value("Registration", name, "name")
    get_candidate = frappe.get_doc("Registration", candidate)
    token = frappe.db.get("Token Summary", {"token": testid})
    if testid == token.token and token.validity == 'Valid':
        frappe.db.set_value("Registration", candidate, "test_id", testid)
        frappe.db.set_value("Registration", candidate, "status", "Registered")
        frappe.db.set_value("Token Summary", token.name, "validity", "Invalid")
        return testid
    else:
        frappe.msgprint("Invalid or Expired Token.")
        return 'invalid'


@frappe.whitelist()
def generate_token(token_type, no_of_tokens):
    for tokens in no_of_tokens:
        new_token = frappe.new_doc("Token Summary")
        new_token.token = shortuuid.ShortUUID().random(length=10)
        if token_type == 'Domestic':
            new_token.value = 'Domestic'
        else:
            new_token.value = 'International'
        new_token.save()


@frappe.whitelist()
def get_district(doctype, txt, searchfield, start, page_len, filters):
    if not filters.get("state"):
        frappe.throw(_("Please select State first."))

    district_list = frappe.db.sql(
        """select district.name,district.state from tabDistrict district where district.state = %s order by name asc""", (filters.get("state")))
    return district_list


@frappe.whitelist()
def fetch_candidate(project, payment_type):
    if payment_type == 'client':
        candidate = frappe.get_list("Closure", fields=["name1", "contact_no"], filters={
                                    "docstatus": 1, "project": project, "client_payment_applicable": 1}, order_by="idx")
    else:
        candidate = frappe.get_list("Closure", fields=["name1", "contact_no"], filters={
                                    "docstatus": 1, "project": project, "candidate_payment_applicable": 1}, order_by="idx")
    return candidate


@frappe.whitelist()
def create_closure(doc, method):
    if doc.pending_for == 'Proposed PSL':
        closure_id = frappe.db.get_value("Closure", {"candidate": doc.name})
        project = frappe.get_doc("Project", doc.project)
        task = frappe.db.get_value("Task", doc.task, "subject")
        bde = frappe.db.get_value("Customer", doc.customer, "customer_owner__cpc")
        territory = frappe.db.get_value("Customer", doc.customer, "territory")
        payment_terms = project.payment_terms
        dle = ''
        atm = ''
        tl = ''
        stm = ''
        if doc.user:
            executive = frappe.db.get("Employee", {"user_id": doc.user})
            dle = executive.user_id
            stm = executive.department
            atm = frappe.db.get_value(
                "Employee", executive.department_head, "user_id")
            tl = frappe.db.get_value(
                "Employee", executive.reports_to, "user_id")
        if closure_id:
            closure = frappe.get_doc("Closure", closure_id)
        else:
            closure = frappe.new_doc("Closure")
        closure.update({
            "customer": doc.customer,
            "territory": territory,
            "project": doc.project,
            "payment_terms": payment_terms,
            "task": doc.task,
            "candidate": doc.name,
            "name1": doc.given_name,
            "designation": task,
            "contact_no": doc.mobile,
            "passport_no": doc.passport_no,
            "ecr_status": doc.ecr_status,
            "associate_name": doc.associate_name,
            "associate_contact_no": doc.contact_no,
            "ecr": doc.ecr,
            "ecr_status": doc.ecr_status,
            "expiry_date": doc.expiry_date,
            "date_of_issue": doc.issued_date,
            "place_of_issue": doc.place_of_issue,
            "cpc": project.cpc,
            "dle": dle,
            "tl": tl,
            "bde": bde,
            "atm": atm,
            "stm": stm
        })
        if doc.irf:
            closure.update({"irf": doc.irf})
        if doc.candidate_image:
            closure.update({"photo": doc.candidate_image})
        if doc.passport:
            closure.update({"passport": doc.passport})
        closure.save(ignore_permissions=True)


@frappe.whitelist()
def candidate_count(doc, method):
    test = None
#    for candidate in candidates:
#        frappe.errprint(candidate.pending_for)


@frappe.whitelist()
def send_anniversary_reminders():
    from frappe.utils.user import get_enabled_system_users
    users = None

    work_anniversary = get_employees_who_have_anniversary_today()

    if work_anniversary:
        if not users:
            users = [u.email_id or u.name for u in get_enabled_system_users()]

        for e in work_anniversary:
            frappe.sendmail(recipients=filter(lambda u: u not in (e.company_email, e.personal_email, e.user_id), users),
                            subject=_("Work Anniversary Reminder for {0}").format(
                                e.employee_name),
                            message=_("""Today is {0}'s Work Anniversary!""").format(
                                e.employee_name),
                            reply_to=e.company_email or e.personal_email or e.user_id)


def get_employees_who_have_anniversary_today():
    """Get Employee properties whose work Anniversary is today."""
    return frappe.db.sql("""select name, personal_email, company_email, user_id, employee_name
		from tabEmployee where day(date_of_joining) = day(%(date)s)
		and month(date_of_joining) = month(%(date)s)
		and status = 'Active'""", {"date": today()}, as_dict=True)


def get_bdm_users(doctype, txt, searchfield, start, page_len, filters):
    user_list = frappe.db.sql(
        """select user.name,user.full_name,userrole.parent from tabUserRole userrole,tabUser user where userrole.role = 'Sales User' and userrole.role != 'Administrator' and user.enabled and user.name=userrole.parent""")
    return user_list


def get_projects(doctype, txt, searchfield, start, page_len, filters):
    if not filters.get("customer"):
        frappe.throw(_("Please select Customer first."))

    project_list = frappe.db.sql(
        """select project.name from tabProject project where project.customer = %s""", (filters.get("customer")))
    return project_list


def get_tasks(doctype, txt, searchfield, start, page_len, filters):
    if not filters.get("project"):
        frappe.throw(_("Please select Project first."))

    task_list = frappe.db.sql(
        """select task.name,task.subject from tabTask task where task.project = %s""", (filters.get("project")))
    return task_list


def get_candidates(doctype, txt, searchfield, start, page_len, filters):
    if not filters.get("task"):
        frappe.throw(_("Please select Position first."))

    candidate_list = frappe.db.sql(
        """select candidate.name,candidate.given_name from tabCandidate candidate where candidate.task = %s""", (filters.get("task")))
    return candidate_list


def get_dle(doctype, txt, searchfield, start, page_len, filters):
    if not filters.get("candidate"):
        frappe.throw(_("Please select candidate first."))

    dle = frappe.db.sql(
        """select candidate.executive from tabCandidate candidate where candidate.name = %s""", (filters.get("candidate")))
    dle_user = frappe.db.sql(
        """select employee.user_id from tabEmployee employee where employee.name=%s""", dle)
    return dle_user


def get_tl(doctype, txt, searchfield, start, page_len, filters):
    if not filters.get("dle"):
        frappe.throw(_("Please select Delivery Executive first."))

    tl = frappe.db.sql(
        """select employee.reports_to from tabEmployee employee where employee.user_id=%s""", (filters.get("dle")))
    tl_user = frappe.db.sql(
        """select employee.user_id from tabEmployee employee where employee.name=%s""", tl)
    return tl_user


@frappe.whitelist()
def set_dow():
    frappe.db.sql("""update tabTask set `date_of_working`=%s
		where `status`='Working'""", today())


def set_project_as_overdue():
    frappe.db.sql("""update tabProject set `status`='Overdue'
		where expected_end_date is not null
		and expected_end_date < CURDATE()
		and `status` not in ('Completed', 'Cancelled', 'Hold','DnD','PSL')""")
