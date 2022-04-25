<template>
    <li v-on:click="go_to_page">
        <slot></slot>
    </li>
</template>

<script>
export default {
    name: 'NavigationItem',
    methods: {
        go_to_page() {
            // Navigate to the specified page
            this.$router.push(this.href);
        },
    },
    props: {
        href: {
            type: String,
            mandatory: true,
        },
    },
};
</script>
