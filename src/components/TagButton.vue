<template>
    <div class="tagbutton" v-bind:style="style" v-on:click="go_to_tag">
        {{ tag.title }}
    </div>
</template>

<script>
export default {
    name: 'TagButton',
    props: {
        tag: {
            required: true,
        },
    },
    computed: {
        style() {
            return {
                'border-color': `#${this.tag.color}`,
                background: `#${this.tag.color}90`,
            };
        },
    },
    methods: {
        go_to_tag() {
            this.$router.push(`/tags/${this.tag.slug}`);
        },
    },
};
</script>
