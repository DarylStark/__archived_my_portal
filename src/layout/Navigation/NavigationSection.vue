<template>
    <ul v-bind:class="['navigation_section', { active: active }]">
        <router-link
            v-bind:to="url"
            custom
            v-slot="{ href, route, navigate, isActive, is_exact_active }"
        >
            <li v-on:click="click_title" v-bind:class="{ active: isActive }">
                <div class="icon">
                    <i v-bind:class="['fas', icon]"></i>
                </div>
                <div class="text">{{ title }}</div>
                <div class="collapse" v-if="has_subitems">
                    <i class="fas fa-angle-up"></i>
                </div>
            </li>
        </router-link>
        <ul v-if="has_subitems && !custom_submenu" class="submenu">
            <slot></slot>
        </ul>
        <template v-if="custom_submenu">
            <div class="submenu">
                <slot></slot>
            </div>
        </template>
    </ul>
</template>

<script>
export default {
    name: 'NavigationSection',
    data: () => {
        return {
            active: false,
        };
    },
    methods: {
        click_title() {
            // Navigate to the specified page
            this.$router.push(this.url);

            // Open the menu
            if (this.has_subitems) {
                this.active = !this.active;
            }
        },
    },
    computed: {
        has_subitems() {
            return !(this.$slots.default == undefined);
        },
    },
    props: {
        title: String,
        icon: {
            type: String,
            mandatory: false,
            default: 'fa-angle-right',
        },
        url: {
            type: String,
            mandatory: false,
            default: null,
        },
        custom_submenu: {
            type: Boolean,
            mandatory: false,
            default: false,
        },
    },
};
</script>
