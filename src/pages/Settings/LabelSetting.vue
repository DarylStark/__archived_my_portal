<template>
    <div class="setting">
        <div class="icon">
            <i v-bind:class="['fas', icon]" v-if="!saving"></i>
            <i class="fas fa-spinner spin" v-if="saving"></i>
        </div>
        <div class="name"><slot></slot></div>
        <div class="value">
            <slot name="label"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'FoldSetting',
    props: {
        icon: {
            type: String,
            default: 'fa-gear',
        },
        saving: {
            type: Boolean,
            default: false,
        },
    },
};
</script>