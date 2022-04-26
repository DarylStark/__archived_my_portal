<template>
    <p><b>404 ERROR</b>: Unknown page</p>
</template>

<script>
export default {
    name: 'Dashboard',
    created() {
        this.$store.commit('sidebar_available_set', false);
    },
};
</script>
