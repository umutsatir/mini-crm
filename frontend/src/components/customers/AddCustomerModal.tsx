import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Calendar } from "../ui/calendar";
import { PhoneInput } from "../ui/phone-input";

interface AddCustomerModalProps {
    onRequestClose: (opts: {
        created?: boolean;
        updated?: boolean;
        customerData?: any;
    }) => void;
    customer?: any;
}

export function AddCustomerModal({
    onRequestClose,
    customer,
}: AddCustomerModalProps) {
    const isEdit = !!customer;
    const [formData, setFormData] = useState({
        name: customer?.name || "",
        phone: customer?.phone || "",
        tags: customer?.tags || "",
        notes: customer?.notes || "",
        follow_up_date: customer?.follow_up_date || "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [closing, setClosing] = useState<
        false | "closed" | "created" | "updated"
    >(false);

    React.useEffect(() => {
        if (closing) {
            const timeout = setTimeout(() => {
                setClosing(false);
                onRequestClose({
                    created: closing === "created",
                    updated: closing === "updated",
                    customerData:
                        closing === "created" || closing === "updated"
                            ? formData
                            : undefined,
                });
            }, 200);
            return () => clearTimeout(timeout);
        }
    }, [closing, onRequestClose]);

    const handleClose = () => {
        setClosing("closed");
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
            newErrors.phone = "Please enter a valid phone number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            if (isEdit) {
                // update
                // You may want to call apiClient.updateCustomer here if needed
                setClosing("updated");
            } else {
                setClosing("created");
            }
        } catch (error) {
            console.error("Error saving customer:", error);
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    function parseLocalDate(dateString: string) {
        const [year, month, day] = dateString.split("-").map(Number);
        return new Date(year, month - 1, day);
    }

    function formatLocalDate(date: Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    if (closing !== false) return null;
    return (
        <div
            className={`fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in-0`}
            style={{ animationDuration: "200ms" }}
        >
            <div
                className={`bg-white dark:bg-slate-900 dark:text-gray-100 rounded-lg shadow-xl max-w-lg w-full border border-gray-200 dark:border-slate-700 animate-in zoom-in-95 fade-in-0`}
                style={{ animationDuration: "200ms" }}
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {isEdit ? "Edit Customer" : "Add New Customer"}
                        </h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Name *
                            </label>
                            <Input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    handleChange("name", e.target.value)
                                }
                                placeholder="Enter customer name"
                                className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Phone Number *
                            </label>
                            <PhoneInput
                                value={formData.phone}
                                onChange={(value) =>
                                    handleChange("phone", value)
                                }
                                placeholder="Enter phone number"
                                className={errors.phone ? "border-red-500" : ""}
                            />
                            {errors.phone && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Tags
                            </label>
                            <Input
                                type="text"
                                value={formData.tags}
                                onChange={(e) =>
                                    handleChange("tags", e.target.value)
                                }
                                placeholder="lead, potential, vip (comma separated)"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Separate tags with commas
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Notes
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) =>
                                    handleChange("notes", e.target.value)
                                }
                                placeholder="Add any notes about this customer..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={3}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Follow-up Date
                            </label>
                            <Calendar
                                mode="single"
                                selected={
                                    formData.follow_up_date
                                        ? parseLocalDate(
                                              formData.follow_up_date
                                          )
                                        : undefined
                                }
                                onSelect={(date) =>
                                    handleChange(
                                        "follow_up_date",
                                        date ? formatLocalDate(date) : ""
                                    )
                                }
                                className="rounded-md border"
                            />
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                className="flex-1"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? isEdit
                                        ? "Saving..."
                                        : "Adding..."
                                    : isEdit
                                    ? "Save Changes"
                                    : "Add Customer"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
