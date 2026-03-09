
export const API_URL = import.meta.env.VITE_API_URL || '';

async function handleResponse(response: Response) {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || 'Request failed');
    }
    return response.json();
}

export const api = {
    async getExpenses() {
        const response = await fetch(`${API_URL}/api/expenses`);
        return handleResponse(response);
    },

    async createExpense(expense: any) {
        const response = await fetch(`${API_URL}/api/expenses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expense),
        });
        return handleResponse(response);
    },

    async updateExpense(id: string, expense: any) {
        const response = await fetch(`${API_URL}/api/expenses/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expense),
        });
        return handleResponse(response);
    },

    async deleteExpense(id: string) {
        const response = await fetch(`${API_URL}/api/expenses/${id}`, {
            method: 'DELETE',
        });
        return handleResponse(response);
    },

    async getSettings() {
        const response = await fetch(`${API_URL}/api/settings`);
        return handleResponse(response);
    },

    async updateSettings(settings: any) {
        const response = await fetch(`${API_URL}/api/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings),
        });
        return handleResponse(response);
    },
};
