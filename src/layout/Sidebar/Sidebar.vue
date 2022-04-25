<template>
    <div v-bind:class="['sidebar', { floating: floating }, { hide: !visible }]">
        Sidebar
    </div>
</template>

<script>
export default {
    name: 'Sidebar',
    computed: {
        visible() {
            return this.$store.state.ui.sidebar_visible;
        },
        floating() {
            return this.$store.state.ui.device_type == 'phone';
        },
    },
};
</script>
