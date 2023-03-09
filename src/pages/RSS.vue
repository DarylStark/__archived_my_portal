<template>
    <p>RSS feeds</p>
</template>

<script>
export default {
    name: 'RSS',
    created() {
        this.$store.commit('sidebar_available_set', true);
        this.$store.commit('set_page_title', 'RSS feeds');
    },
};
</script>
