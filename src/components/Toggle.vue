<template>
    <div
        v-bind:class="['toggle', { checked: value }]"
        v-on:click="toggle_click"
    >
        <div class="inner"></div>
    </div>
</template>

<script>
export default {
    name: 'Toggle',
    props: {
        toggled: {
            type: Boolean,
            required: false,
            default: false,
        },
        toc: {
            type: Boolean,
            required: false,
            default: true,
        },
    },
    data() {
        return {
            value: this.checked,
        };
    },
    emits: ['changed'],
    methods: {
        toggle_click() {
            if (this.toc) {
                this.toggle();
            }
        },
        toggle() {
            this.value = !this.value;
            this.$emit('changed');
        },
    },
};
</script>
