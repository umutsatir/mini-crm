<?php

require_once __DIR__ . '/../models/Customer.php';

class CustomerController
{

    public function index()
    {
        // Require authentication
        $user = AuthMiddleware::requireAuth();

        $customers_data = Customer::findByUser($user->getId());
        $customers = array_map(function ($data) {
            return (new Customer($data))->toArray();
        }, $customers_data);

        $this->jsonResponse(['customers' => $customers]);
    }

    public function show($id)
    {
        // Require authentication
        $user = AuthMiddleware::requireAuth();

        $customer = Customer::findByIdAndUser($id, $user->getId());

        if (!$customer) {
            $this->jsonResponse(['error' => 'Customer not found'], 404);
            return;
        }

        $this->jsonResponse(['customer' => $customer->toArray()]);
    }

    public function store()
    {
        // Require authentication
        $user = AuthMiddleware::requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->jsonResponse(['error' => 'Method not allowed'], 405);
            return;
        }

        $input = $this->getJsonInput();

        // Validate input
        if (empty($input['name']) || empty($input['phone'])) {
            $this->jsonResponse(['error' => 'Name and phone are required'], 400);
            return;
        }

        // Validate phone number (basic validation)
        if (!preg_match('/^[0-9+\-\s\(\)]+$/', $input['phone'])) {
            $this->jsonResponse(['error' => 'Invalid phone number format'], 400);
            return;
        }

        try {
            $customer = Customer::create(
                $user->getId(),
                $input['name'],
                $input['phone'],
                $input['tags'] ?? '',
                $input['notes'] ?? '',
                $input['follow_up_date'] ?? null
            );

            $this->jsonResponse([
                'message' => 'Customer created successfully',
                'customer' => $customer->toArray()
            ], 201);
        } catch (Exception $e) {
            $this->jsonResponse(['error' => $e->getMessage()], 400);
        }
    }

    public function update($id)
    {
        // Require authentication
        $user = AuthMiddleware::requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            $this->jsonResponse(['error' => 'Method not allowed'], 405);
            return;
        }

        $customer = Customer::findByIdAndUser($id, $user->getId());

        if (!$customer) {
            $this->jsonResponse(['error' => 'Customer not found'], 404);
            return;
        }

        $input = $this->getJsonInput();

        // Validate input
        if (empty($input['name']) || empty($input['phone'])) {
            $this->jsonResponse(['error' => 'Name and phone are required'], 400);
            return;
        }

        // Validate phone number (basic validation)
        if (!preg_match('/^[0-9+\-\s\(\)]+$/', $input['phone'])) {
            $this->jsonResponse(['error' => 'Invalid phone number format'], 400);
            return;
        }

        try {
            $customer->update($input);

            $this->jsonResponse([
                'message' => 'Customer updated successfully',
                'customer' => $customer->toArray()
            ]);
        } catch (Exception $e) {
            $this->jsonResponse(['error' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        // Require authentication
        $user = AuthMiddleware::requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
            $this->jsonResponse(['error' => 'Method not allowed'], 405);
            return;
        }

        $customer = Customer::findByIdAndUser($id, $user->getId());

        if (!$customer) {
            $this->jsonResponse(['error' => 'Customer not found'], 404);
            return;
        }

        try {
            $customer->delete();

            $this->jsonResponse(['message' => 'Customer deleted successfully']);
        } catch (Exception $e) {
            $this->jsonResponse(['error' => $e->getMessage()], 400);
        }
    }

    public function followups()
    {
        // Require authentication
        $user = AuthMiddleware::requireAuth();

        $date = $_GET['date'] ?? null;
        $customers_data = Customer::getFollowUpsByUser($user->getId(), $date);

        $customers = array_map(function ($customer) {
            return $customer->toArray();
        }, $customers_data);

        $this->jsonResponse([
            'followups' => $customers,
            'date' => $date ?? date('Y-m-d')
        ]);
    }

    public function tags()
    {
        // Require authentication
        $user = AuthMiddleware::requireAuth();

        $tags = Customer::getUniqueTagsByUser($user->getId());

        $this->jsonResponse(['tags' => $tags]);
    }

    public function popularTags()
    {
        // Require authentication
        $user = AuthMiddleware::requireAuth();

        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $tags = Customer::getPopularTagsByUser($user->getId(), $limit);

        $this->jsonResponse(['tags' => $tags]);
    }

    public function countries()
    {
        // Countries endpoint is public - no authentication required
        require_once __DIR__ . '/../helpers/CountryCodeHelper.php';

        // Check if user wants all countries or just popular ones
        $all = isset($_GET['all']) && $_GET['all'] === 'true';

        if ($all) {
            $countries = CountryCodeHelper::getAllCountries();
        } else {
            $countries = CountryCodeHelper::getPopularCountries();
        }

        // Add flag emojis to each country
        foreach ($countries as &$country) {
            $country['flag'] = CountryCodeHelper::getFlagEmoji($country['code']);
        }

        $this->jsonResponse(['countries' => $countries]);
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
