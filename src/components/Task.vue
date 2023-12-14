<script setup lang="ts">
import { onMounted, ref } from 'vue';
import defaultBackground from '../assets/background.png';
import defaultAvatar from '../assets/avatar.png'
import { useProfileStore } from '../stores/profile';
import router from '@/router';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
    task: {
        type: Object,
        default: null
    },
    taskBackground: {
        type: String,
        default: defaultBackground
    },
    taskWidth: {
        type: Number,
        default: 45
        },
    taskLeft: {
        type: Number,
        default: 30
    },
    taskRight: {
        type: Number,
        default: 40
    },
    taskFontSize: {
        type: Number,
        default: 46
    }
});

let avatarUrl = ref("");

async function avatar() {
    let result = await useProfileStore().getAvatar(props.task.author);

    avatarUrl.value = result?.length > 0 ? "data:image/jpg;base64," + result : defaultAvatar;
}

async function goToProfile() {
    router.push("/profile/" + props.task.authorId);
}

onMounted(() => {
    avatar();
});
</script>

<template>
    <div class="main p-0 d-flex flex-row rounded-2 border border-2 border-dark" style="height: 160px;" :style="{ width: `${taskWidth}%` }">
        <div class="leftSide d-flex flex-column justify-content-around p-2 border-end border-dark" :style="{ width: `${taskLeft}%` }">
            <span>{{task.shortDescription}}</span>
            <div class="d-flex flex-row justify-content-between mt-5">
                <div class="author d-flex gap-3" @click="goToProfile()">
                    <img :src="avatarUrl" class="rounded-circle" id="background" style="width: 28px; height: 28px;">
                    <span class="">{{ task.author }}</span>
                </div>
                <div class="d-flex gap-3">
                    <img v-if="task.languages[0]" src="../assets/html.png" ref="html" style="width: 20px; height: 20px;">
                    <img v-if="task.languages[1]" src="../assets/css.png" ref="css" style="width: 15px; height: 20px;">
                    <img v-if="task.languages[2]" src="../assets/js.png" ref="js" style="width: 30px; height: 20px;">
                </div>
            </div>
        </div>
        <div class="rightSide d-flex flex-row"  :style="{ 
            width: `${taskRight}%`, 
            'background-image': `url(${taskBackground})` }">
            <div class="content">
                <div></div>
                <div class="start d-flex flex-column">
                    <RouterLink class='text-offset' :to="`/task/${task.id}`">
                        <span :style="{ fontSize: `${taskFontSize}px` }">Начать</span>
                    </RouterLink>
                    <span class='text-offset' :style="{ fontSize: `${taskFontSize}px` }">Другие решения</span>
                </div>
                <div class="info d-flex gap-3">
                    <div class="d-flex">
                        <img src="../assets/likes.png" style="width:26px; height: 26px; ">
                        <span style="color: #F9595F;">{{task.likes}}</span>
                    </div>
                    <div class="d-flex">
                        <img src="../assets/views.png" style="width:26px; height: 26px;">
                        <span style="color: #59B6F9;">{{task.views}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.leftSide {
    background: #F1F3F8;
    border-radius: 0.375rem 0 0 0.375rem;
}


.rightSide {
    border-radius: 0 0.375rem 0.375rem 0;
    transition: 0.45s;

    &:hover {
        cursor: pointer;

        .content {
            opacity: 100%;
        }
    }
}

.content {
    width: 100%;
    display: flex;
    background: rgb(214, 224, 240, .8);
    opacity: 0%;
    flex-direction: row;
    justify-content:space-between;
    color: #393B44;
    border-radius: 0 0.375rem 0.375rem 0;
    transition: 0.45s;
    padding: 0 10px 0 10px;
}

.start {
    justify-content: space-evenly;
    width: 50%;
    .text-offset {
        color: #393B44;
        transition: 0.5s;
        font-weight: 400;
        -webkit-text-stroke: #393B44;
        text-decoration: none;
    }

    .text-offset:hover {
        transform: translateX(20px);
    }
}

.info {
    width: 50%;
    justify-content: flex-end;
    span {
        font-style: normal;
        font-weight: 400;
        font-size: 21px;
    } 
}

.author {
    &:hover {
        cursor: pointer;
    }
}
</style>