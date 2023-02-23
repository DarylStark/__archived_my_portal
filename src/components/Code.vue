<template>
    <div v-bind:class="['code', { hidden: hidden }]">
        <div
            class="code"
            v-bind:class="{ block: block }"
            v-if="show"
            v-on:click="toggle"
        >
            <slot></slot>
        </div>
        <div v-if="!show" v-on:click="toggle">
            <slot name="hidden_text"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Code',
    props: {
        hidden: {
            type: Boolean,
            required: false,
            default: false,
        },
        block: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    data() {
        return {
            show: true,
        };
    },
    created() {
        if (this.hidden) this.show = false;
    },
    methods: {
        toggle() {
            if (this.hidden) this.show = !this.show;
        },
    },
};
</script>
