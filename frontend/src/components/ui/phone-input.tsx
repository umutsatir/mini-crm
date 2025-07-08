import { useState, useEffect } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { apiClient } from "../../lib/api";

interface Country {
    code: string;
    name: string;
    dial_code: string;
    flag?: string;
}

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

// Helper function to generate flag emoji from country code
const getFlagEmoji = (countryCode: string) => {
    const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
};

export function PhoneInput({
    value,
    onChange,
    placeholder = "Phone number",
    className = "",
}: PhoneInputProps) {
    const [countries, setCountries] = useState<Country[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(
        null
    );
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [loading, setLoading] = useState(true);
    const [countrySearchTerm, setCountrySearchTerm] = useState("");

    useEffect(() => {
        loadCountries();
    }, []);

    const loadCountries = async () => {
        try {
            setLoading(true);
            // Load all countries instead of just popular ones
            const response = await apiClient.getCountries(true);

            if ("error" in response && response.error) {
                console.error("Failed to load countries:", response.error);
                return;
            }

            if ("data" in response && response.data) {
                const countriesData = Array.isArray(response.data)
                    ? response.data
                    : response.data.countries || [];
                setCountries(countriesData);
                // Set Turkey as default
                const turkey = countriesData.find(
                    (country: Country) => country.code === "TR"
                );
                setSelectedCountry(turkey || countriesData[0]);
            }
        } catch (err) {
            console.error("Failed to load countries:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCountrySelect = (country: Country) => {
        setSelectedCountry(country);
        setShowCountryDropdown(false);
        setCountrySearchTerm("");

        // Update phone number with new country code
        // Remove any existing country code pattern
        const phoneWithoutCode = value.replace(/^\+\d+\s*/, "");
        const newPhoneNumber =
            `${country.dial_code} ${phoneWithoutCode}`.trim();
        onChange(newPhoneNumber);
    };

    const handleDropdownToggle = () => {
        setShowCountryDropdown(!showCountryDropdown);
        if (!showCountryDropdown) {
            setCountrySearchTerm("");
        }
    };

    // Filter countries based on search term
    const filteredCountries = countries.filter((country) => {
        if (!countrySearchTerm) return true;
        const searchLower = countrySearchTerm.toLowerCase();
        return (
            country.name.toLowerCase().includes(searchLower) ||
            country.dial_code.toLowerCase().includes(searchLower) ||
            country.code.toLowerCase().includes(searchLower)
        );
    });

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // If user starts typing without country code, add the selected country code
        if (!inputValue.startsWith("+") && selectedCountry) {
            onChange(`${selectedCountry.dial_code} ${inputValue}`);
        } else {
            onChange(inputValue);
        }
    };

    const getDisplayValue = () => {
        if (!selectedCountry) return value;

        // Remove country code for display in input
        // Escape special regex characters in dial_code
        const escapedDialCode = selectedCountry.dial_code.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );
        const phoneWithoutCode = value.replace(
            new RegExp(`^${escapedDialCode}\\s*`),
            ""
        );
        return phoneWithoutCode;
    };

    if (loading) {
        return (
            <div className={`flex ${className}`}>
                <div className="flex items-center px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                    <div className="w-6 h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                    <span className="ml-2 text-gray-500 dark:text-gray-400">
                        +--
                    </span>
                </div>
                <Input
                    type="tel"
                    placeholder={placeholder}
                    value=""
                    disabled
                    className="rounded-l-none h-10"
                />
            </div>
        );
    }

    return (
        <div className={`flex ${className}`}>
            {/* Country Code Selector */}
            <div className="relative">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleDropdownToggle}
                    className="flex items-center gap-2 px-3 py-2 h-10 rounded-r-none border-r-0"
                >
                    <span className="text-lg">
                        {selectedCountry
                            ? getFlagEmoji(selectedCountry.code)
                            : "🏳️"}
                    </span>
                    <span className="text-sm font-medium">
                        {selectedCountry?.dial_code || "+--"}
                    </span>
                    <svg
                        className={`w-4 h-4 transition-transform ${
                            showCountryDropdown ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </Button>

                {/* Country Dropdown */}
                {showCountryDropdown && (
                    <div className="absolute top-full left-0 z-50 w-64 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                        {/* Search Input */}
                        <div className="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search countries..."
                                    value={countrySearchTerm}
                                    onChange={(e) =>
                                        setCountrySearchTerm(e.target.value)
                                    }
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    autoFocus
                                />
                                <svg
                                    className="absolute right-3 top-2.5 h-4 w-4 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Countries List */}
                        <div className="max-h-48 overflow-y-auto">
                            {filteredCountries.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                                    No countries found
                                </div>
                            ) : (
                                filteredCountries.map((country) => (
                                    <button
                                        key={country.code}
                                        type="button"
                                        onClick={() =>
                                            handleCountrySelect(country)
                                        }
                                        className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <span className="text-lg">
                                            {getFlagEmoji(country.code)}
                                        </span>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {country.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {country.dial_code}
                                            </div>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Phone Number Input */}
            <Input
                type="tel"
                placeholder={placeholder}
                value={getDisplayValue()}
                onChange={handlePhoneChange}
                className="rounded-l-none flex-1 h-10"
            />
        </div>
    );
}
