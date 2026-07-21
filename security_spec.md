# Security Specification: Counselling Leads & CRM

## 1. Data Invariants
- A lead must always contain a valid `type` (`booking` or `enquiry`).
- A lead must have a valid `fullName` and `email`.
- A lead's status must only be one of the allowed workflow statuses (`New`, `Contacted`, `Scheduled`, `Archived`).
- The `mainConcern` field, if provided, must not exceed 1000 characters to prevent database resource exhaustion.

## 2. The "Dirty Dozen" Payloads (Targeting the /leads/{leadId} Collection)

The following payloads represent malicious or invalid database writes that must be blocked by our security rules:

1. **Missing Required Type**:
   `{ "fullName": "Alice Smith", "email": "alice@gmail.com", "status": "New" }` (Should fail because `type` is missing).
2. **Invalid Type Field**:
   `{ "type": "malicious_type", "fullName": "Alice Smith", "email": "alice@gmail.com", "status": "New" }` (Should fail due to enum restriction).
3. **Missing Full Name**:
   `{ "type": "booking", "email": "alice@gmail.com", "status": "New" }` (Should fail because `fullName` is required).
4. **Name String Overflow**:
   `{ "type": "booking", "fullName": "A".repeat(150), "email": "alice@gmail.com", "status": "New" }` (Should fail because name size > 100).
5. **Missing Email**:
   `{ "type": "booking", "fullName": "Alice Smith", "status": "New" }` (Should fail because `email` is required).
6. **Email String Overflow**:
   `{ "type": "booking", "fullName": "Alice Smith", "email": "A".repeat(150) + "@gmail.com", "status": "New" }` (Should fail because email size > 100).
7. **Invalid Status Transition**:
   `{ "type": "booking", "fullName": "Alice Smith", "email": "alice@gmail.com", "status": "SuperAdmin" }` (Should fail due to enum restriction).
8. **Malicious SQL/NoSQL Injection in ID**:
   Creating doc with ID `/leads/../../../malicious` (Should fail because of document path constraints).
9. **Concern Field Overflow**:
   `{ "type": "booking", "fullName": "Alice Smith", "email": "alice@gmail.com", "status": "New", "mainConcern": "A".repeat(1005) }` (Should fail because mainConcern size > 1000).
10. **Shadow Fields / Extra Payload Field**:
    `{ "type": "booking", "fullName": "Alice Smith", "email": "alice@gmail.com", "status": "New", "adminSecret": "bypass" }` (Should fail since it contains keys outside the blueprint schema).
11. **Client-Forced Malicious ID injection**:
    Document ID with length > 128 or containing non-alphanumeric characters.
12. **Wrong Field Type**:
    `{ "type": "booking", "fullName": 12345, "email": "alice@gmail.com", "status": "New" }` (Should fail because `fullName` is not a string).

## 3. Test Cases Verification
All 12 "Dirty Dozen" payloads will return `PERMISSION_DENIED` under the validated `firestore.rules` policy below.
