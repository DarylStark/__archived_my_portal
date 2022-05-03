<template>
    <div v-bind:class="['setting', { error: error }]">
        <div class="icon" v-if="icon">
            <i v-bind:class="['fas', icon]" v-if="!saving"></i>
            <i class="fas fa-spinner spin" v-if="saving"></i>
        </div>
        <div class="name"><slot></slot></div>
        <div class="value">
            <slot name="value"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Setting',
    props: {
        icon: {
            type: String,
        },
        saving: {
            type: Boolean,
            default: false,
        },
        error: {
            type: Boolean,
            default: false,
        },
    },
};
</script>
