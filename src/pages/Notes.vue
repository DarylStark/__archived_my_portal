<template>
    <p>Notes</p>
</template>

<script>
export default {
    name: 'Notes',
    created() {
        this.$store.commit('sidebar_available_set', true);
    },
};
</script>
