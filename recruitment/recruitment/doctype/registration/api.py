import frappe
import shortuuid
from frappe import _
from frappe.utils.data import today
from frappe.utils import datetime,nowdate, add_days

@frappe.whitelist()
def confirm_register(name,testid):
 candidate = frappe.db.get_value("Registration", name, "name")
 get_candidate = frappe.get_doc("Registration",candidate)
 token = frappe.db.get("Token Summary", {"token": testid})
 if testid == token.token:
     frappe.db.set_value("Registration", candidate, "test_id", testid)
     frappe.db.set_value("Registration", candidate, "status", "Registered")
     frappe.db.set_value("Token Summary",token.name,"validity","Invalid")
     return testid
 else:
    frappe.msgprint("Invalid or Expired Token.")


@frappe.whitelist()
def generate_token(token_type,no_of_tokens):
 for tokens in no_of_tokens:
   new_token = frappe.new_doc("Token Summary")
   new_token.token = shortuuid.ShortUUID().random(length=10)
   if token_type == 'Domestic':
    new_token.value='Domestic'
   else:
    new_token.value='International'
   new_token.save()
