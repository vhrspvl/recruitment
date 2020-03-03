import frappe
import json
# import shortuuid
import qrcode
import base64
from PIL import Image
from io import BytesIO
from frappe import _
from frappe.utils.data import today
from frappe.utils import datetime, nowdate, add_days, flt
from frappe.utils.print_format import download_pdf
from datetime import date


@frappe.whitelist()
def lead_mark_comment(lead, appointment_on, appointment_by):
    l = frappe.get_doc("Lead", lead)
    frappe.errprint(l)
    l.add_comment("Info", _("{0} taken appointment on {1}").format(
        appointment_by, appointment_on))
    # l.add_comment(doctype: "Communication", communication_type: "Comment", comment_type: "Comment", text: appointment_on)
    # l.add_comment('Info', frappe.bold(_( "{0} taken appointment on {1}").format(appointment_by, appointment_on))) + '<br><br>' + summary)


@frappe.whitelist()
def customer_mark_comment(customer, appointment_on, appointment_by):
    l = frappe.get_doc("Customer", customer)
    frappe.errprint(l)
    l.add_comment("Info", _(
        "{0} taken appointment on {1}").format(appointment_by, appointment_on))


@frappe.whitelist()
def confirm_register(testid, doc):
    candid = {}
    candid = json.loads(doc)
    if testid:
        token = frappe.db.get("Token Summary", {"token": testid})
        if token and testid == token.token and token.validity == 'Valid':
            candidate = frappe.new_doc("Candidate")
            candidate.update({
                "given_name": candid.get("name1"),
                "mobile": candid.get("mobile"),
                "gender": candid.get("gender"),
                "father_name": candid.get("father_name"),
                "date_of_birth": candid.get("date_of_birth"),
                "experience": candid.get("experience"),
                "type": "IDB"
            })
            candidate.save(ignore_permissions=True)

        #    frappe.db.set_value("Candidate", candidate, "registration_no", testid)
        # .    frappe.db.set_value("Candidate", candidate, "status", "Registered")
        #    frappe.db.set_value("Token Summary", token.name, "validity", "Invalid")
            return testid
        else:
            return 'invalid'
    else:
        return 'invalid'


def get_candidate(candidate_id):
    candidate = frappe.get_doc("Candidate", candidate_id)
    return candidate


@frappe.whitelist()
def send_pdf(doc, method):
    download_pdf(doc.doctype, doc.name, format="Registration Form", doc=doc)


# @frappe.whitelist()
# def generate_token(token_type, no_of_tokens):
#     tokens = int(no_of_tokens)
#     for token in range(tokens):
#         new_token = frappe.new_doc("Token Summary")
#         new_token.token = shortuuid.ShortUUID().random(length=10)
#         if token_type == 'Domestic':
#             new_token.value = 'Domestic'
#         else:
#             new_token.value = 'International'
#         new_token.save()


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
        frappe.errprint(doc.name)
        if doc.original_documents:
            for docs in doc.original_documents:
                docslist = frappe.db.get_value(
                    "Original Documents", {"name": docs.name})
        closure_id = frappe.db.get_value("Closure", {"candidate": doc.name})
        # interview = frappe.db.get("Candidate", docs.candidate)
        # if interview:
        #     interview_date = interview.interview_date
        project = frappe.get_doc("Project", doc.project)
        task = frappe.db.get_value("Task", doc.task, "subject")
        ca_executive = frappe.db.get_value(
            "Customer", doc.customer, "customer_owner__cpc")
        territory = frappe.db.get_value("Customer", doc.customer, "territory")
        payment_terms = project.payment_terms
        dle = ca_executive = source_executive = ''
        tl = ''
        # bu = ''
        department = ''
        if doc.user:
            executive = frappe.db.get("Employee", {"user_id": doc.user})
            if executive:
                source_executive = executive.user_id
                department = executive.department
                # bu = frappe.get_value("Employee", executive, 'business_unit')
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
            "current_location": doc.current_location,
            "passport_no": doc.passport_no,
            "ecr_status": doc.ecr_status,
            "associate_name": doc.associate_name,
            "associate": doc.associate,
            "associate_contact_no": doc.contact_no,
            "expiry_date": doc.expiry_date,
            "date_of_issue": doc.issued_date,
            "place_of_issue": doc.place_of_issue,
            "cr_executive": project.cpc,
            "ca_executive": ca_executive,
            "department": department,
            "source_executive": source_executive,
            "selection_date": doc.interview_date,
            "tl": tl,
            "degree": doc.degree,
            "specialization": doc.specialization,
            "yop": doc.yop,
            "basic": doc.basic,
            "food": doc.food,
            "other_allowances": doc.other_allowances,
            "dob": doc.dob
        })
        if doc.irf:
            closure.update({"irf": doc.irf})
        if doc.candidate_image:
            closure.update({"photo": doc.candidate_image})
        if doc.passport:
            closure.update({"passport": doc.passport})
        if doc.candidate_payment_applicable and flt(doc.candidate_sc) > 0:
            closure.update({
                "candidate_payment_applicable": 1,
                "candidate_sc": doc.candidate_sc
            })
        closure.save(ignore_permissions=True)


@frappe.whitelist()
def send_anniversary_reminders():
    from frappe.utils.user import get_enabled_system_users
    users = None

    work_anniversary = get_employees_who_have_anniversary_today()
    if work_anniversary:
        if not users:
            users = [u.email_id or u.name for u in get_enabled_system_users()]

        for e in work_anniversary:
            exp = calculate_exp(e.date_of_joining)

            def ordinal(n): return "%d%s" % (
                n, "tsnrhtdd"[(n/10 % 10 != 1)*(n % 10 < 4)*n % 10::4])
            experience = exp + 1

            wish = """We are Proud to have an Employee like you as a part of VHRS Family,
                    We wish you Heartfelt Congratulations and Best Wishes on your %s anniversary""" % (ordinal(exp))
            args = dict(employee=e.employee_name, experience=ordinal(experience),
                        wish=wish, company=frappe.defaults.get_defaults().company)
            frappe.sendmail(recipients=filter(lambda u: u not in (e.company_email, e.personal_email, e.user_id), users),
                            # frappe.sendmail(recipients='abdulla.pi@voltechgroup.com',
                            subject=_("Work Anniversary Reminder for {0}").format(
                                e.employee_name),
                            template='work_anniversary',
                            args=args)


def calculate_exp(dtob):
    today = date.today()
    return today.year - dtob.year - ((today.month, today.day) < (dtob.month, dtob.day))


def get_employees_who_have_anniversary_today():
    """Get Employee properties whose work Anniversary is today."""
    return frappe.db.sql("""select name, personal_email, company_email, user_id, employee_name,
        date_of_joining from tabEmployee where day(date_of_joining) = day(%(date)s)
        and month(date_of_joining) = month(%(date)s)
        and employment_type != 'Contract'
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


@frappe.whitelist()
def get_qrcode(input_str):
    qr = qrcode.make(input_str)
    temp = BytesIO()
    qr.save(temp, "PNG")
    temp.seek(0)
    b64 = base64.b64encode(temp.read())
    return "data:image/png;base64,{0}".format(b64.decode("utf-8"))
