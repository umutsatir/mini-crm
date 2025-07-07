# MiniCRM - WhatsApp Customer Management Tool

A lightweight web-based CRM for small businesses to manage customers, track follow-ups, and quickly message via WhatsApp.

## 🚀 Features

-   **User Authentication**: Register, login, and secure session management
-   **Customer Management**: Add, edit, delete, and search customers
-   **Follow-up Tracking**: "Today's Follow-Ups" section for timely reminders
-   **WhatsApp Integration**: Quick message buttons for instant communication
-   **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

-   **Frontend**: React + TypeScript + TailwindCSS + shadcn/ui
-   **Backend**: Vanilla PHP with MVC structure
-   **Database**: MySQL
-   **Authentication**: JWT tokens

## 📋 Prerequisites

-   PHP 8.0+
-   MySQL 5.7+
-   Node.js 16+
-   Composer (for PHP dependencies)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# If you're starting fresh:
git clone <repository-url>
cd mini-crm

# Or if you're already in the project directory:
cd ~/Sites/mini-crm
```

### 2. Backend Setup

```bash
cd backend

# Install PHP dependencies
composer install

# Create .env file from example
cp env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_NAME=minicrm
# DB_USER=your_username
# DB_PASS=your_password

# Create database and import schema
mysql -u your_username -p -e "CREATE DATABASE minicrm;"
mysql -u your_username -p minicrm < database.sql

# Start PHP development server
php -S localhost:8000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access the Application

-   Frontend: http://localhost:5173
-   Backend API: http://localhost/mini-crm/backend

## 🔐 Default Login Credentials

The database comes with sample users:

-   Email: `john@example.com` / Password: `password123`
-   Email: `jane@example.com` / Password: `password123`

## 📁 Project Structure

```
mini-crm/
├── backend/                 # PHP backend
│   ├── src/
│   │   ├── controllers/    # API controllers
│   │   ├── models/         # Database models
│   │   ├── helpers/        # Utility classes
│   │   └── routes/         # Route definitions
│   ├── database.sql        # Database schema
│   └── index.php           # Entry point
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── lib/           # API client & utilities
│   │   └── App.tsx        # Main app component
│   └── package.json
└── README.md
```

## 🔧 Development

### Backend API Endpoints

-   `GET /` - Check authentication status
-   `POST /api/auth/register` - User registration
-   `POST /api/auth/login` - User login
-   `POST /api/auth/logout` - User logout
-   `GET /api/customers` - List customers
-   `POST /api/customers` - Create customer
-   `PUT /api/customers/{id}` - Update customer
-   `DELETE /api/customers/{id}` - Delete customer
-   `GET /api/customers/followups` - Get today's follow-ups

### Frontend Components

-   `LoginForm` / `RegisterForm` - Authentication
-   `CustomerList` - Main customer management
-   `TodaysFollowUps` - Follow-up tracking
-   `AddCustomerModal` / `EditCustomerModal` - Customer forms
-   `CustomerCard` - Individual customer display

## 🧪 Testing

1. **Register a new user** or use the default credentials
2. **Add customers** with follow-up dates
3. **Test the "Today's Follow-Ups"** section
4. **Use WhatsApp links** to test messaging
5. **Search and filter** customers
6. **Edit and delete** customer records

## 🔒 Security Features

-   JWT-based authentication
-   Password hashing with bcrypt
-   SQL injection prevention
-   XSS protection
-   CORS configuration for development

## 🚀 Deployment

### Local Development

-   Backend: Apache/Nginx with PHP on localhost/mini-crm
-   Frontend: Vite dev server on port 5173

### Production

-   Backend: Deploy to cPanel, Railway, or similar
-   Frontend: Build with `npm run build` and serve static files
-   Database: Use production MySQL instance

## 📝 TODO

-   [ ] Add email notifications for follow-ups
-   [ ] Implement customer tagging system
-   [ ] Add CSV export functionality
-   [ ] Create WhatsApp message templates
-   [ ] Add customer activity history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.
