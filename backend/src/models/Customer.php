<?php

class Customer
{
    private $id;
    private $user_id;
    private $name;
    private $phone;
    private $tags;
    private $notes;
    private $follow_up_date;
    private $created_at;
    private $updated_at;
    private $deleted_at;

    public function __construct($data = [])
    {
        if (!empty($data)) {
            $this->id = $data['id'] ?? null;
            $this->user_id = $data['user_id'] ?? null;
            $this->name = $data['name'] ?? '';
            $this->phone = $data['phone'] ?? '';
            $this->tags = $data['tags'] ?? '';
            $this->notes = $data['notes'] ?? '';
            $this->follow_up_date = $data['follow_up_date'] ?? null;
            $this->created_at = $data['created_at'] ?? null;
            $this->updated_at = $data['updated_at'] ?? null;
            $this->deleted_at = $data['deleted_at'] ?? null;
        }
    }

    public static function findByUser($user_id, $limit = null, $offset = null)
    {
        $sql = "SELECT * FROM customers WHERE user_id = ? AND deleted_at IS NULL ORDER BY created_at DESC";

        if ($limit !== null) {
            $sql .= " LIMIT ?";
            if ($offset !== null) {
                $sql .= " OFFSET ?";
                return Database::fetchAll($sql, [$user_id, $limit, $offset]);
            }
            return Database::fetchAll($sql, [$user_id, $limit]);
        }

        return Database::fetchAll($sql, [$user_id]);
    }

    public static function findByIdAndUser($id, $user_id)
    {
        $sql = "SELECT * FROM customers WHERE id = ? AND user_id = ? AND deleted_at IS NULL";
        $customer_data = Database::fetchOne($sql, [$id, $user_id]);

        return $customer_data ? new Customer($customer_data) : null;
    }

    public static function getFollowUpsByUser($user_id, $date = null)
    {
        if ($date === null) {
            $date = date('Y-m-d');
        }

        $sql = "SELECT * FROM customers WHERE user_id = ? AND follow_up_date = ? AND deleted_at IS NULL ORDER BY created_at DESC";
        $customers_data = Database::fetchAll($sql, [$user_id, $date]);

        return array_map(function ($data) {
            return new Customer($data);
        }, $customers_data);
    }

    public static function getUniqueTagsByUser($user_id)
    {
        $sql = "SELECT DISTINCT tags FROM customers WHERE user_id = ? AND deleted_at IS NULL AND tags IS NOT NULL AND tags != ''";
        $tags_data = Database::fetchAll($sql, [$user_id]);

        $all_tags = [];
        foreach ($tags_data as $row) {
            if (!empty($row['tags'])) {
                $tags = array_map('trim', explode(',', $row['tags']));
                $all_tags = array_merge($all_tags, $tags);
            }
        }

        // Remove duplicates and empty values
        $unique_tags = array_filter(array_unique($all_tags));
        sort($unique_tags);

        return array_values($unique_tags);
    }

    public static function getPopularTagsByUser($user_id, $limit = 10)
    {
        $sql = "SELECT tags FROM customers WHERE user_id = ? AND deleted_at IS NULL AND tags IS NOT NULL AND tags != ''";
        $tags_data = Database::fetchAll($sql, [$user_id]);

        $tag_counts = [];
        foreach ($tags_data as $row) {
            if (!empty($row['tags'])) {
                $tags = array_map('trim', explode(',', $row['tags']));
                foreach ($tags as $tag) {
                    if (!empty($tag)) {
                        $tag_counts[$tag] = ($tag_counts[$tag] ?? 0) + 1;
                    }
                }
            }
        }

        // Sort by count (descending) and then alphabetically
        arsort($tag_counts);

        // Get top tags
        $popular_tags = array_slice(array_keys($tag_counts), 0, $limit);

        return $popular_tags;
    }

    public static function create($user_id, $name, $phone, $tags = '', $notes = '', $follow_up_date = null)
    {
        $sql = "INSERT INTO customers (user_id, name, phone, tags, notes, follow_up_date) VALUES (?, ?, ?, ?, ?, ?)";
        Database::query($sql, [$user_id, $name, $phone, $tags, $notes, $follow_up_date]);

        $customer_id = Database::lastInsertId();
        return self::findByIdAndUser($customer_id, $user_id);
    }

    public function update($data)
    {
        $sql = "UPDATE customers SET name = ?, phone = ?, tags = ?, notes = ?, follow_up_date = ? WHERE id = ? AND user_id = ?";
        Database::query($sql, [
            $data['name'] ?? $this->name,
            $data['phone'] ?? $this->phone,
            $data['tags'] ?? $this->tags,
            $data['notes'] ?? $this->notes,
            $data['follow_up_date'] ?? $this->follow_up_date,
            $this->id,
            $this->user_id
        ]);

        // Refresh the object
        $updated_data = self::findByIdAndUser($this->id, $this->user_id);
        if ($updated_data) {
            $this->name = $updated_data->name;
            $this->phone = $updated_data->phone;
            $this->tags = $updated_data->tags;
            $this->notes = $updated_data->notes;
            $this->follow_up_date = $updated_data->follow_up_date;
            $this->updated_at = $updated_data->updated_at;
        }

        return $this;
    }

    public function delete()
    {
        // Soft delete
        $sql = "UPDATE customers SET deleted_at = NOW() WHERE id = ? AND user_id = ?";
        Database::query($sql, [$this->id, $this->user_id]);

        $this->deleted_at = date('Y-m-d H:i:s');
        return true;
    }

    public function toArray()
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'phone' => $this->phone,
            'tags' => $this->tags,
            'notes' => $this->notes,
            'follow_up_date' => $this->follow_up_date,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'whatsapp_link' => $this->getWhatsAppLink()
        ];
    }

    public function getWhatsAppLink()
    {
        // Remove any non-numeric characters from phone
        $phone = preg_replace('/[^0-9]/', '', $this->phone);

        // If phone doesn't start with country code, try to detect it
        if (!preg_match('/^[1-9]/', $phone)) {
            // If it starts with 0, remove it and add 90 (Turkey)
            if (preg_match('/^0/', $phone)) {
                $phone = '90' . substr($phone, 1);
            } else {
                // Default to Turkey (+90) if no country code detected
                $phone = '90' . $phone;
            }
        }

        return "https://wa.me/{$phone}";
    }

    // Getters
    public function getId()
    {
        return $this->id;
    }
    public function getUserId()
    {
        return $this->user_id;
    }
    public function getName()
    {
        return $this->name;
    }
    public function getPhone()
    {
        return $this->phone;
    }
    public function getTags()
    {
        return $this->tags;
    }
    public function getNotes()
    {
        return $this->notes;
    }
    public function getFollowUpDate()
    {
        return $this->follow_up_date;
    }
}
