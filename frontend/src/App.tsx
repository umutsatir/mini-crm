import { useState, useEffect } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { CustomerList, TodaysFollowUps } from "@/components/customers";
import { apiClient, setOnTokenExpired } from "@/lib/api";
import { Loader2, Users, LogOut, Bell, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AddCustomerModal } from "@/components/customers/AddCustomerModal";
import { ThemeToggle } from "@/components/ui/theme-toggle";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        checkAuthStatus();
        setOnTokenExpired(() => {
            apiClient.clearToken();
            setIsAuthenticated(false);
        });
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = apiClient.getToken();
            if (token) {
                const response = await apiClient.checkAuth();
                if (response.data && !response.error) {
                    setIsAuthenticated(true);
                } else {
                    apiClient.clearToken();
                }
            }
        } catch (error) {
            apiClient.clearToken();
        } finally {
            setLoading(false);
        }
    };

    const handleLoginSuccess = (_user: any, _token: string) => {
        setIsAuthenticated(true);
    };

    const handleLogout = async () => {
        try {
            await apiClient.logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            apiClient.clearToken();
            setIsAuthenticated(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
                            <Users className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                            <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                Loading MiniCRM...
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <>
                {showRegister ? (
                    <RegisterForm
                        onSuccess={handleLoginSuccess}
                        onSwitchToLogin={() => setShowRegister(false)}
                    />
                ) : (
                    <LoginForm
                        onSuccess={handleLoginSuccess}
                        onSwitchToRegister={() => setShowRegister(true)}
                    />
                )}
            </>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="max-w-7xl mx-auto py-4 sm:py-6 px-3 sm:px-4 lg:px-8">
                {/* Header */}
                <Card className="border bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm mb-6 sm:mb-8">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                            <div className="flex items-center space-x-3 sm:space-x-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                    <Users className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">
                                        MiniCRM Dashboard
                                    </h1>
                                    <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-300 truncate">
                                        Manage your customers and track
                                        follow-ups
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                                <ThemeToggle />
                                <Button
                                    onClick={handleLogout}
                                    variant="outline"
                                    size="sm"
                                    className="w-full max-w-xs sm:w-auto border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 dark:hover:border-red-700 transition-all duration-200"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content */}
                <div className="space-y-6 sm:space-y-8">
                    {/* Today's Follow-Ups Section */}
                    <div>
                        <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Bell className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            </div>
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                                Today's Follow-Ups
                            </h2>
                        </div>
                        <TodaysFollowUps
                            reloadKey={reloadKey}
                            onDataChanged={() => setReloadKey((k) => k + 1)}
                        />
                    </div>

                    {/* All Customers Section */}
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                </div>
                                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                                    All Customers
                                </h2>
                            </div>
                            <Button
                                onClick={() => setShowAddModal(true)}
                                size="sm"
                                className="w-full max-w-xs sm:w-auto dark:bg-blue-700 dark:text-white dark:hover:bg-blue-800"
                            >
                                Add Customer
                            </Button>
                        </div>
                        <CustomerList
                            reloadKey={reloadKey}
                            onDataChanged={() => setReloadKey((k) => k + 1)}
                        />
                        {showAddModal && (
                            <AddCustomerModal
                                onRequestClose={async ({
                                    created,
                                    customerData,
                                }) => {
                                    if (created && customerData) {
                                        try {
                                            const response =
                                                await apiClient.createCustomer(
                                                    customerData
                                                );
                                            if (response.error)
                                                throw new Error(response.error);
                                            setReloadKey((k) => k + 1);
                                        } catch (err) {
                                            alert(
                                                err instanceof Error
                                                    ? err.message
                                                    : "Failed to add customer"
                                            );
                                        }
                                    }
                                    setShowAddModal(false);
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
