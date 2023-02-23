<template>
    <div
        v-bind:class="['label', { clickable: click_action != null }]"
        v-on:click="click_action"
    >
        <div class="icon" v-if="loading">
            <i class="fas fa-spinner spin"></i>
        </div>
        <div class="text"><slot></slot></div>
    </div>
</template>

<script>
export default {
    name: 'Label',
    props: {
        click_action: {
            required: false,
            default: null,
        },
        loading: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
};
</script>