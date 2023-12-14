import { ref } from 'vue'
import { defineStore } from 'pinia'
import telegram from '../assets/telegram.png'
import vk from '../assets/vk.png'
import discord from '../assets/discord.png'
import github from '../assets/github.png'
import { useAxios } from './axios'

export const useProfileStore = defineStore('profile', () => {
    type MediaType = {
        name: string,
        image: string,
        link: string
    };

    type AchievementType = {
        id: number,
        name: string
    }

    let media = ref([] as Array<MediaType>);
    media.value.push({
        name: "Telegram",
        image: telegram,
        link: "https://telegram.org"
    });
    media.value.push({
        name: "Vkontake",
        image: vk,
        link: "https://vk.com"
    });
    media.value.push({
        name: "Github",
        image: github,
        link: "https://github.com"
    });
    media.value.push({
        name: "Discord",
        image: discord,
        link: "https://discord.com"
    });

    let achievements = ref([] as Array<AchievementType>);
    achievements.value.push({
        id: 1,
        name: "Знакомство с Born To Code"
    });
    achievements.value.push({
        id: 1,
        name: "Знакомство с Born To Code"
    });
    achievements.value.push({
        id: 1,
        name: "Знакомство с Born To Code"
    });
    achievements.value.push({
        id: 1,
        name: "Знакомство с Born To Code"
    });
    achievements.value.push({
        id: 1,
        name: "Знакомство с Born To Code"
    });
    achievements.value.push({
        id: 1,
        name: "Знакомство с Born To Code"
    });
    achievements.value.push({
        id: 1,
        name: "Знакомство с Born To Code"
    });

    let authorized = ref(false);
    let username = ref("");
    let id = ref(-1);
    let avatarUrl = ref("");

    function isAuthorized() {
        return authorized.value;
    }

    function getUsername() {
        return username.value;
    }

    function getId() {
        return id.value;
    }

    async function authenticate() {
        try {
            let dto = await useAxios().get("/users/authenticate", { withCredentials: true })
            .then((response) => {
                return response.status == 200 ? response.data as Types.User : null;
            });
            if (!dto)
                return false;

            authorized.value = true;
            username.value = dto.name;
            id.value = dto.id;

            return true;
        } catch (error) {
            console.log(error);

            return false;
        }
    }

    async function getOtherProfile(id: number) {
        let dto = await useAxios().get("/users/getProfile/" + id, { withCredentials: true })
        .then(response => response.status == 200 ? response.data as Types.User : null).catch(error => console.log(error));
        if (!dto)
            return null;

        let tasks = await loadTasks(dto.name);
        dto.tasks = tasks;

        return dto;
    }

    async function sendFile(file: File) {
        if (!file)
            return;

        let formData = new FormData();
        formData.append('formFile', file);

        await useAxios().put("/users/sendPhoto", formData, { withCredentials: true }).then((response) => {
            if (response.status == 200) {
                loadAvatar(username.value);
            }
        });
    }

    async function loadAvatar(name: string) {
        let data = null;
        try {
            data = await getAvatar(name);
        }
        catch(error) {
            console.log(error);
            
            avatarUrl.value = "";

            return false;
        }

        if (!data) {
            avatarUrl.value = "";

            return false;
        }

        avatarUrl.value = "data:image/jpg;base64," + data;

        return true;
    }

    async function getAvatar(name: string) {
        try {
            return await useAxios().get("/users/getPhoto/" + name, { withCredentials: true }).then((response) => {
                if (response.status == 200)
                    return response.data.avatar as string;

                return "";
            });
        }
        catch(error) {
            console.log(error);
            
            return "";
        }
    }

    function getAvatarUrl() {
        return avatarUrl.value;
    }

    async function loadTasks(username: string) {
        let data = await useAxios().get(`/tasks/get/completed/user/${username}`).then(function (response) {
            if (response.status == 200) {
                return response.data;
            }

            return [];
        });

        return data as Array<Types.Task>;
    }

    return { media, achievements, authenticate, isAuthorized, getUsername, getId, getOtherProfile, sendFile, getAvatarUrl, loadAvatar, getAvatar };
});
