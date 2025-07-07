import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
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

function DeleteCustomerModal({
    open,
    isClosing,
    onClose,
    onConfirm,
    customerName,
}: {
    open: boolean;
    isClosing: boolean;
    onClose: () => void;
    onConfirm: () => void;
    customerName: string;
}) {
    if (!open && !isClosing) return null;
    return (
        <div
            className={`fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in-0 ${
                isClosing ? "animate-out fade-out-0" : ""
            }`}
            style={{ animationDuration: "200ms" }}
        >
            <div
                className={`bg-white rounded-lg shadow-xl max-w-sm w-full animate-in zoom-in-95 fade-in-0 ${
                    isClosing ? "animate-out zoom-out-95 fade-out-0" : ""
                }`}
                style={{ animationDuration: "200ms" }}
            >
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Delete Customer
                    </h2>
                    <p className="text-gray-700 mb-6">
                        Are you sure you want to delete{" "}
                        <span className="font-bold">{customerName}</span>? This
                        action cannot be undone.
                    </p>
                    <div className="flex space-x-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={onConfirm}
                            className="flex-1"
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function CustomerList({ reloadKey }: { reloadKey?: number }) {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [isAddModalClosing, setIsAddModalClosing] = useState(false);
    const [viewType, setViewType] = useState<"card" | "list">("card");
    const [sortType, setSortType] = useState<
        "created-desc" | "date-desc" | "date-asc" | "name-asc" | "name-desc"
    >("created-desc");
    const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleteModalClosing, setIsDeleteModalClosing] = useState(false);
    const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        loadCustomers();
    }, [reloadKey]);

    const loadCustomers = async () => {
        try {
            setLoading(true);
            const response = await apiClient.getCustomers();

            if ("error" in response && response.error) {
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

    const handleDeleteClick = (customer: Customer) => {
        setDeleteCustomer(customer);
        setShowDeleteModal(true);
        setIsDeleteModalClosing(false);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteCustomer) return;
        setIsDeleting(true);
        await handleDeleteCustomer(deleteCustomer.id);
        setIsDeleting(false);
        handleCloseDeleteModal();
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalClosing(true);
        setTimeout(() => {
            setShowDeleteModal(false);
            setIsDeleteModalClosing(false);
            setDeleteCustomer(null);
        }, 200);
    };

    // Sorting logic
    const sortedCustomers = [...customers].sort((a, b) => {
        if (sortType === "created-desc") {
            return (b.created_at || "").localeCompare(a.created_at || "");
        } else if (sortType === "date-desc") {
            return (b.follow_up_date || "").localeCompare(
                a.follow_up_date || ""
            );
        } else if (sortType === "date-asc") {
            return (a.follow_up_date || "").localeCompare(
                b.follow_up_date || ""
            );
        } else if (sortType === "name-asc") {
            return a.name.localeCompare(b.name);
        } else if (sortType === "name-desc") {
            return b.name.localeCompare(a.name);
        }
        return 0;
    });

    const filteredCustomers = sortedCustomers.filter(
        (customer) =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone.includes(searchTerm) ||
            customer.tags.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Add modal open/close logic
    const handleOpenAddModal = () => {
        setShowAddModal(true);
        setIsAddModalClosing(false);
    };
    const handleCloseAddModal = () => {
        setIsAddModalClosing(true);
        setTimeout(() => {
            setShowAddModal(false);
            setIsAddModalClosing(false);
        }, 200);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Loading customers...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Add Customer button moved to parent */}

            {error && (
                <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div className="relative flex items-center gap-2">
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
                    {/* View toggle */}
                    <div className="flex items-center gap-1 ml-2">
                        <Button
                            variant={
                                viewType === "card" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setViewType("card")}
                            className={
                                viewType === "card"
                                    ? "bg-blue-600 text-white"
                                    : ""
                            }
                        >
                            🗂️
                        </Button>
                        <Button
                            variant={
                                viewType === "list" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setViewType("list")}
                            className={
                                viewType === "list"
                                    ? "bg-blue-600 text-white"
                                    : ""
                            }
                        >
                            📋
                        </Button>
                    </div>
                    {/* Sort select */}
                    <select
                        className="ml-2 border rounded px-2 py-1 text-sm"
                        value={sortType}
                        onChange={(e) => setSortType(e.target.value as any)}
                    >
                        <option value="created-desc">
                            Sort by creation date
                        </option>
                        <option value="date-desc">
                            Sort by follow-up date: Newest → Oldest
                        </option>
                        <option value="date-asc">
                            Sort by follow-up date: Oldest → Newest
                        </option>
                        <option value="name-asc">Sort by name: A → Z</option>
                        <option value="name-desc">Sort by name: Z → A</option>
                    </select>
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
                ) : viewType === "card" ? (
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
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border rounded shadow text-sm">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase text-xs">
                                        Name
                                    </th>
                                    <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase text-xs">
                                        Phone
                                    </th>
                                    <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase text-xs">
                                        Tags
                                    </th>
                                    <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase text-xs">
                                        Notes
                                    </th>
                                    <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase text-xs">
                                        Follow-up Date
                                    </th>
                                    <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase text-xs">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="border-t">
                                        <td className="px-4 py-2 font-semibold">
                                            {customer.name}
                                        </td>
                                        <td className="px-4 py-2">
                                            {customer.phone}
                                        </td>
                                        <td className="px-4 py-2">
                                            {customer.tags}
                                        </td>
                                        <td className="px-4 py-2">
                                            {customer.notes}
                                        </td>
                                        <td className="px-4 py-2">
                                            {customer.follow_up_date || "-"}
                                        </td>
                                        <td className="px-4 py-2 space-x-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    setEditCustomer(customer)
                                                }
                                                className="text-blue-600"
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    handleDeleteClick(customer)
                                                }
                                                className="text-red-600"
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showAddModal || isAddModalClosing ? (
                <AddCustomerModal onRequestClose={handleCloseAddModal} />
            ) : null}
            {editCustomer && (
                <AddCustomerModal
                    onRequestClose={() => setEditCustomer(null)}
                    customer={editCustomer}
                />
            )}
            {(showDeleteModal || isDeleteModalClosing) && deleteCustomer && (
                <DeleteCustomerModal
                    open={showDeleteModal}
                    isClosing={isDeleteModalClosing}
                    onClose={handleCloseDeleteModal}
                    onConfirm={handleDeleteConfirm}
                    customerName={deleteCustomer.name}
                />
            )}
        </div>
    );
}
