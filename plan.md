## 🛠️ Project Title:

MiniCRM for WhatsApp – Lightweight Customer Tracking Tool

## 🎯 Goal:

Build a lightweight web-based CRM where small business users can log in, manage their customers, write notes, and track follow-up dates. Each customer record should include a quick WhatsApp link.

## ✅ Main Features for MVP:

-   User login / signup (basic auth)
-   Add/edit/delete customers
-   Each customer has:
    -   Name
    -   Phone number
    -   Tags (comma-separated string or simple checkboxes)
    -   Notes
    -   Follow-up date
-   “Today’s Follow-Ups” section (shows only customers with today's date)
-   WhatsApp quick message button (`https://wa.me/90{phone_number}`)

## 🗃️ Database Tables:

### users

-   id (PK)
-   name
-   email (unique)
-   password_hash

### customers

-   id (PK)
-   user_id (FK to users)
-   name
-   phone
-   tags
-   notes
-   follow_up_date

## 🧩 Tech Stack:

-   Frontend: **React + TailwindCSS + shadcn/ui component library**
-   Backend: **Vanilla PHP with Controller structure (MVC style)**
-   DB: MySQL
-   Deployment: start local, later use Railway or cPanel

## 🗂️ Folder Structure Suggestion:

```
/MiniCRM
 ├── /frontend                  # React app with TailwindCSS and shadcn components
 └── /backend                   # Vanilla PHP backend
      ├── /public
      ├── /views
      ├── /src
      │    ├── /controllers
      │    ├── /models
      │    ├── /routes
      │    └── /helpers
      ├── .env
      ├── database.sql
      └── index.php
```

## 🔐 Auth:

Use basic session-based auth. One user can only view/edit their own customers.

## 🖥️ UI Suggestion:

-   Dashboard: “Today’s Follow Ups” + “All Customers”
-   Add/Edit form modal or inline
-   Use **shadcn/ui components** for consistent design and interaction
-   Tailwind cards or list layout
-   Responsive (usable on mobile)

## 🚀 Extension Ideas (not in MVP):

-   Tag filtering (filter customers by tag)
-   Reminder email notifications
-   CSV export of customers
-   WhatsApp message templates (e.g. “Hi [name], your appointment is tomorrow.”)

## 📦 Final Goal:

Have a live MVP where a user can:

-   Register/Login
-   Add their customers
-   See who needs to be followed up today
-   Click to WhatsApp them instantly

Build it in parts. Start from DB + customer list CRUD, then move to login, then UI polish.
