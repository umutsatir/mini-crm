<?php

class CountryCodeHelper
{
    private static function getCountriesData()
    {
        $file = __DIR__ . '/../../countries.json';
        if (!file_exists($file)) {
            return [];
        }
        $json = file_get_contents($file);
        $countries = json_decode($json, true);
        return is_array($countries) ? $countries : [];
    }

    public static function getAllCountries()
    {
        return self::getCountriesData();
    }

    public static function getPopularCountries()
    {
        $popularCodes = [
            'TR',
            'US',
            'GB',
            'DE',
            'FR',
            'IT',
            'ES',
            'NL',
            'CA',
            'AU',
            'RU',
            'JP',
            'CN',
            'IN',
            'BR',
            'MX',
            'AR',
            'ZA',
            'EG',
            'SA'
        ];
        $all = self::getCountriesData();
        return array_values(array_filter($all, function ($country) use ($popularCodes) {
            return in_array($country['code'], $popularCodes);
        }));
    }

    public static function getFlagEmoji($countryCode)
    {
        // Convert country code to flag emoji using Unicode
        $codePoints = array_map(function ($char) {
            return 127397 + ord($char);
        }, str_split(strtoupper($countryCode)));

        return mb_convert_encoding('&#' . implode(';&#', $codePoints) . ';', 'UTF-8', 'HTML-ENTITIES');
    }

    public static function getCountryByCode($countryCode)
    {
        $countries = self::getPopularCountries();
        foreach ($countries as $country) {
            if ($country['code'] === strtoupper($countryCode)) {
                return $country;
            }
        }
        return null;
    }

    public static function getDefaultCountry()
    {
        // Default to Turkey
        return self::getCountryByCode('TR');
    }

    public static function detectCountryFromIP()
    {
        // Simple IP-based country detection
        // In production, you might want to use a service like MaxMind GeoIP
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';

        // For now, return Turkey as default
        // You can implement actual IP detection later
        return self::getDefaultCountry();
    }
}
