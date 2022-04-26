<template>
    <router-link
        v-bind:to="url"
        custom
        v-slot="{ href, route, navigate, isActive, is_exact_active }"
    >
        <li
            v-on:click="go_to_page"
            v-bind:class="{ active: isActive }"
            ref="item"
            v-bind:id="id"
        >
            {{ title }}
        </li>
    </router-link>
</template>

<script>
import cmdlist from '../../my/command_list';

export default {
    name: 'NavigationItem',
    created() {
        cmdlist.add_command(
            'global',
            'Navigation',
            'navigation.open_' + this.id,
            this.title,
            this.$router.push,
            this.url
        );
    },
    methods: {
        go_to_page() {
            // Navigate to the specified page
            this.$router.push(this.url);
        },
    },
    props: {
        id: {
            type: String,
            mandatory: true,
        },
        title: {
            type: String,
            mandatory: true,
        },
        url: {
            type: String,
            mandatory: true,
        },
    },
};
</script>
