<?php
session_start();

// Load environment variables and helpers
require_once __DIR__ . '/src/helpers/Config.php';
require_once __DIR__ . '/src/helpers/Database.php';
require_once __DIR__ . '/src/helpers/JWTHelper.php';
require_once __DIR__ . '/src/helpers/AuthMiddleware.php';
require_once __DIR__ . '/src/helpers/SecurityHelper.php';

// Set security headers
SecurityHelper::setSecurityHeaders();

// Simple router
$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER['REQUEST_METHOD'];

// Remove base path if exists
$base_path = '/mini-crm/backend';
if (strpos($request_uri, $base_path) === 0) {
    $request_uri = substr($request_uri, strlen($base_path));
}

// Remove query string
$request_uri = parse_url($request_uri, PHP_URL_PATH);

// Route handling
switch ($request_uri) {
    case '/':
    case '':
        require_once __DIR__ . '/src/controllers/AuthController.php';
        $controller = new AuthController();
        $controller->index();
        break;

    case '/api/auth/login':
        require_once __DIR__ . '/src/controllers/AuthController.php';
        $controller = new AuthController();
        $controller->login();
        break;

    case '/api/auth/register':
        require_once __DIR__ . '/src/controllers/AuthController.php';
        $controller = new AuthController();
        $controller->register();
        break;

    case '/api/auth/logout':
        require_once __DIR__ . '/src/controllers/AuthController.php';
        $controller = new AuthController();
        $controller->logout();
        break;

    case '/api/auth/refresh':
        require_once __DIR__ . '/src/controllers/AuthController.php';
        $controller = new AuthController();
        $controller->refresh();
        break;

    case '/api/customers':
        require_once __DIR__ . '/src/controllers/CustomerController.php';
        $controller = new CustomerController();
        if ($request_method === 'GET') {
            $controller->index();
        } elseif ($request_method === 'POST') {
            $controller->store();
        }
        break;

    case '/api/customers/followups':
        require_once __DIR__ . '/src/controllers/CustomerController.php';
        $controller = new CustomerController();
        $controller->followups();
        break;

    default:
        // Handle customer CRUD with ID
        if (preg_match('/^\/api\/customers\/(\d+)$/', $request_uri, $matches)) {
            require_once __DIR__ . '/src/controllers/CustomerController.php';
            $controller = new CustomerController();
            $customer_id = $matches[1];

            if ($request_method === 'GET') {
                $controller->show($customer_id);
            } elseif ($request_method === 'PUT') {
                $controller->update($customer_id);
            } elseif ($request_method === 'DELETE') {
                $controller->destroy($customer_id);
            }
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Not found']);
        }
        break;
}
