<template>
    <p>Settings</p>
</template>

<script>
export default {
    name: 'Settings',
    created() {
        this.$store.commit('sidebar_available_set', false);
    },
};
</script>
