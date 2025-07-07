<?php

class Config
{
    private static $config = [];

    public static function load()
    {
        $env_file = __DIR__ . '/../../.env';

        if (file_exists($env_file)) {
            $lines = file($env_file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

            foreach ($lines as $line) {
                if (strpos($line, '#') === 0) continue; // Skip comments

                $parts = explode('=', $line, 2);
                if (count($parts) === 2) {
                    $key = trim($parts[0]);
                    $value = trim($parts[1]);
                    self::$config[$key] = $value;
                }
            }
        }
    }

    public static function get($key, $default = null)
    {
        if (empty(self::$config)) {
            self::load();
        }

        return self::$config[$key] ?? $default;
    }

    public static function all()
    {
        if (empty(self::$config)) {
            self::load();
        }

        return self::$config;
    }
}
