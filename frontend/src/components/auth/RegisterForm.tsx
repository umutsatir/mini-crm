import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiClient } from "@/lib/api";
import {
    Loader2,
    Mail,
    Lock,
    User,
    ArrowRight,
    CheckCircle,
} from "lucide-react";

const registerSchema = z
    .object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
    onSuccess: (user: any, token: string) => void;
    onSwitchToLogin: () => void;
}

export function RegisterForm({
    onSuccess,
    onSwitchToLogin,
}: RegisterFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true);
        setError("");

        try {
            const response = await apiClient.register(
                data.name,
                data.email,
                data.password
            );

            if (response.error) {
                setError(response.error);
                return;
            }

            if (
                response.data &&
                typeof response.data === "object" &&
                "token" in response.data &&
                "user" in response.data
            ) {
                const responseData = response.data as {
                    token: string;
                    user: any;
                };
                apiClient.setToken(responseData.token);
                onSuccess(responseData.user, responseData.token);
            }
        } catch (err) {
            setError(
                "An error occurred during registration. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
            <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-900 dark:text-gray-100">
                <CardHeader className="space-y-1 pb-4">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                            <CheckCircle className="w-7 h-7 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                        Create account
                    </CardTitle>
                    <CardDescription className="text-center text-gray-600 dark:text-gray-300">
                        Sign up for your MiniCRM account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            {error && (
                                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 dark:bg-red-900/20 dark:border-red-800">
                                    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                                        <span className="text-white text-xs">
                                            !
                                        </span>
                                    </div>
                                    <span className="text-gray-900 dark:text-gray-100">
                                        {error}
                                    </span>
                                </div>
                            )}

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                            Full Name
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    placeholder="Enter your full name"
                                                    className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:text-gray-100 dark:border-slate-700"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                            Email Address
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    placeholder="Enter your email"
                                                    className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:text-gray-100 dark:border-slate-700"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <Input
                                                    {...field}
                                                    type="password"
                                                    placeholder="Create a password"
                                                    className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:text-gray-100 dark:border-slate-700"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                            Confirm Password
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <Input
                                                    {...field}
                                                    type="password"
                                                    placeholder="Confirm your password"
                                                    className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:text-gray-100 dark:border-slate-700"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 dark:bg-green-700 dark:hover:bg-green-800"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Creating account...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center space-x-2">
                                        <span>Create Account</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                )}
                            </Button>
                        </form>
                    </Form>

                    <Separator className="my-6" />

                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={onSwitchToLogin}
                                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200 dark:text-blue-400 dark:hover:text-blue-500"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
