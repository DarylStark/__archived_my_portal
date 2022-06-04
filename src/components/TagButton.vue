<template>
    <div class="tagbutton" v-bind:style="style">
        <div class="text" v-on:click="go_to_tag">{{ tag.title }}</div>
        <div
            class="delete"
            v-if="delete_method"
            v-on:click="delete_method(tag)"
        >
            <i class="fa-solid fa-xmark"></i>
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
    },
    methods: {
        go_to_tag() {
            this.$router.push(`/tags/${this.tag.slug}`);
        },
    },
};
</script>
