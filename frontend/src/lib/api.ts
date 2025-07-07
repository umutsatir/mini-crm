const API_BASE_URL = "http://localhost:8000/backend";

interface ApiResponse<T = any> {
    data?: T;
    error?: string;
    message?: string;
}

class ApiClient {
    private token: string | null = null;

    setToken(token: string) {
        this.token = token;
        localStorage.setItem("token", token);
    }

    getToken(): string | null {
        if (!this.token) {
            this.token = localStorage.getItem("token");
        }
        return this.token;
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem("token");
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = this.getToken();

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            ...(options.headers as Record<string, string>),
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            const data = await response.json();

            // Handle token refresh
            const refreshToken = response.headers.get("X-Token-Refresh");
            if (refreshToken) {
                this.setToken(refreshToken);
            }

            if (!response.ok) {
                return { error: data.error || "Request failed" };
            }

            return { data };
        } catch (error) {
            return { error: "Network error" };
        }
    }

    // Auth endpoints
    async login(email: string, password: string) {
        return this.request("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
    }

    async register(name: string, email: string, password: string) {
        return this.request("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({ name, email, password }),
        });
    }

    async logout() {
        return this.request("/api/auth/logout", {
            method: "POST",
        });
    }

    async refreshToken() {
        return this.request("/api/auth/refresh", {
            method: "POST",
        });
    }

    async checkAuth() {
        return this.request("/");
    }

    // Customer endpoints
    async getCustomers() {
        return this.request("/api/customers");
    }

    async getFollowUps(date?: string) {
        const params = date ? `?date=${date}` : "";
        return this.request(`/api/customers/followups${params}`);
    }

    async getTodaysFollowUps() {
        return this.request("/api/customers/followups");
    }

    async createCustomer(customer: {
        name: string;
        phone: string;
        tags?: string;
        notes?: string;
        follow_up_date?: string;
    }) {
        return this.request("/api/customers", {
            method: "POST",
            body: JSON.stringify(customer),
        });
    }

    async updateCustomer(
        id: number,
        customer: {
            name: string;
            phone: string;
            tags?: string;
            notes?: string;
            follow_up_date?: string;
        }
    ) {
        return this.request(`/api/customers/${id}`, {
            method: "PUT",
            body: JSON.stringify(customer),
        });
    }

    async deleteCustomer(id: number) {
        return this.request(`/api/customers/${id}`, {
            method: "DELETE",
        });
    }
}

export const apiClient = new ApiClient();
