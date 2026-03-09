export const API_URL = import.meta.env.VITE_API_URL || '';

function getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function handleResponse(response: Response) {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || error.message || 'Request failed');
    }
    if (response.status === 204) return null;
    return response.json();
}

export const api = {
    async getExpenses() {
        const response = await fetch(`${API_URL}/expenses?order=date.desc`, {
            headers: { ...getAuthHeaders() }
        });
        return handleResponse(response);
    },

    async createExpense(expense: any) {
        const response = await fetch(`${API_URL}/expenses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(expense),
        });
        return handleResponse(response);
    },

    async updateExpense(id: string, expense: any) {
        const response = await fetch(`${API_URL}/expenses?id=eq.${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(expense),
        });
        return handleResponse(response);
    },

    async deleteExpense(id: string) {
        const response = await fetch(`${API_URL}/expenses?id=eq.${id}`, {
            method: 'DELETE',
            headers: { ...getAuthHeaders() }
        });
        return handleResponse(response);
    },

    async getSettings() {
        const response = await fetch(`${API_URL}/app_settings?id=eq.1`, {
            headers: { ...getAuthHeaders() }
        });
        return handleResponse(response);
    },

    async updateSettings(settings: any) {
        const dbSettings = {
            partner_a_name: settings.partnerAName || settings.partner_a_name,
            partner_b_name: settings.partnerBName || settings.partner_b_name
        };
        const response = await fetch(`${API_URL}/app_settings?id=eq.1`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(dbSettings),
        });
        return handleResponse(response);
    },
};
