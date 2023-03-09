<template>
    <Grid>
        <Cell cols="12">
            <SectionTitle>{{ tag.title }}</SectionTitle>
        </Cell>
        <Cell cols="12">
            <p>Resources for this tag should come here</p>
        </Cell>
    </Grid>
</template>

<script>
import Grid from '../../../layout/Grid/Grid';
import Cell from '../../../layout/Grid/Cell';
import SectionTitle from '../../../layout/Titles/SectionTitle.vue';

export default {
    name: 'TagDetails',
    components: {
        Grid,
        Cell,
        SectionTitle,
    },
    computed: {
        tag_slug() {
            return this.$route.params.tag_slug;
        },
        tag() {
            return this.$store.state.api_data.tags.filter(
                (tag) => tag.slug == this.tag_slug
            )[0];
        },
    },
    created() {
        this.$store.commit('sidebar_available_set', false);
        this.$store.commit('set_page_title', 'Tag');

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
            // TODO: Retrieve tag details
        },
    },
};
</script>
