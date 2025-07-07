<?php

class User
{
    private $id;
    private $name;
    private $email;
    private $password_hash;
    private $created_at;
    private $updated_at;
    private $deleted_at;

    public function __construct($data = [])
    {
        if (!empty($data)) {
            $this->id = $data['id'] ?? null;
            $this->name = $data['name'] ?? '';
            $this->email = $data['email'] ?? '';
            $this->password_hash = $data['password_hash'] ?? '';
            $this->created_at = $data['created_at'] ?? null;
            $this->updated_at = $data['updated_at'] ?? null;
            $this->deleted_at = $data['deleted_at'] ?? null;
        }
    }

    public static function findByEmail($email)
    {
        $sql = "SELECT * FROM users WHERE email = ? AND deleted_at IS NULL";
        $user_data = Database::fetchOne($sql, [$email]);

        return $user_data ? new User($user_data) : null;
    }

    public static function findById($id)
    {
        $sql = "SELECT * FROM users WHERE id = ? AND deleted_at IS NULL";
        $user_data = Database::fetchOne($sql, [$id]);

        return $user_data ? new User($user_data) : null;
    }

    public static function create($name, $email, $password)
    {
        // Check if email already exists
        if (self::findByEmail($email)) {
            throw new Exception("Email already exists");
        }

        $password_hash = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)";
        Database::query($sql, [$name, $email, $password_hash]);

        $user_id = Database::lastInsertId();
        return self::findById($user_id);
    }

    public function verifyPassword($password)
    {
        return password_verify($password, $this->password_hash);
    }

    public function toArray()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }

    // Getters
    public function getId()
    {
        return $this->id;
    }
    public function getName()
    {
        return $this->name;
    }
    public function getEmail()
    {
        return $this->email;
    }
}
