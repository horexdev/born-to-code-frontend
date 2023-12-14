<script setup lang="ts">
import router from '@/router';
import { useAxios } from '@/stores/axios';
import { ref } from 'vue';

let loginValidation = ref(false);
let pwdValidation = ref(false);
const loginInput = ref<HTMLInputElement | null>(null);
const passwordInput = ref<HTMLInputElement | null>(null);

async function signUp() {
    let loginCheck = checkLogin();
    let passwordCheck = checkPassword();
    if (!loginCheck || !passwordCheck)
        return;

    let country = await useAxios()
    .get("https://ipinfo.io/")
    .then((response) => response.status == 200 ? response.data.country : "Неизвестно");

    let dto = {
        Name: loginInput.value?.value,
        Password: passwordInput.value?.value,
        Country: country
    }

    let response = await useAxios()
    .post("/users/signUp", dto, { withCredentials: true })
    .then((response) => response)
    .catch((request) => alert("Не удалось зарегистрироваться. " + request.message));
    if (!response)
        return;

    if (response.status == 200) {
        alert("Вы успешно зарегистрированы. Теперь авторизуйтесь");

        router.push("/signIn");
    }
    else {
        alert("Не удалось зарегистрироваться. " + response.data);
    }
}

function checkLogin() {
    if (!loginInput.value || loginInput.value.value.length == 0) {
        loginValidation.value = true;
        setTimeout(() => loginValidation.value = false, 2000);

        return false;
    }

    if (loginInput.value.value.length > 8)
        return false;

    return true;
}

function checkPassword() {
    if (!passwordInput.value || passwordInput.value.value.length == 0) {
        pwdValidation.value = true;
        setTimeout(() => pwdValidation.value = false, 2000);

        return false;
    }

    return true;
}
</script>

<template>
    <div class="auth d-flex justify-content-center align-items-center">
        <div class="left d-flex flex-column align-items-center justify-content-between">
            <h1 class="big-title mt-5">Born To Code</h1>
            <div class="d-flex under-title gap-1 mb-5">
            </div>
        </div>
        <div class="center-line"></div>
        <div class="right d-flex flex-column align-items-center justify-content-between">
            <div class="login-input input-group">
                <div class="image input-group-text justify-content-center" id="basic-addon1">
                    <img src="../assets/avatar_gray.png" />
                </div>
                <input ref="loginInput" type="text" class="form-control" placeholder="BornToCode" aria-label="BornToCode" aria-describedby="basic-addon1">
            </div>
            <div class="pwd-input input-group">
                <div class="image input-group-text justify-content-center" id="basic-addon1">
                    <img src="../assets/key_gray.png" />
                </div>
                <input ref="passwordInput" type="password" class="form-control" placeholder="Желаемый пароль" aria-label="Пароль" aria-describedby="basic-addon1">
            </div>
            <button class="sign-in-button btn btn-light" @click="signUp()">
                <span>Зарегистрироваться</span>
            </button>
            <div href="#" class="forgot-pwd mb-5">
                <span>Регистрируясь вы соглашаетесь с условиями<br>
                    Предоставления услуг и Политикой конфиденциальности.
                </span>
            </div>
        </div>
    </div>
    </template>
    
    <style scoped lang="scss">
    .sign-in-button {
        background-color: #F1F3F8;
        border-color: #F1F3F8;
        font-size: 18px;
        color: #393B44;
        width: 275px;
        font-size: 24px;
        
    
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
    
    .auth {
        gap: 100px;
    
        @media (max-width: 992px) {
            flex-direction: column;
            gap: 0;
        }
    }
    
    .image {
        background-color: #D6E0F0;
        border: none;
        box-shadow: none;
        width: 50px;
    
        @media (max-width: 992px) {
    
        }
    
        img {
            width: 24px;
            height: 24px;
        }
    }
    
    .form-control {
        background-color: #D6E0F0;
        border-left: 0;
        border: none;
        box-shadow: none;
        font-weight: 500;
        width: 350px;
        height: 75px;
        font-size: 24px;
        padding-left: 0;
    
        &:focus {
            border: none;
            box-shadow: none;
        }
    
        &::placeholder {
            color: #8D93AB;
            font-weight: 500;
        }
    }
    
    .left {
        height: 511px;
    
        .big-title {
            font-weight: 700;
            font-size: 96px;
            width: 215px;
            text-align: center;
            color: #393B44;
    
            @media (max-width: 992px) {
                font-size: 48px;
                width: 100%;
            }
        }
    
        @media (max-width: 992px) {
            width: 100%;
            justify-content: start !important;
            height: 211px;
        }
    
        .under-title {
            span {
                font-weight: 400;
                color: #393B44;
                font-size: 20px;
            }
    
            .connect {
                text-decoration: underline;
    
                a {
                    text-decoration: none;
                    color: #393B44;
                }
            }
        }
    }
    
    .right {
        height: 511px;
        
        .login-input {
            width: 400px;
            margin-top: 100px;
        }

        .pwd-input {
            width: 400px;
        }
    
        @media (max-width: 992px) {
            justify-content: space-between !important;
            height: 378px;
    
            @mixin small-input {
                width: 75%;
    
                input {
                    padding: 10px;
                    text-align: center;
    
                    border-radius: 0.375rem !important;
                }
    
                .image {
                    display: none;
                    position: absolute;
                    opacity: 0;
                }
            }
    
            .login-input {
                margin-top: 0;

                @media (max-width: 470px) {
                    @include small-input();
            }
            }

            .pwd-input {
                @media (max-width: 470px) {
                    @include small-input();
            }
        
            }
    
            .forgot-pwd {
                margin-bottom: 0 !important;
            }
        }
    }
    
    .center-line {
        width: 4px;
        height: 511px;
        background-color: #393B44;
        border-radius: 5px;
    
        @media (max-width: 992px) {
            display: none;
            position: absolute;
            opacity: 0;
        }
    }
    
    .forgot-pwd {
        text-decoration: underline;
        color: #393B44;
        font-size: 20px;
        text-align: center;

        span {
            word-wrap: break-word;
        }
    }
    </style>