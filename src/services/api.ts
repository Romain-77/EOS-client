import api from "./api.service"; 
import { CategoryWithStats, Note, StreakResponse } from "../interfaces/types";

export const getCategories = async () => {
    const response = await api.get("/categories");
    return response.data;
};

export const getDailyStats = async (): Promise<CategoryWithStats[]> => {
    const response = await api.get("/stats");
    return response.data;
};

export const getNotes = async () => {
    const response = await api.get("/notes");
    return response.data;
};

export const updateNote = async (id: number, note: { title: string; content: string; category_id: number }) => {
    const response = await api.put(`/notes/${id}`, note);
    return response.data;
};

export const updateDailyScore = async (categoryId: number, score: number): Promise<void> => {
    await api.post("/stats", { categoryId, score });
};

export const deleteNote = async (id: number) => {
    await api.delete(`/notes/${id}`);
    return true;
};

export const getStatsHistory = async (days: number = 7) => {
    const response = await api.get(`/stats/history?days=${days}`);
    return response.data;
};

export const updateCategoryTarget = async (categoryId: number, target: number): Promise<void> => {
    const response = await api.patch(`/stats/categories/${categoryId}/target`, { target });
    return response.data;
};

export const getStreak = async (): Promise<StreakResponse> => {
    const response = await api.get("/streaks");
    return response.data;
};

export default api;