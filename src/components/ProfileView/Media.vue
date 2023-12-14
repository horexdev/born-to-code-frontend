<script setup lang="ts">
const props = defineProps({
    name: String,
    image: String,
    link: String
});
</script>

<template>
<a :href="link">
    <img :src="`${image}`" :title="name"/>
</a>
</template>

<style scoped lang="scss">
img {
    width: 26px;
    height: 26px;
    transition: 0.5s;

    &:hover {
        transform: scale(1.2);
    }
}
</style>