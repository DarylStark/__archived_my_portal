<template>
    <p>RSS feeds</p>
</template>

<script>
export default {
    name: 'RSS',
    created() {
        this.$store.commit('sidebar_available_set', true);
    },
};
</script>
