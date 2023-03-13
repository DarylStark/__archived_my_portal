<template>
    <div class="action">
        <div class="text" v-on:click="action">
            <i v-bind:class="icon_class"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CardTitleAction',
    props: {
        action: {
            required: true,
        },
        icon: {
            type: String,
            required: false,
            default: null,
        },
    },
    computed: {
        icon_class() {
            return ['fas', this.icon];
        },
    },
};
</script>