<script setup lang="ts">
const props = defineProps({
    name: String
});
</script>

<template>
<img src="@/assets/achievement.png" :title="name"/>
</template>

<style scoped lang="scss">
img {
    width: 100px;
    height: 100px;
    transition: 0.5s;

    &:hover {
        transform: translateY(-20px);
    }
}
</style>