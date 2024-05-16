export const API_URL = import.meta.env.VITE_NODE_ENV === 'production' ? import.meta.env.VITE_PUBLIC_API_URL : 'http://localhost:3000';

export const BOARD_ITEMS_ROW = 4;