<?php

class SecurityHelper
{

    /**
     * Set security headers
     */
    public static function setSecurityHeaders()
    {
        // CORS headers for development
        if (isset($_SERVER['HTTP_ORIGIN']) && preg_match('/^http:\/\/localhost(:\d+)?$/', $_SERVER['HTTP_ORIGIN'])) {
            header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
        } else {
            header('Access-Control-Allow-Origin: http://localhost:5173'); // fallback for dev
        }
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Access-Control-Allow-Credentials: true');

        // Handle preflight requests
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }

        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: DENY');
        header('X-XSS-Protection: 1; mode=block');
        header('Referrer-Policy: strict-origin-when-cross-origin');
        header('Content-Security-Policy: default-src \'self\'; script-src \'self\' \'unsafe-inline\'; style-src \'self\' \'unsafe-inline\';');
    }

    /**
     * Sanitize input data
     */
    public static function sanitizeInput($data)
    {
        if (is_array($data)) {
            return array_map([self::class, 'sanitizeInput'], $data);
        }

        return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
    }

    /**
     * Validate email format
     */
    public static function validateEmail($email)
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    /**
     * Validate phone number format
     */
    public static function validatePhone($phone)
    {
        // Remove all non-numeric characters
        $clean_phone = preg_replace('/[^0-9]/', '', $phone);

        // Check if it's a valid length (7-15 digits)
        return strlen($clean_phone) >= 7 && strlen($clean_phone) <= 15;
    }
}
