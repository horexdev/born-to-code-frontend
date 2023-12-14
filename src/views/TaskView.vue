<template>
    <div class="task">
        <div class="code__area">
            <div class="options">
                <div @click="changeOption(1)" :class="optionType == 1 ? 'selected' : 'option'">HTML</div>
                <div @click="changeOption(2)" :class="optionType == 2 ? 'selected' : 'option'">CSS</div>
                <div @click="changeOption(3)" :class="optionType == 3 ? 'selected' : 'option'">JS</div>
            </div>
            <div class="html-editor editor" v-show="optionType == 1" ref="htmlDoc"></div>
            <div class="css-editor editor" v-show="optionType == 2" ref="cssDoc"></div>
            <div class="js-editor editor" v-show="optionType == 3" ref="jsDoc"></div>
            <div class="buttons">
                <div class="preview" @click="preview()">Предпросмотр</div>
                <div class="send__code" @click="check()">Отправить на проверку</div>
            </div>
            <iframe class="code__preview" :srcdoc="srcDoc" ref="iframe" />
        </div>

        <div class="info">
            <span class="result" v-if="result">Вы успешно выполнили задание!</span>
            <span class="description">{{ currentTask?.fullDescription }}</span>
            <div class="comments">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { EditorView, basicSetup } from "codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { EditorState } from "@codemirror/state";
import { onMounted, ref, toRef } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { useAxios } from '@/stores/axios';
import { useTaskStore } from "@/stores/task";

let optionType = ref(1);
let htmlEditor = ref<EditorView | null>(null);
let cssEditor = ref<EditorView | null>(null);
let jsEditor = ref<EditorView | null>(null);
let htmlDoc = ref<Element | DocumentFragment | undefined>(undefined);
let cssDoc = ref<Element | DocumentFragment | undefined>(undefined);
let jsDoc = ref<Element | DocumentFragment | undefined>(undefined);
let srcDoc =  ref<string | undefined>('');
let result = ref(false);
let currentTask = ref<null | Types.Task>(null);
let iframe = ref<HTMLIFrameElement | null>(null);
const route = useRoute();
const router = useRouter();

function loadTaskFromStore() {
    let id = Number(route.params.id);
    let task = useTaskStore().getTask(id);
    if (!task) {
        loadTask();

        return;
    }
    
    currentTask.value = task;
};
async function loadTask() {
    try {
        let data = await useAxios()
        .get("/tasks/get/" + route.params.id, { withCredentials: true })
        .then((response) => {
            if (response.status == 200)
                return response.data;
            else {
                router.push("/");

                return null;
            }
        });

        if (!data)
            return null;

        currentTask.value = data;
    }
    catch (error) {
        router.push("/");

        currentTask.value = null;
    }
};
function changeOption(type: number) {
    if (type <= 0 || type > 3)
        return;

    if (optionType.value == type)
        return;

    optionType.value = type;
};
function getPreview() {
    if (!htmlEditor.value || !cssEditor.value || !jsEditor.value)
        return;

    return getText(1) + `<style>${getText(2)}</style>`;
};
function preview() {
    srcDoc.value = getPreview();

    setTimeout(() => {
        (iframe.value?.contentWindow as any)?.eval(getText(3));
    }, (1500));
};
function getText(type: Number) {
    let editor = null;
    switch (type) {
        case 1:
            editor = htmlEditor.value;
            break;
        case 2:
            editor = cssEditor.value;
            break;
        case 3:
            editor = jsEditor.value;
            break;
    }

    if (!editor)
        return "";

    return editor.state.doc.toString();
};
async function solution() {

    let verify = false;
    try {
        verify = await useAxios().get("/users/authenticate", { withCredentials: true }).then((response) => {
                return response.status == 200;
        });
    }
    catch (error) {
        result.value = false;

        console.log(error)
    }

    if (!verify) {
        result.value = false;

        router.push("/SignIn");

        return;
    }

    let added = await useAxios()
        .get('/solutions/isAdded/' + route.params.id, { withCredentials: true } )
        .then((response) => {
        return response.data;
    });
    
    let dto = {
        TaskId: currentTask.value?.id,
        CreatedAt: new Date().toUTCString(),
        Html: getText(1),
        Css: getText(2),
        Js: getText(3),
        Completed: result.value,
        Title: ""
    }

    if (added) {
        await useAxios().put('/solutions/update', dto, { withCredentials: true })
    }
    else {
        await useAxios().put("/solutions/add", dto, { withCredentials: true })
    }

};
async function loadSolution() {

    let verify = false;
    try {
        verify = await useAxios()
        .get("/users/authenticate", { withCredentials: true })
        .then((response) => {
                return response.status == 200;
        });
    }
    catch (error) {
        console.log(error)
    }

    if (!verify) {
        createEditors("", "", "");

        return;
    }

    let added = await useAxios()
    .get('/solutions/isAdded/' + route.params.id,
        { withCredentials: true } )
        .then((response) => {
        return response.data;
    });

    if (!added) {
        let dto = {
            TaskId: currentTask.value?.id,
            CreatedAt: new Date().toUTCString(),
            Html: "",
            Css: "",
            Js: "",
            Completed: false,
            Title: currentTask.value?.title
        }

        await useAxios().put("/solutions/add", dto, { withCredentials: true })
    }

    let id = await useAxios()
    .get("/users/selfProfile",
        { withCredentials: true })
    .then((response) => {
        if (response.status == 200)
        return response.data;
    });

    if (!id) {
        createEditors("", "", "");

        return;
    }

    let data = await useAxios()
    .get("/users/getProfile/" + id,
        { withCredentials: true })
    .then((response) => {
        if (response.status == 200)
            return response.data;
    });

    let name = data.name;

    let solution = await useAxios()
    .get(`solutions/${name}/get/${route.params.id}`)
    .then((response) => {
        if (response.status == 200)
            return response.data;
        else
            return {};
    });

    if (!solution) {
        createEditors("", "", "");

        return;
}

    result.value = solution.completed;

    createEditors(solution?.html, solution?.css, solution?.js);

};
function createEditors(htmlText: string, cssText: string, jsText: string) {
    let theme = EditorView.theme({
        ".cm-scroller": {"height":"450px; background-color: rgb(214, 224, 240,0.1)"},
        ".cm-activeLine": {"background":"#D6E0F0;"},
        ".cm-activeLineGutter": {"background-color":"#8D93AB;"},
        ".ͼi": {"color":"#8D93AB"},
    });

    htmlEditor.value = new EditorView({
        parent: htmlDoc.value,
        state: EditorState.create({
            doc: htmlText,
            extensions: [basicSetup, html(), theme]
        })
    });

    cssEditor.value = new EditorView({
        parent: cssDoc.value,
        state: EditorState.create({
            doc: cssText,
            extensions: [basicSetup, css(), theme]
        })
    });

    jsEditor.value = new EditorView({
        parent: jsDoc.value,
        state: EditorState.create({
            doc: jsText,
            extensions: [basicSetup, javascript(), theme]
        })
    });
};
function check() {
    let rules = currentTask.value?.htmlStruct.checkElementRules
    if (!rules && rules == undefined)
        return;

    let ruleLength = rules.length

    let complete: Array<boolean | undefined> = [];
    rules.forEach(rule => {
        complete.push(checkTextInHtmlElement(rule.value, rule.element, ruleLength));
    });

    result.value = complete.every(b => b);

    solution();
};
function checkTextInHtmlElement(text: string, element: string, rulesLength: number) {
    const htmlString = getText(1);
    const parser = new DOMParser();
    const document = parser.parseFromString(htmlString, 'text/html');
    let temp = document.querySelector("body");

    if(temp == null) {
        return;
    }

    let body = [...temp.children];
    let array = [...temp.querySelectorAll(element)];
    if (body.length != rulesLength)
        return false;

    let htmlElement = array.find(e => e.innerHTML == text);
    let innerHTML = htmlElement?.innerHTML;
    if (!innerHTML)
        return false;

    return text == innerHTML;
}

onMounted(() => {
    loadSolution();
    loadTaskFromStore();
});



</script>

<style lang="scss" scoped>
    @mixin option {
        width: 75px;
        color: white;
        cursor: pointer;
        border-radius: 15px;
    }

    .true {
        background-color: green;
    }

    .false {
        background-color: red;
    }

    .selected {
        @include option;

        background-color: #8D93AB;
    }

    .task {
        display: grid;
        grid-template-columns: 70% 20%;
        gap: 50px;
        padding-left: 20px;
        padding-top: 20px;

        .code__area {
            display: flex;
            flex-direction: column;
            gap: 15px;

            .options {
                display: flex;
                flex-direction: row;
                gap: 20px;
                text-align: center;

                .option {
                    @include option;

                    background-color: #D6E0F0;

                    &:hover {
                        background-color: #8D93AB;
                    }
                }
            }

            .buttons {
                display: flex;
                flex-direction: row;
                justify-content: space-between;

                .upload__file {
                    border-radius: 15px;
                    border-width: 0px;
                    background-color: #8D93AB;
                    color: white;
                    padding: 0.5em;
                    cursor: pointer;
                }

                .preview {
                    cursor: pointer;
                    border-radius: 15px;
                    border-width: 0px;
                    background-color: #8D93AB;

                    color: white;
                    padding: 0.5em;
                }

                .send__code {
                    border-radius: 15px;
                    border-width: 0px;
                    background-color: #8D93AB;
                    color: white;
                    padding: 0.5em;
                    cursor: pointer;
                }

                .preview:hover, .upload__file:hover, .send__code:hover {
                    background-color: #D6E0F0;
                }
            }
        }

        
        .code__preview {
            background-color: #D6E0F0;
            width: 100%;
            height: 300px;
            border-radius: 15px;
        }

        .info {
            display: flex;
            flex-direction: column;
            gap: 15px;

            .result {
                display: flex;
                flex-direction: column;
                text-align: center;
                color: rgb(36, 148, 36);
            }

            .description {
                border-radius: 15px;
                background-color: #D6E0F0;
                padding: 15px;
                height: 275px;
                font-size: x-large;
            }
        }
    }
</style>