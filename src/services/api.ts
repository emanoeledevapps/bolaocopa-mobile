import axios from "axios";

export const api = axios.create({
    baseURL: 'https://bolaocopa-backend-production.up.railway.app'
})