<template>
    <p>RSS feeds</p>
</template>

<script>
export default {
    name: 'RSS',
    mounted() {
        this.$store.commit('update_title', 'RSS feeds');
    },
    beforeRouteLeave() {
        this.$store.commit('update_title');
    },
};
</script>