import axios from "axios";

export const local = axios.create({
    baseURL: process.env.NEXT_PUBLIC_LOCAL,
    validateStatus: () => true,
});

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_HOST,
    validateStatus: () => true,
});
