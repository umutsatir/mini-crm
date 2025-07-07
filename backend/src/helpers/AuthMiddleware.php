<?php

class AuthMiddleware
{

    public static function requireAuth()
    {
        $token = JWTHelper::getTokenFromHeader();

        if (!$token) {
            http_response_code(401);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Authorization token required']);
            exit;
        }

        try {
            $user = JWTHelper::getUserFromToken($token);

            // Check if token is expiring soon and add refresh header
            if (JWTHelper::isTokenExpiringSoon($token)) {
                $new_token = JWTHelper::refreshToken($token);
                header('X-Token-Refresh: ' . $new_token);
            }

            return $user;
        } catch (Exception $e) {
            http_response_code(401);
            header('Content-Type: application/json');
            echo json_encode(['error' => $e->getMessage()]);
            exit;
        }
    }

    public static function getCurrentUser()
    {
        $token = JWTHelper::getTokenFromHeader();

        if (!$token) {
            return null;
        }

        try {
            return JWTHelper::getUserFromToken($token);
        } catch (Exception $e) {
            return null;
        }
    }

    public static function isLoggedIn()
    {
        return self::getCurrentUser() !== null;
    }

    public static function optionalAuth()
    {
        $token = JWTHelper::getTokenFromHeader();

        if (!$token) {
            return null;
        }

        try {
            $user = JWTHelper::getUserFromToken($token);

            // Check if token is expiring soon and add refresh header
            if (JWTHelper::isTokenExpiringSoon($token)) {
                $new_token = JWTHelper::refreshToken($token);
                header('X-Token-Refresh: ' . $new_token);
            }

            return $user;
        } catch (Exception $e) {
            return null;
        }
    }
}
