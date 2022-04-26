<template>
    <div class="sidebartoggle">
        <i
            class="fas fa-list-ul"
            v-on:click="toggle_sidebar"
            v-bind:class="{ hidden: !sidebar_is_visible }"
        ></i>
    </div>
</template>

<script>
export default {
    name: 'SidebarToggle',
    computed: {
        sidebar_is_visible() {
            return this.$store.state.ui.sidebar_visible;
        },
    },
    methods: {
        toggle_sidebar() {
            this.$store.commit('sidebar_visible_toggle');
        },
    },
};
</script>
