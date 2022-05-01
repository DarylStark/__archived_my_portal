<template>
    <div v-bind:class="['grid', { center: center }]">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'Grid',
    props: {
        center: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
};
</script>
