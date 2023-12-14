<script setup lang="ts">
import { useAxios } from '@/stores/axios';
import { useProfileStore } from '@/stores/profile';
import { computed, onMounted, ref } from 'vue';

let load = ref(false);

onMounted(async () => {
    load.value = true;
    await useProfileStore().authenticate();
    load.value = false;
});

const username = computed(() => useProfileStore().isAuthorized() ? useProfileStore().getUsername() : "Вход");
const link = computed(() => useProfileStore().isAuthorized() ? `/profile/${useProfileStore().getId()}` : "/signIn");

async function signOut() {
    await useAxios().get("users/signOut", { withCredentials: true }).then((response) => {
        if (response.status != 200)
            return;

        location.reload();
    });
}
</script>

<template>
    <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
            <RouterLink to="/" class="navbar-brand">Born To Code</RouterLink>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <div class="input-group">
                    <div class="search input-group-text" id="basic-addon1">
                        <img src="../assets/search.png" />
                    </div>
                    <input type="text" class="form-control" placeholder="Поиск" aria-label="Поиск" aria-describedby="basic-addon1">
                </div>
                <div class="container-fluid ps-0">
                    <ul class="btn-list navbar-nav d-flex justify-content-around me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <RouterLink to="/" class="buttons">
                                <button class="btn btn-light">
                                    <div class="d-flex align-items-center gap-1">
                                        <img src="../assets/goal.png"/>
                                        <span>Задачи</span>
                                    </div>
                                </button>
                            </RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink :to="link" class="buttons" v-if="!load">
                                <button class="btn btn-light">
                                    <div class="d-flex align-items-center gap-1">
                                        <img src="../assets/avatar.png"/>
                                        <span>{{ username }}</span>
                                    </div>
                                </button>
                            </RouterLink>
                            <div class="spinner-border" role="status" v-else></div>
                        </li>
                        <li v-if="useProfileStore().isAuthorized()">
                            <button class="signOut btn btn-light" @click="signOut()">Выйти</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
</template>

<style scoped lang="scss">
.signOut {
    background-color: #F1F3F8;
    border-color: #F1F3F8;
    font-size: 18px;
    color: #393B44;

    img {
        width: 20px;
        height: 20px;
    }

    &:hover {
        @media (min-width: 1024px) {
            background-color: #F1F3F8;
            -webkit-box-shadow: 0px 5px 10px 2px rgba(57, 59, 68, 0.2);
            -moz-box-shadow: 0px 5px 10px 2px rgba(57, 59, 68, 0.2);
            box-shadow: 0px 5px 10px 2px rgba(57, 59, 68, 0.2);
        }
    }
}

.navbar-toggler {
    &:focus {
        box-shadow: none;
    }
}

.navbar-brand {
    font-weight: 400;
    font-size: 36px;
    color: #393B44;
}

.input-group {
    width: 150%;
    
    @media (max-width: 992px) {
        width: 100%;
    }
}

.search {
    width: 32px;
    background-color: #D6E0F0;
    border: none;
    box-shadow: none;
    
    img {
        width: 20px;
        height: 20px;
    }
}

.form-control {
    background-color: #D6E0F0;
    border-left: 0;
    border: none;
    box-shadow: none;
    font-weight: 500;

    &:focus {
        border: none;
        box-shadow: none;
    }

    &::placeholder {
        color: #8D93AB;
        font-weight: 500;
    }
}

.btn-list {
    @media (max-width: 992px) {
        margin-top: 10px;
        gap: 10px;
    }
}

.buttons {
    //gap: 200px;

    button {
        background-color: #F1F3F8;
        border-color: #F1F3F8;
        font-size: 18px;
        color: #393B44;

        img {
            width: 20px;
            height: 20px;
        }

        &:hover {
            @media (min-width: 1024px) {
                background-color: #F1F3F8;
                -webkit-box-shadow: 0px 5px 10px 2px rgba(57, 59, 68, 0.2);
                -moz-box-shadow: 0px 5px 10px 2px rgba(57, 59, 68, 0.2);
                box-shadow: 0px 5px 10px 2px rgba(57, 59, 68, 0.2);
            }
        }
    }
}
</style>
