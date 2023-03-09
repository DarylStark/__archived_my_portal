<template>
    <p>Notes</p>
</template>

<script>
export default {
    name: 'Notes',
    created() {
        this.$store.commit('sidebar_available_set', true);
        this.$store.commit('set_page_title', 'Notes');
    },
};
</script>
