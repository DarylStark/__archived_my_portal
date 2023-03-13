<template>
    <Grid>
        <Cell cols="12">
            <SectionTitle>{{ tag.title }}</SectionTitle>
        </Cell>
        <Cell cols="12">
            <TagDetailForm v-bind:tag="tag"></TagDetailForm>
        </Cell>
        <Cell cols="12">
            <SectionTitle>Tagged dates</SectionTitle>
        </Cell>
        <Cell cols="12">
            <TagDates v-bind:tag="tag"></TagDates>
        </Cell>
    </Grid>
</template>

<script>
import Grid from '../../../layout/Grid/Grid';
import Cell from '../../../layout/Grid/Cell';
import SectionTitle from '../../../layout/Titles/SectionTitle.vue';
import TagDetailForm from './TagDetailForm.vue';
import TagDates from './TagDates.vue';

export default {
    name: 'TagDetails',
    components: {
        Grid,
        Cell,
        SectionTitle,
        TagDetailForm,
        TagDates,
    },
    computed: {
        tag_slug() {
            return this.$route.params.tag_slug;
        },
        tag() {
            let tag_details = null;

            tag_details = this.$store.state.api_data.tags.filter(
                (tag) => tag.slug == this.tag_slug
            )[0];

            if (tag_details) {
                this.cached_tag = tag_details;
                return tag_details;
            }
            return this.cached_tag;
        },
    },
    data() {
        return {
            cached_tag: null,
        };
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
