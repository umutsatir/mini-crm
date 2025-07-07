import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { EditCustomerModal } from "./EditCustomerModal";

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

interface CustomerCardProps {
    customer: Customer;
    onDelete: (id: number) => void;
    onUpdate: () => void;
}

export function CustomerCard({
    customer,
    onDelete,
    onUpdate,
}: CustomerCardProps) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (
            window.confirm(`Are you sure you want to delete ${customer.name}?`)
        ) {
            setIsDeleting(true);
            await onDelete(customer.id);
            setIsDeleting(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "No follow-up set";
        return new Date(dateString).toLocaleDateString();
    };

    const isFollowUpToday = () => {
        if (!customer.follow_up_date) return false;
        const today = new Date().toISOString().split("T")[0];
        return customer.follow_up_date === today;
    };

    return (
        <>
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-semibold text-gray-900">
                            {customer.name}
                        </CardTitle>
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowEditModal(true)}
                                disabled={isDeleting}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="text-red-600 hover:text-red-700"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <svg
                            className="h-4 w-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                        </svg>
                        <span className="text-sm text-gray-600">
                            {customer.phone}
                        </span>
                    </div>

                    {customer.tags && (
                        <div className="flex flex-wrap gap-1">
                            {customer.tags.split(",").map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                >
                                    {tag.trim()}
                                </span>
                            ))}
                        </div>
                    )}

                    {customer.notes && (
                        <div className="text-sm text-gray-600">
                            <p className="font-medium text-gray-700 mb-1">
                                Notes:
                            </p>
                            <p className="line-clamp-2">{customer.notes}</p>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-sm">
                            <span className="text-gray-500">Follow-up: </span>
                            <span
                                className={
                                    isFollowUpToday()
                                        ? "text-red-600 font-semibold"
                                        : "text-gray-700"
                                }
                            >
                                {formatDate(customer.follow_up_date)}
                            </span>
                        </div>

                        <Button
                            size="sm"
                            onClick={() =>
                                window.open(customer.whatsapp_link, "_blank")
                            }
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <svg
                                className="h-4 w-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                            </svg>
                            WhatsApp
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {showEditModal && (
                <EditCustomerModal
                    customer={customer}
                    onClose={() => setShowEditModal(false)}
                    onSubmit={onUpdate}
                />
            )}
        </>
    );
}
