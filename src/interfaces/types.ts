export interface Category {
    id: number;
    name: string;
}

export interface Note {
    id: number;
    title: string;
    content: string;
    categoryId: number;
    categoryName: string;
    createdAt: string;
}

export interface CategoryStat {
    id: number;
    categoryId: number;
    target_score: number;
    recordedAt: Date;
}

export interface CategoryWithStats extends Category {
    id: number;
    name: string;
    target_score: number;
    currentScore?: number | null;
}