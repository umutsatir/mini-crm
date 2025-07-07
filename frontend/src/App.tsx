import { useState, useEffect } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { CustomerList, TodaysFollowUps } from "@/components/customers";
import { apiClient } from "@/lib/api";
import { Loader2, Users, LogOut, Bell, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
                            <Users className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                            <span className="text-lg font-medium text-gray-700">
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <Card className="border bg-white/80 backdrop-blur-sm mb-8">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Users className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        MiniCRM Dashboard
                                    </h1>
                                    <p className="mt-1 text-gray-600">
                                        Manage your customers and track
                                        follow-ups
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-200"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content */}
                <div className="space-y-8">
                    {/* Today's Follow-Ups Section */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                <Bell className="w-4 h-4 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Today's Follow-Ups
                            </h2>
                        </div>
                        <TodaysFollowUps />
                    </div>

                    {/* All Customers Section */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                All Customers
                            </h2>
                        </div>
                        <CustomerList />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
