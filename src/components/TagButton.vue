<template>
    <div class="tagbutton" v-bind:style="style">
        <div class="text" v-on:click="go_to_tag">{{ tag.title }}</div>
        <div
            class="delete"
            v-if="!tag.loading && delete_method"
            v-on:click="delete_method(tag)"
        >
            <i class="fa-solid fa-xmark"></i>
        </div>
        <div v-if="tag.loading" class="delete">
            <i class="fa-solid fa-spinner spin"></i>
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
