<script setup lang="ts">
import Tasks from "../components/Task.vue";
import { useTaskStore } from '../stores/task';
import { onMounted, ref } from 'vue'

let tasksStore = ref(useTaskStore().tasks);
let filter = ref(0);
let subFilter = ref(0);
let active = ref(0);

const props = defineProps({
    task: {
        type: Object,
        default: null
    }   
})

function getTaskByLanguageFilter(numb: number) {
    filter.value = numb + 1
    tasksStore.value = useTaskStore().tasks.filter(f => f.languages[numb])

    if(subFilter.value == 0)
        tasksStore.value = tasksStore.value.sort((a,b) => b.likes - a.likes)
    if(subFilter.value == 1)
        tasksStore.value = tasksStore.value.sort((a,b) => b.creationDate - a.creationDate)
}

function getTaskByLikesFilter() {
    subFilter.value = 0
    tasksStore.value = tasksStore.value.sort((a,b) => b.likes - a.likes)

}

function getTaskByDate() {
    subFilter.value = 1
    tasksStore.value = tasksStore.value.sort((a,b) => b.creationDate - a.creationDate)
}

function getTaskBycound() {
    subFilter.value = 2
    tasksStore.value = tasksStore.value.sort((a,b) => b.solutionsCount - a.solutionsCount)
}

function getAllTasks() {
    filter.value = 0; 
    tasksStore.value = useTaskStore().tasks 
}

onMounted(async () => {
    await useTaskStore().loadTasks();

    getAllTasks();
})

</script>

<template>
    <div class="container-fluid d-flex flex-column gap-3">
        <div class="main d-flex flex-column gap-3">
            <span class="title">Задачи</span>
            <span class="description">Воодушевляющее описание страницы</span>
            <div class="lang d-flex flex-row gap-3">
                <span :class="{ active: filter == 0 }" @click="getAllTasks()">ВCE</span>
                <span :class="{ active: filter == 1 }" @click="getTaskByLanguageFilter(0)">HTML</span>
                <span :class="{ active: filter == 2 }" @click="getTaskByLanguageFilter(1)">CSS</span>
                <span :class="{ active: filter == 3 }" @click="getTaskByLanguageFilter(2)">JAVASCRIPT</span>
            </div>
            <div class="filter d-flex flex-row gap-3">
                <span :class="{ active: subFilter == 0 }" @click="getTaskByLikesFilter()">Популярные</span>
                <span :class="{ active: subFilter == 2 }" @click="getTaskBycound()">Количество решений</span>
                <span :class="{ active: subFilter == 1 }" @click="getTaskByDate()">Последние</span>
            </div>
        </div>
        <div class="d-flex flex-column gap-4">
            <Tasks class="task" :key="index" v-for="(task, index) in tasksStore"
                :task="task" :taskFontSize="34" :taskLeft="30" :taskRight="70" :taskWidth="75"/>
        </div>
    </div>
</template>

<style scoped lang="scss">

    .active {
        color: #393B44 !important;
    }
    .main {
        margin-left: 210px;
    }

    .title {
        font-style: normal;
        font-weight: 400;
        font-size: 46px;
        line-height: 150%;
        color: #393B44;
    }

    .description {
        font-style: normal;
        font-weight: 400;
        font-size: 28px;
        line-height: 150%;
        color: #393B44;
    }
    .lang span {
        font-style: normal;
        font-weight: 500;
        font-size: 20px;
        line-height: 150%;
        color: #8D93AB;
    }

    .lang span:hover {
        color:#393B44;
        cursor: pointer;
    }

    .lang span:focus {
        color:#393B44;
    }

    .filter span {
        font-style: normal;
        font-weight: 500;
        font-size: 20px;
        line-height: 150%;
        color: #8D93AB;
    }

    .filter span:hover {
        color:#393B44;
        cursor: pointer;
    }
    
    .filter span:focus {
        color:#393B44;
        text-decoration: underline;
    }
</style>