<template>
    <div class="tagbutton" v-bind:style="style">
        <div class="text" v-on:click="go_to_tag">{{ tag.title }}</div>
        <div
            class="delete"
            v-if="delete_method"
            v-on:click="delete_method(tag)"
        >
            <i v-bind:class="tag_class"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TagButton',
    props: {
        tag: {
            required: true,
        },
        delete_method: {
            required: false,
        },
    },
    computed: {
        style() {
            return {
                'border-color': `#${this.tag.color}`,
                background: `#${this.tag.color}90`,
            };
        },
        tag_class() {
            return [
                'fa-solid',
                'fa-xmark',
                {
                    spin: this.tag.loading,
                },
            ];
        },
    },
    methods: {
        go_to_tag() {
            this.$router.push(`/tags/${this.tag.slug}`);
        },
    },
};
</script>
