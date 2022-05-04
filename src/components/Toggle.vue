<template>
    <div
        v-bind:class="['toggle', { checked: value }, { disabled: disabled }]"
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
        disabled: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    data() {
        return {
            value: this.toggled,
        };
    },
    emits: ['changed'],
    methods: {
        toggle_click() {
            if (this.toc && !this.disable) {
                this.toggle();
            }
        },
        toggle(emit_change = true) {
            if (!this.disable) {
                this.value = !this.value;
                if (emit_change) this.$emit('changed');
            }
        },
    },
};
</script>
