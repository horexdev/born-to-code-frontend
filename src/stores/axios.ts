import { defineStore } from 'pinia'
import axios from 'axios';

export const useAxios = defineStore('axios', () => {
    axios.defaults.baseURL = "https://api.born-to-code.ru";

    let obj = {
        get: axios.get,
        put: axios.put,
        post: axios.post,
        delete: axios.delete
    }

    return obj;
});
