<template>
    <hr class="tag_line" v-bind:style="border_style" />
</template>

<script>
export default {
    name: 'TagLine',
    props: {
        color: {
            required: true,
        },
    },
    computed: {
        border_style() {
            return {
                'border-color': `#${this.color}`,
            };
        },
    },
};
</script>
