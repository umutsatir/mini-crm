import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { apiClient } from "../../lib/api";
import { CustomerCard } from "./CustomerCard";
import { AddCustomerModal } from "./AddCustomerModal";
import { TagFilter } from "./TagFilter";

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
            className={`fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in-0 ${
                isClosing ? "animate-out fade-out-0" : ""
            }`}
            style={{ animationDuration: "200ms" }}
        >
            <div
                className={`bg-white dark:bg-slate-900 dark:text-gray-100 rounded-lg shadow-xl max-w-sm w-full animate-in zoom-in-95 fade-in-0 border border-gray-200 dark:border-slate-700 ${
                    isClosing ? "animate-out zoom-out-95 fade-out-0" : ""
                }`}
                style={{ animationDuration: "200ms" }}
            >
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Delete Customer
                    </h2>
                    <p className="text-gray-700 dark:text-gray-200 mb-6">
                        Are you sure you want to delete{" "}
                        <span className="font-bold">{customerName}</span>? This
                        action cannot be undone.
                    </p>
                    <div className="flex space-x-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 dark:bg-slate-800 dark:text-gray-100 dark:border-slate-700"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={onConfirm}
                            className="flex-1 dark:bg-red-800 dark:text-white dark:border-red-900"
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function CustomerList({
    reloadKey,
    onDataChanged,
}: {
    reloadKey?: number;
    onDataChanged?: () => void;
}) {
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
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // Ensure selectedTags is always an array of strings
    const safeSelectedTags = selectedTags.filter(
        (tag) => tag != null && typeof tag === "string"
    );

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

    const handleDeleteCustomer = async (id: number) => {
        try {
            const response = await apiClient.deleteCustomer(id);

            if (response.error) {
                throw new Error(response.error);
            }

            setCustomers((prev) =>
                prev.filter((customer) => customer.id !== id)
            );
            if (onDataChanged) onDataChanged();
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

    const filteredCustomers = sortedCustomers.filter((customer) => {
        // Text search filter
        const matchesSearch =
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone.includes(searchTerm) ||
            customer.tags.toLowerCase().includes(searchTerm.toLowerCase());

        // Tag filter
        const matchesTags =
            safeSelectedTags.length === 0 ||
            safeSelectedTags.some((selectedTag) => {
                const tagString = selectedTag.trim();
                if (!tagString) return false;

                return customer.tags
                    .split(",")
                    .map((tag) => tag.trim().toLowerCase())
                    .includes(tagString.toLowerCase());
            });

        return matchesSearch && matchesTags;
    });

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
                <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {/* Search and Controls */}
                <div className="space-y-3">
                    {/* Search Bar */}
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

                    {/* Controls Row */}
                    <div className="flex flex-col gap-3">
                        {/* Tag Filter */}
                        <TagFilter
                            selectedTags={safeSelectedTags}
                            onTagChange={(tags) => {
                                // Convert all tags to strings and filter out empty ones
                                const validTags = tags
                                    .map((tag) => String(tag).trim())
                                    .filter((tag) => tag.length > 0);
                                setSelectedTags(validTags);
                            }}
                        />

                        {/* View and Sort Controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            {/* View toggle */}
                            <div className="flex items-center gap-1">
                                <span className="text-sm text-gray-600 mr-2">
                                    View:
                                </span>
                                <Button
                                    variant={
                                        viewType === "card"
                                            ? "default"
                                            : "outline"
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
                                        viewType === "list"
                                            ? "default"
                                            : "outline"
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
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                    Sort:
                                </span>
                                <select
                                    className="border rounded px-2 py-1 text-sm bg-white dark:bg-slate-800 dark:text-gray-100 dark:border-slate-700"
                                    value={sortType}
                                    onChange={(e) =>
                                        setSortType(e.target.value as any)
                                    }
                                >
                                    <option value="created-desc">
                                        Newest first
                                    </option>
                                    <option value="date-desc">
                                        Follow-up: Newest → Oldest
                                    </option>
                                    <option value="date-asc">
                                        Follow-up: Oldest → Newest
                                    </option>
                                    <option value="name-asc">
                                        Name: A → Z
                                    </option>
                                    <option value="name-desc">
                                        Name: Z → A
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {filteredCustomers.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <p className="text-gray-500 dark:text-gray-400">
                                {searchTerm
                                    ? "No customers found matching your search."
                                    : "No customers yet. Add your first customer!"}
                            </p>
                        </CardContent>
                    </Card>
                ) : viewType === "card" ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredCustomers.map((customer) => (
                            <div
                                key={customer.id}
                                className="min-w-0 max-w-full break-words"
                            >
                                <CustomerCard
                                    customer={customer}
                                    onDelete={handleDeleteCustomer}
                                    onUpdate={loadCustomers}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white dark:bg-slate-800 border rounded shadow text-sm">
                            <thead>
                                <tr>
                                    <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase text-xs">
                                        Name
                                    </th>
                                    <th className="hidden sm:table-cell px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase text-xs">
                                        Phone
                                    </th>
                                    <th className="hidden lg:table-cell px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase text-xs">
                                        Tags
                                    </th>
                                    <th className="hidden xl:table-cell px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase text-xs">
                                        Notes
                                    </th>
                                    <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase text-xs">
                                        Follow-up
                                    </th>
                                    <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase text-xs">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.map((customer) => (
                                    <tr
                                        key={customer.id}
                                        className="border-t hover:bg-gray-50 dark:hover:bg-slate-700"
                                    >
                                        <td className="px-2 sm:px-4 py-2 font-semibold text-sm">
                                            <div>
                                                <div className="font-semibold text-gray-900 dark:text-white">
                                                    {customer.name}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 sm:hidden">
                                                    {customer.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden sm:table-cell px-4 py-2 text-sm text-gray-900 dark:text-white">
                                            {customer.phone}
                                        </td>
                                        <td className="hidden lg:table-cell px-4 py-2 text-sm max-w-32 truncate text-gray-900 dark:text-white">
                                            {customer.tags}
                                        </td>
                                        <td className="hidden xl:table-cell px-4 py-2 text-sm max-w-48 truncate text-gray-900 dark:text-white">
                                            {customer.notes}
                                        </td>
                                        <td className="px-2 sm:px-4 py-2 text-sm text-gray-900 dark:text-white">
                                            {customer.follow_up_date || "-"}
                                        </td>
                                        <td className="px-2 sm:px-4 py-2">
                                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        setEditCustomer(
                                                            customer
                                                        )
                                                    }
                                                    className="text-blue-600 text-xs"
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleDeleteClick(
                                                            customer
                                                        )
                                                    }
                                                    className="text-red-600 text-xs"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

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
