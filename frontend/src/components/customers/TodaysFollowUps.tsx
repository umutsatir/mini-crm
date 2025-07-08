import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { apiClient } from "../../lib/api";

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

interface TodaysFollowUpsProps {
    reloadKey?: number;
    onDataChanged?: () => void;
}

export function TodaysFollowUps({
    reloadKey,
    onDataChanged,
}: TodaysFollowUpsProps) {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadTodaysFollowUps();
        // eslint-disable-next-line
    }, [reloadKey]);

    const loadTodaysFollowUps = async () => {
        try {
            setLoading(true);
            const response = await apiClient.getTodaysFollowUps();

            if ("error" in response && response.error) {
                setError(response.error);
                return;
            }

            if (response.data && Array.isArray(response.data)) {
                setCustomers(response.data);
            }
        } catch (err) {
            setError("Failed to load today's follow-ups");
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-32">
                <div className="text-lg">Loading today's follow-ups...</div>
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <svg
                        className="h-5 w-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>Today's Follow-Ups</span>
                    {customers.length > 0 && (
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {customers.length}
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md mb-4">
                        {error}
                    </div>
                )}

                {customers.length === 0 ? (
                    <div className="text-center py-8">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                            No follow-ups today
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            You're all caught up! No customers scheduled for
                            follow-up today.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3 sm:space-y-4">
                        {customers.map((customer) => (
                            <div
                                key={customer.id}
                                className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg p-3 sm:p-4"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                                            {customer.name}
                                        </h4>
                                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">
                                            {customer.phone}
                                        </p>
                                        {customer.notes && (
                                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                                                {customer.notes}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex space-x-2 sm:ml-4 sm:flex-shrink-0">
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                window.open(
                                                    customer.whatsapp_link,
                                                    "_blank"
                                                )
                                            }
                                            className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm flex-1 sm:flex-none"
                                        >
                                            <svg
                                                className="h-3 w-3 sm:h-4 sm:w-4 mr-1"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                            </svg>
                                            <span className="hidden sm:inline">
                                                Message
                                            </span>
                                            <span className="sm:hidden">
                                                WhatsApp
                                            </span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleDeleteCustomer(
                                                    customer.id
                                                )
                                            }
                                            className="text-red-600 hover:text-red-700 text-xs sm:text-sm flex-1 sm:flex-none"
                                        >
                                            <span className="hidden sm:inline">
                                                Done
                                            </span>
                                            <span className="sm:hidden">✓</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
