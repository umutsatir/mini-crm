<?php

class Database
{
    private static $connection = null;

    public static function getConnection()
    {
        if (self::$connection === null) {
            try {
                $host = Config::get('DB_HOST', 'localhost');
                $dbname = Config::get('DB_NAME', 'minicrm');
                $username = Config::get('DB_USER', 'root');
                $password = Config::get('DB_PASS', '');

                $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
                $options = [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ];

                self::$connection = new PDO($dsn, $username, $password, $options);
            } catch (PDOException $e) {
                throw new Exception("Database connection failed: " . $e->getMessage());
            }
        }

        return self::$connection;
    }

    public static function query($sql, $params = [])
    {
        $pdo = self::getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    public static function fetchAll($sql, $params = [])
    {
        $stmt = self::query($sql, $params);
        return $stmt->fetchAll();
    }

    public static function fetchOne($sql, $params = [])
    {
        $stmt = self::query($sql, $params);
        return $stmt->fetch();
    }

    public static function lastInsertId()
    {
        return self::getConnection()->lastInsertId();
    }
}
