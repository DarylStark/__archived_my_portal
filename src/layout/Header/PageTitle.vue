<template>
    <div class="pagetitle">
        <h1>{{ page_title }}</h1>
    </div>
</template>

<script>
export default {
    name: 'PageTitle',
    computed: {
        page_title() {
            return this.$store.state.ui.page_title;
        },
    },
};
</script>
