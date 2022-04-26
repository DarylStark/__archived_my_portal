<template>
    <p>Tags</p>
</template>

<script>
export default {
    name: 'Tags',
    created() {
        this.$store.commit('sidebar_available_set', false);
    },
};
</script>
