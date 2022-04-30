<template>
    <button
        class="button"
        v-bind:type="type"
        v-bind:disabled="disabled"
        v-on:click="click"
    >
        <div>
            <div class="icon" v-if="icon">
                <i v-bind:class="icon" v-if="!loading"></i>
                <i class="fas fa-circle-notch spin" v-if="loading"></i>
            </div>
            <div class="text" v-if="!!this.$slots['default']">
                <slot></slot>
            </div>
        </div>
    </button>
</template>

<script>
export default {
    name: 'Button',
    props: {
        icon: String,
        type: {
            type: String,
            default: 'button',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        loading: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['click'],
    methods: {
        click(event) {
            this.$emit('click');
        },
    },
};
</script>
