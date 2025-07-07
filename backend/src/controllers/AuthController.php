<?php

class AuthController
{

    public function index()
    {
        // Check if user is already authenticated via JWT
        $user = AuthMiddleware::optionalAuth();

        if ($user) {
            $this->jsonResponse([
                'authenticated' => true,
                'user' => $user->toArray(),
                'token' => JWTHelper::generateToken($user)
            ]);
        } else {
            $this->jsonResponse(['authenticated' => false]);
        }
    }

    public function register()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->jsonResponse(['error' => 'Method not allowed'], 405);
            return;
        }

        $input = $this->getJsonInput();

        // Validate input
        if (empty($input['name']) || empty($input['email']) || empty($input['password'])) {
            $this->jsonResponse(['error' => 'Name, email, and password are required'], 400);
            return;
        }

        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            $this->jsonResponse(['error' => 'Invalid email format'], 400);
            return;
        }

        if (strlen($input['password']) < 6) {
            $this->jsonResponse(['error' => 'Password must be at least 6 characters'], 400);
            return;
        }

        try {
            $user = User::create($input['name'], $input['email'], $input['password']);

            // Generate JWT token
            $token = JWTHelper::generateToken($user);

            $this->jsonResponse([
                'message' => 'User registered successfully',
                'user' => $user->toArray(),
                'token' => $token
            ]);
        } catch (Exception $e) {
            $this->jsonResponse(['error' => $e->getMessage()], 400);
        }
    }

    public function login()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->jsonResponse(['error' => 'Method not allowed'], 405);
            return;
        }

        $input = $this->getJsonInput();

        // Validate input
        if (empty($input['email']) || empty($input['password'])) {
            $this->jsonResponse(['error' => 'Email and password are required'], 400);
            return;
        }

        // Find user by email
        $user = User::findByEmail($input['email']);

        if (!$user || !$user->verifyPassword($input['password'])) {
            $this->jsonResponse(['error' => 'Invalid email or password'], 401);
            return;
        }

        // Generate JWT token
        $token = JWTHelper::generateToken($user);

        $this->jsonResponse([
            'message' => 'Login successful',
            'user' => $user->toArray(),
            'token' => $token
        ]);
    }

    public function logout()
    {
        // With JWT, logout is handled client-side by removing the token
        // Server-side, we could implement a blacklist if needed
        $this->jsonResponse(['message' => 'Logged out successfully']);
    }

    public function refresh()
    {
        $token = JWTHelper::getTokenFromHeader();

        if (!$token) {
            $this->jsonResponse(['error' => 'Token required'], 401);
            return;
        }

        try {
            $new_token = JWTHelper::refreshToken($token);
            $user = JWTHelper::getUserFromToken($new_token);

            $this->jsonResponse([
                'message' => 'Token refreshed successfully',
                'user' => $user->toArray(),
                'token' => $new_token
            ]);
        } catch (Exception $e) {
            $this->jsonResponse(['error' => $e->getMessage()], 401);
        }
    }

    private function getJsonInput()
    {
        $input = file_get_contents('php://input');
        return json_decode($input, true) ?? [];
    }

    private function jsonResponse($data, $status_code = 200)
    {
        http_response_code($status_code);
        header('Content-Type: application/json');
        echo json_encode($data);
    }
}
