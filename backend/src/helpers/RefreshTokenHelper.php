<?php

class RefreshTokenHelper
{

    /**
     * Generate a refresh token
     */
    public static function generateRefreshToken($user_id)
    {
        $token = bin2hex(random_bytes(32)); // 64 character random string
        $expires_at = date('Y-m-d H:i:s', strtotime('+30 days'));

        $sql = "INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)";
        Database::query($sql, [$user_id, hash('sha256', $token), $expires_at]);

        return $token;
    }

    /**
     * Validate refresh token
     */
    public static function validateRefreshToken($token)
    {
        $token_hash = hash('sha256', $token);

        $sql = "SELECT rt.*, u.id as user_id, u.email, u.name 
                FROM refresh_tokens rt 
                JOIN users u ON rt.user_id = u.id 
                WHERE rt.token_hash = ? AND rt.expires_at > NOW() AND u.deleted_at IS NULL";

        $result = Database::fetchOne($sql, [$token_hash]);

        if (!$result) {
            return null;
        }

        return [
            'user' => new User($result),
            'refresh_token_id' => $result['id']
        ];
    }

    /**
     * Revoke refresh token
     */
    public static function revokeRefreshToken($token)
    {
        $token_hash = hash('sha256', $token);

        $sql = "DELETE FROM refresh_tokens WHERE token_hash = ?";
        Database::query($sql, [$token_hash]);
    }

    /**
     * Revoke all refresh tokens for a user
     */
    public static function revokeAllUserTokens($user_id)
    {
        $sql = "DELETE FROM refresh_tokens WHERE user_id = ?";
        Database::query($sql, [$user_id]);
    }

    /**
     * Clean expired refresh tokens
     */
    public static function cleanExpiredTokens()
    {
        $sql = "DELETE FROM refresh_tokens WHERE expires_at < NOW()";
        Database::query($sql);
    }

    /**
     * Get active refresh tokens for a user
     */
    public static function getUserTokens($user_id)
    {
        $sql = "SELECT * FROM refresh_tokens WHERE user_id = ? AND expires_at > NOW()";
        return Database::fetchAll($sql, [$user_id]);
    }
}
