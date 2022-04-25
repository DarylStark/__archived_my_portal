<template>
    <ul v-bind:class="['navigation_section', { active: active }]">
        <li v-on:click="click_title">
            <div class="icon">
                <i v-bind:class="['fas', icon]"></i>
            </div>
            <div class="text">{{ title }}</div>
        </li>
        <ul>
            <slot></slot>
        </ul>
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
            if (this.href) {
                this.$router.push(this.href);
            }

            // Open the menu
            if (this.$slots.default) {
                this.active = !this.active;
            }
        },
    },
    props: {
        title: String,
        icon: {
            type: String,
            mandatory: false,
            default: 'fa-angle-right',
        },
        href: {
            type: String,
            mandatory: false,
        },
    },
};
</script>
