<script setup lang="ts">
import defaultAvatar from '../assets/avatar.png'
import Media from '../components/ProfileView/Media.vue'
import Achievement from '../components/ProfileView/Achievement.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import Tasks from "../components/Task.vue";

import 'swiper/css';

import { useProfileStore } from '../stores/profile';
import { computed, onMounted, onUpdated, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const profileStore = useProfileStore();
const selectedFile = ref<HTMLInputElement | null>(null);;

let user = ref<Types.User | null>(null);
let avatarLoad = ref(false);

async function selectFile() {
    if (!selectedFile || !selectedFile.value || !selectedFile.value.files)
        return;

    avatarLoad.value = true;

    let file = selectedFile.value.files[0];
    let size = formatBytes(file.size);
    if (size > 10) {
        alert("Максимальный размер аватарки не более 10 МБ");
        
        selectedFile.value.value = "";               

        avatarLoad.value = false;

        return;
    }

    await useProfileStore().sendFile(file);

    avatarLoad.value = false;
}

function formatBytes(bytes: number, decimals: number = 2) {
    if (bytes === 0) {
        return 0;
    } else {
        var k = 1024;
        var dm = decimals < 0 ? 0 : decimals;

        return parseFloat((bytes / Math.pow(k, 2)).toFixed(dm));
    }
}

let avatar = computed(() => {
    let avatarUrl = useProfileStore().getAvatarUrl();

    return avatarUrl.length > 0 ? avatarUrl : defaultAvatar;
});

function isOwner() {
    return user.value?.id == useProfileStore().getId();
}

onMounted(async () => {
    if (!user.value) {
        user.value = await useProfileStore().getOtherProfile(Number(useRoute().params["id"]));

        if (user.value)
            useProfileStore().loadAvatar(user.value.name);
    }
});

watch(useRoute(), async (from) => {
    user.value = await useProfileStore().getOtherProfile(Number(from.params["id"]));

    if (user.value)
        useProfileStore().loadAvatar(user.value.name);
});
</script>

<template>
<div class="profile d-flex justify-content-around" v-if="user">
    <div class="d-flex flex-column gap-4">
        <div class="profile-info d-flex flex-row">
            <div class="profile-column">
                <div class="d-flex align-items-center gap-3">
                    <h1 class="nickname display-5">{{ user?.name }}</h1>
                    <div class="avatar rounded-circle" v-if="!avatarLoad && isOwner()">
                        <span class="change-avater-text">Сменить аватарку</span>
                        <input id="file-input" class="select-file" type="file" ref="selectedFile" @change="selectFile()">
                        <label for="file-input">
                            <img :src="avatar"/>
                        </label>
                    </div>
                    <div class="spinner-border" role="status" v-if="isOwner() && avatarLoad"></div>
                    <div class="avatar2 rounded-circle" v-if="!avatarLoad && !isOwner()">
                        <img :src="avatar" />
                    </div>
                </div>
                <div class="info d-flex flex-column gap-3">
                    <span>Страна: {{ user?.country }}</span>
                    <span>Зарегистрирован: {{ user?.createdAt }}</span>
                    <div class="d-flex gap-2">
                        <Media :key="index" v-for="(item, index) in profileStore.media" :image="item.image" :link="item.link" :name="item.name"/>
                    </div>
                    <div class="stats d-flex">
                        <div class="d-flex align-items-center gap-3">
                            <img src="../assets/goal.png"/>
                            <span>Решено задач: {{ user.tasks.length }}</span>
                        </div>
                        <div class="d-flex align-items-center gap-3">
                            <img src="../assets/edit.png"/>
                            <span>Созданно задач: 0</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="achievements d-flex flex-column">
                <h1 class="display-5">Достижения:</h1>
                <swiper :slides-per-view="5" style="width: 100%; height: 150px; padding-left: 1.5rem" class="mySwiper">
                    <swiper-slide :key="index" v-for="(item, index) in profileStore.achievements">
                        <Achievement class="ach" :name="item.name"/>
                    </swiper-slide>
                </swiper>
            </div>
        </div>  
        <div class="tasks d-flex flex-row justify-content-between gap-4 flex-wrap">
                <Tasks class="task" v-bind:key="index" v-for="(task, index) in user.tasks" 
                :task="task" :taskFontSize="34" :taskLeft="50" :taskRight="50" :taskWidth="48.5"/>
        </div>
    </div>  
</div>
<div v-else class="notfound">
    <h1>Такого профиля не существует :(</h1>
</div>
</template>

<style scoped lang="scss">
.notfound {
    text-align: center;

    h1 {
        color: #393B44;
    }
}

.task {
    width: 45%;
}
.ach {
    margin-top: 25px
}

.profile {
    margin: 0 5% 0 5%;

    .profile-info {
        .profile-column {
            width: 50%;

            @media (max-width: 1203px) {
                width: 100%;
            }
        }
    }
}

.select-file {
    display:none;
}

.change-avater-text {
    line-height: 30px;
    position: absolute;
    height: 60px;
    padding-top: 2%;
    width:100px;
    display:unset;
    font-size: 20px;
    font-weight: 700;
    opacity: 0;
    color: #393B44;
    transition: 0.5s;
}

.avatar {
    word-wrap: break-word;
    width: 120px;
    height: 120px;
    -webkit-box-shadow: 0px 0px 9px 15px rgba(214, 224, 240, 0.3);
    -moz-box-shadow: 0px 0px 9px 15px rgba(214, 224, 240, 0.3);
    box-shadow: 0px 0px 9px 15px rgba(214, 224, 240, 0.3);
    background-color: rgb(214, 224, 240, 0.6);
    text-align: center;
    opacity: 1;
    cursor: pointer;
    
    img {
        cursor: pointer;
        position: relative;
        width: 100px;
        height: 100px;
        margin-top: 10px;
        transition: 0.5s;
        border-radius: 50% !important;
    }

    &:hover {
        img {
            opacity: 0;
        }
        .change-avater-text {
            display: unset;
            opacity: 1;
        }
    }

}

.avatar2 {
    word-wrap: break-word;
    width: 120px;
    height: 120px;
    -webkit-box-shadow: 0px 0px 9px 15px rgba(214, 224, 240, 0.3);
    -moz-box-shadow: 0px 0px 9px 15px rgba(214, 224, 240, 0.3);
    box-shadow: 0px 0px 9px 15px rgba(214, 224, 240, 0.3);
    background-color: rgb(214, 224, 240, 0.6);
    text-align: center;
    opacity: 1;

    img {
        position: relative;
        width: 100px;
        height: 100px;
        margin-top: 10px;
        transition: 0.5s;
        border-radius: 50% !important;
    }
}

.nickname {
    font-weight: 400;
}

.info {
    span {
        font-weight: 400;
        font-size: 28px;
    }
}

.stats {
    img {
        width: 32px;
        height: 32px;
    }

    span {
        font-weight: 400;
        font-size: 24px;
    }

    gap: 65px;
    margin-top: 25px;

    @media (max-width: 579px) {
        flex-direction: column;
        gap: 30px;
    }
}

.achievements {
    width: 50%;
    text-align: center;
    gap: 20px;

    h1 {
        font-weight: 400;
        line-height: 120px;
        height: 120px;
    }

    @media (max-width: 1203px) {
        display: none !important;
        opacity: 0;
        position: absolute;
    }
}

.tasks {
    @media (max-width: 1203px) {
        display: none !important;
        opacity: 0;
        position: absolute;
    }
}
</style>