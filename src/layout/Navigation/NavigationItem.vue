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
import Command from '../../my/command';

export default {
    name: 'NavigationItem',
    created() {
        cmdlist.add_command(
            new Command({
                command: 'navigation.open_' + this.id,
                group: 'Navigation',
                title: this.title,
                method: this.$router.push,
                args: this.url,
                icon: this.icon,
            })
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
        icon: {
            type: String,
            mandatory: true,
        },
    },
};
</script>
