import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useAxios } from './axios';

export const useTaskStore = defineStore('task', () => {
    const tasks = ref([] as Array<Types.Task>);
    
    const htmlCheckElement = ref([] as Array<Types.TaskHtmlCheckElement>)

    function getTask(id: number) {

        return tasks.value.find(t => t.id == id);
    };

    async function loadTasks() {
        let newTasks = await useAxios().get("/tasks/getAll", { withCredentials: true }).then(response => {
            if (response.status == 200)
                return response.data;
            else
                return [];
        }).catch(error => console.log(error));

        tasks.value = newTasks;
    }

    return { tasks, getTask, loadTasks };
})