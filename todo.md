# 📝 MiniCRM Project Todo List

## 1. Project Setup

-   [x] Initialize project folder structure (frontend, backend)
-   [x] Set up git repository and .gitignore

## 2. Database & Backend (PHP, MySQL)

### 2.1. Database

-   [x] Design and create MySQL database schema (`users`, `customers` tables)
-   [x] Write `database.sql` for schema and initial test data

### 2.2. Backend Boilerplate

-   [x] Set up backend folder structure (`/public`, `/views`, `/src/controllers`, `/src/models`, `/src/routes`, `/src/helpers`)
-   [x] Create `index.php` entry point
-   [x] Set up environment config (`.env`)
-   [x] Implement DB connection helper

### 2.3. Auth

-   [x] Implement user registration (with password hashing)
-   [x] Implement user login (session-based auth)
-   [x] Implement user logout
-   [x] Middleware: restrict access to authenticated users

### 2.4. Customer CRUD

-   [x] Create Customer model
-   [x] Implement CRUD controllers for customers (add, edit, delete, list)
-   [x] Ensure customers are user-scoped (user can only see/edit their own)
-   [x] Implement route definitions for customer endpoints
-   [x] Add helper for WhatsApp link generation
-   [x] Implement "Today's Follow-Ups" logic (filter customers by today's date)

## 3. Frontend (React + TailwindCSS + shadcn/ui)

### 3.1. Boilerplate & Setup

-   [x] Initialize React app in `/frontend`
-   [x] Set up TailwindCSS
-   [x] Install shadcn/ui components
-   [x] Set up API client (fetch/Axios)

### 3.2. Auth UI

-   [x] Build login/signup forms
-   [x] Handle session state (login/logout)

### 3.3. Customer Management UI

-   [x] Customer list view (all customers)
-   [x] "Today's Follow-Ups" section
-   [x] Add/Edit customer modal or inline form
-   [x] Delete customer action
-   [x] WhatsApp quick message button (link)
-   [x] Tag input (comma-separated or checkboxes)
-   [x] Notes and follow-up date fields
-   [x] Responsive layout (mobile-friendly)

## 4. Integration

-   [x] Connect frontend to backend API (auth, customer CRUD)
-   [x] Test end-to-end flows (register, login, add/edit/delete customer, follow-ups)

## 5. Polish & QA

-   [x] UI polish (shadcn/ui, Tailwind tweaks)
-   [x] Error handling and validation (frontend & backend)
-   [x] Security review (auth, SQL injection, XSS)
-   [x] Final bugfixes

## 6. Deployment (Local MVP)

-   [x] Prepare for local deployment (README, .env.example)
-   [x] Test on local environment

---

## 🚀 Extension Ideas (Post-MVP, not in initial scope)

-   [x] Responsive design
-   [x] Dark/light mode (user can select, hold the current mode)
-   [x] Phone number country code selection (automatically selected based on the location)
-   [x] Tag filtering (frontend & backend)
-   [ ] CSV export of customers
-   [ ] WhatsApp message templates
-   [ ] Reminder email notifications
