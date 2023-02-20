<template>
    <p>API Settings</p>
</template>

<script>
export default {
    name: 'APISettings',
    created() {
        this.$store.commit('sidebar_available_set', false);
    },
};
</script>
