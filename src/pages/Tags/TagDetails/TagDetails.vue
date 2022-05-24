<template>
    <p>TAG DETAILS: {{ tag_slug }}</p>
</template>

<script>
export default {
    name: 'TagDetails',
    computed: {
        tag_slug() {
            return this.$route.params.tag_slug;
        },
    },
    created() {
        // We have to watch the tag_slug because VueJS will not restart the
        // component when the user navigates to a different tag. By watching it,
        // we can respond when it changes
        this.$watch(
            () => this.$route.params,
            (to_params, previous_params) => {
                if (Object.keys(to_params).length > 0) {
                    this.update_tag();
                }
            }
        );

        // Set the tag for now
        this.update_tag();
    },
    methods: {
        update_tag() {
            console.log(`Updating to slug: "${this.tag_slug}"`);
        },
    },
};
</script>
