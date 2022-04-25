<template>
    <div class="content">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'Content',
    computed: {
        currentRoute() {
            return this.$route.name;
        },
    },
};
</script>
