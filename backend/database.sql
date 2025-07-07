-- MiniCRM Database Schema

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL
);

-- Customers table
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    tags VARCHAR(255),
    notes TEXT,
    follow_up_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample data
-- Note: Password hashes are for 'password123' - change in production
INSERT INTO users (name, email, password_hash) VALUES
('John Doe', 'john@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Jane Smith', 'jane@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insert sample customers for John Doe (user_id = 1)
INSERT INTO customers (user_id, name, phone, tags, notes, follow_up_date) VALUES
(1, 'Alice Johnson', '905551234567', 'VIP, Regular', 'Interested in premium package', '2024-01-15'),
(1, 'Bob Wilson', '905559876543', 'New', 'First contact made', '2024-01-20'),
(1, 'Carol Brown', '905554567890', 'Follow-up', 'Needs pricing information', '2024-01-10');

-- Insert sample customers for Jane Smith (user_id = 2)
INSERT INTO customers (user_id, name, phone, tags, notes, follow_up_date) VALUES
(2, 'David Lee', '905553456789', 'Hot Lead', 'Ready to close deal', '2024-01-12'),
(2, 'Emma Davis', '905556789012', 'Cold', 'Initial contact needed', '2024-01-25'); 