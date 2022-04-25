<template>
    <router-link
        v-bind:to="url"
        custom
        v-slot="{ href, route, navigate, isActive, is_exact_active }"
    >
        <li v-on:click="go_to_page" v-bind:class="{ active: isActive }">
            <slot></slot>
        </li>
    </router-link>
</template>

<script>
export default {
    name: 'NavigationItem',
    methods: {
        go_to_page() {
            // Navigate to the specified page
            this.$router.push(this.url);
        },
    },
    props: {
        url: {
            type: String,
            mandatory: true,
        },
    },
};
</script>
