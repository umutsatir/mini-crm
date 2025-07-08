const API_BASE_URL = "http://localhost/mini-crm/backend";

interface ApiResponse<T = any> {
    data?: T;
    error?: string;
    message?: string;
}

interface CustomersResponse {
    customers: any[];
}

interface FollowUpsResponse {
    followups: any[];
    date: string;
}

class ApiClient {
    static onTokenExpired: (() => void) | null = null;
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
                if (
                    typeof data.error === "string" &&
                    data.error.toLowerCase().includes("token expired")
                ) {
                    this.clearToken();
                    if (ApiClient.onTokenExpired) ApiClient.onTokenExpired();
                }
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
        const response = await this.request<CustomersResponse>(
            "/api/customers"
        );
        if (response.data && response.data.customers) {
            return { data: response.data.customers };
        }
        return response;
    }

    async getFollowUps(date?: string) {
        const params = date ? `?date=${date}` : "";
        const response = await this.request<FollowUpsResponse>(
            `/api/customers/followups${params}`
        );
        if (response.data && response.data.followups) {
            return { data: response.data.followups };
        }
        return response;
    }

    async getTodaysFollowUps() {
        const response = await this.request<FollowUpsResponse>(
            "/api/customers/followups"
        );
        if (response.data && response.data.followups) {
            return { data: response.data.followups };
        }
        return response;
    }

    async getTags() {
        const response = await this.request<{ tags: string[] }>(
            "/api/customers/tags"
        );
        if (response.data && response.data.tags) {
            return { data: response.data.tags };
        }
        return response;
    }

    async getPopularTags(limit: number = 10) {
        const response = await this.request<{ tags: string[] }>(
            `/api/customers/popular-tags?limit=${limit}`
        );
        if (response.data && response.data.tags) {
            return { data: response.data.tags };
        }
        return response;
    }

    async getCountries(all: boolean = false) {
        const params = all ? "?all=true" : "";
        const response = await this.request<{ countries: any[] }>(
            `/api/customers/countries${params}`
        );
        if (response.data && response.data.countries) {
            return { data: response.data.countries };
        }
        return response;
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
export function setOnTokenExpired(cb: () => void) {
    ApiClient.onTokenExpired = cb;
}
