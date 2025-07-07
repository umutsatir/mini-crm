import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { apiClient } from "../../lib/api";
import { CustomerCard } from "./CustomerCard";
import { AddCustomerModal } from "./AddCustomerModal";

interface Customer {
    id: number;
    name: string;
    phone: string;
    tags: string;
    notes: string;
    follow_up_date: string;
    whatsapp_link: string;
    created_at: string;
}

export function CustomerList() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            setLoading(true);
            const response = await apiClient.getCustomers();

            if (response.error) {
                setError(response.error);
                return;
            }

            if (response.data && Array.isArray(response.data)) {
                setCustomers(response.data);
            }
        } catch (err) {
            setError("Failed to load customers");
        } finally {
            setLoading(false);
        }
    };

    const handleAddCustomer = async (customerData: any) => {
        try {
            const response = await apiClient.createCustomer(customerData);

            if (response.error) {
                throw new Error(response.error);
            }

            if (
                response.data &&
                typeof response.data === "object" &&
                "customer" in response.data
            ) {
                setCustomers((prev) => [
                    (response.data as any).customer,
                    ...prev,
                ]);
                setShowAddModal(false);
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to add customer"
            );
        }
    };

    const handleDeleteCustomer = async (id: number) => {
        try {
            const response = await apiClient.deleteCustomer(id);

            if (response.error) {
                throw new Error(response.error);
            }

            setCustomers((prev) =>
                prev.filter((customer) => customer.id !== id)
            );
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to delete customer"
            );
        }
    };

    const filteredCustomers = customers.filter(
        (customer) =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone.includes(searchTerm) ||
            customer.tags.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Loading customers...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                    All Customers
                </h2>
                <Button onClick={() => setShowAddModal(true)}>
                    Add Customer
                </Button>
            </div>

            {error && (
                <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Search customers by name, phone, or tags..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                    <svg
                        className="absolute left-3 top-3 h-4 w-4 text-gray-400"
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

                {filteredCustomers.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <p className="text-gray-500">
                                {searchTerm
                                    ? "No customers found matching your search."
                                    : "No customers yet. Add your first customer!"}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredCustomers.map((customer) => (
                            <CustomerCard
                                key={customer.id}
                                customer={customer}
                                onDelete={handleDeleteCustomer}
                                onUpdate={loadCustomers}
                            />
                        ))}
                    </div>
                )}
            </div>

            {showAddModal && (
                <AddCustomerModal
                    onClose={() => setShowAddModal(false)}
                    onSubmit={handleAddCustomer}
                />
            )}
        </div>
    );
}
