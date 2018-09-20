// // Copyright (c) 2016, VHRS and contributors
// // For license information, please see license.txt

// frappe.ui.form.on('Associate', {
//     terms_and_condition: function (frm) {
//         if (frm.doc.terms_and_condition) {
//             frm.set_value("empanelment_level", "L1 - Terms Accepted")
//         } else {
//             frm.set_value("empanelment_level", "L0 - Identified")
//         }
//     },

//     aerp_attachment: function (frm) {
//         if (frm.doc.aerp_attachment) {
//             frm.set_value("empanelment_level", "L2 - AERP Completed")
//         } else if (frm.doc.terms_and_condition || frm.doc.aerp_attachment == NULL) {
//             frm.set_value("empanelment_level", "L0 - Identified")
//         } else {
//             frm.set_value("empanelment_level", "L1- Terms Accepted")
//         }
//     },
//     l3_manager_visited_by: function (frm) {
//         if (frm.doc.l3_manager_visited_by) {
//             frm.set_value("empanelment_level", "L3 - Manager Executive visit completed")
//         } else if (frm.doc.terms_and_condition || frm.doc.aerp_attachment || frm.doc.l3_manager_visited_by == NULL) {
//             frm.set_value("empanelment_level", "L0 - Identified")
//         } else {
//             frm.set_value("empanelment_level", "L2 - AERP Completed")
//         }
//     },
//     l4_heads_visited_by: function (frm) {
//         if (frm.doc.l4_heads_visited_by) {
//             frm.set_value("empanelment_level", "L4 - TH,DIrector visit completed")
//         } else if (frm.doc.terms_and_condition || frm.doc.aerp_attachment || frm.doc.l3_manager_visited_by || frm.doc.l4_heads_visited_by == NULL) {
//             frm.set_value("empanelment_level", "L0 - Identified")
//         } else {
//             frm.set_value("empanelment_level", "L3 - Manager Executive visit completed")
//         }
//     },
//     l5_trusted_by: function (frm) {
//         if (frm.doc.l5_trusted_by) {
//             frm.set_value("empanelment_level", "L5 - Trusted Associate")
//         } else if (frm.doc.terms_and_condition || frm.doc.aerp_attachment || frm.doc.l3_manager_visited_by || frm.doc.l4_heads_visited_by || frm.doc.l5_trusted_by == NULL) {
//             frm.set_value("empanelment_level", "L0 - Identified")
//         } else {
//             frm.set_value("empanelment_level", "L4 - TH,DIrector visit completed")
//         }
//     },
// });


