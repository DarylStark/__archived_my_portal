<template>
    <div class="content">
        <p>
            <b>Current route: </b>
            {{ currentRoute }}
        </p>
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
