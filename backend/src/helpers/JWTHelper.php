<?php

require_once __DIR__ . '/../../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JWTHelper
{
    private static $secret_key;
    private static $algorithm = 'HS256';
    private static $expiration_time = 3600; // 1 hour

    public static function init()
    {
        self::$secret_key = Config::get('JWT_SECRET', 'your-secret-key-change-in-production');
    }

    /**
     * Generate JWT token for user
     */
    public static function generateToken($user)
    {
        self::init();

        $payload = [
            'user_id' => $user->getId(),
            'email' => $user->getEmail(),
            'name' => $user->getName(),
            'iat' => time(),
            'exp' => time() + self::$expiration_time,
            'iss' => Config::get('APP_NAME', 'MiniCRM'),
            'aud' => Config::get('APP_URL', 'http://localhost')
        ];

        return JWT::encode($payload, self::$secret_key, self::$algorithm);
    }

    /**
     * Validate and decode JWT token
     */
    public static function validateToken($token)
    {
        self::init();

        try {
            $decoded = JWT::decode($token, new Key(self::$secret_key, self::$algorithm));

            // Check if token is expired
            if ($decoded->exp < time()) {
                throw new Exception('Token expired');
            }

            return $decoded;
        } catch (Exception $e) {
            throw new Exception('Invalid token: ' . $e->getMessage());
        }
    }

    /**
     * Get user from JWT token
     */
    public static function getUserFromToken($token)
    {
        $decoded = self::validateToken($token);

        // Get user from database
        $user = User::findById($decoded->user_id);

        if (!$user) {
            throw new Exception('User not found');
        }

        return $user;
    }

    /**
     * Refresh JWT token
     */
    public static function refreshToken($token)
    {
        $decoded = self::validateToken($token);

        // Get user from database
        $user = User::findById($decoded->user_id);

        if (!$user) {
            throw new Exception('User not found');
        }

        // Generate new token
        return self::generateToken($user);
    }

    /**
     * Get token from Authorization header
     */
    public static function getTokenFromHeader()
    {
        $headers = getallheaders();

        if (isset($headers['Authorization'])) {
            $auth_header = $headers['Authorization'];

            if (preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
                return $matches[1];
            }
        }

        return null;
    }

    /**
     * Check if token is about to expire (within 5 minutes)
     */
    public static function isTokenExpiringSoon($token)
    {
        try {
            $decoded = JWT::decode($token, new Key(self::$secret_key, self::$algorithm));
            $time_until_expiry = $decoded->exp - time();

            return $time_until_expiry <= 300; // 5 minutes
        } catch (Exception $e) {
            return false;
        }
    }
}
