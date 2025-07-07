<?php

class WhatsAppHelper
{

    /**
     * Generate WhatsApp link for a phone number
     * 
     * @param string $phone Phone number
     * @param string $message Optional pre-filled message
     * @return string WhatsApp link
     */
    public static function generateLink($phone, $message = '')
    {
        // Remove any non-numeric characters from phone
        $phone = preg_replace('/[^0-9]/', '', $phone);

        // If phone doesn't start with country code, assume it's Turkish (+90)
        if (!preg_match('/^90/', $phone)) {
            $phone = '90' . $phone;
        }

        $link = "https://wa.me/{$phone}";

        // Add message if provided
        if (!empty($message)) {
            $encoded_message = urlencode($message);
            $link .= "?text={$encoded_message}";
        }

        return $link;
    }

    /**
     * Generate a follow-up message template
     * 
     * @param string $customer_name Customer name
     * @param string $custom_message Custom message to append
     * @return string Formatted message
     */
    public static function generateFollowUpMessage($customer_name, $custom_message = '')
    {
        $base_message = "Hi {$customer_name}, I hope you're doing well. ";

        if (!empty($custom_message)) {
            $base_message .= $custom_message;
        } else {
            $base_message .= "I wanted to follow up on our previous conversation. When would be a good time to discuss this further?";
        }

        return $base_message;
    }

    /**
     * Format phone number for display
     * 
     * @param string $phone Raw phone number
     * @return string Formatted phone number
     */
    public static function formatPhone($phone)
    {
        // Remove all non-numeric characters
        $phone = preg_replace('/[^0-9]/', '', $phone);

        // Format Turkish phone numbers
        if (preg_match('/^90(\d{3})(\d{3})(\d{4})$/', $phone, $matches)) {
            return "+90 {$matches[1]} {$matches[2]} {$matches[3]}";
        }

        // Return as is if no specific format matches
        return $phone;
    }
}
