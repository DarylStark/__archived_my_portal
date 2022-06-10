<template>
    <div class="page_dashboard">
        <Grid>
            <Cell cols="12">
                <SectionTitle>Dashboard for {{ actual_date }}</SectionTitle>
            </Cell>
            <Cell cols="12">
                <div v-if="!tags">Tags still loading</div>
                <div class="tags" v-if="tags && tags.length > 0">
                    <TagButton
                        v-for="tag in tags"
                        v-bind:tag="tag"
                        v-bind:key="tag"
                        v-bind:delete_method="delete_tag"
                    ></TagButton>
                </div>
                <div v-if="tags && tags.length == 0">no tags, mate</div>
                <button v-on:click="add_tag">add tag</button>
            </Cell>
        </Grid>
    </div>
</template>

<script>
import Grid from '../../layout/Grid/Grid';
import Cell from '../../layout/Grid/Cell';
import SectionTitle from '../../layout/Titles/SectionTitle.vue';
import TagButton from '../../components/TagButton.vue';

export default {
    name: 'Dashboard',
    components: {
        Grid,
        Cell,
        SectionTitle,
        TagButton,
    },
    data() {
        return {
            actual_date: null,
            tags_loaded: false,
        };
    },
    computed: {
        date() {
            return this.$route.params.date;
        },
        tags() {
            // TODO: SORT
            if (this.tags_loaded && this.$store.state.api_data.tags) {
                let tags = this.$store.state.api_data.tags.filter(
                    (tag) =>
                        this.$store.state.api_data.dashboard[
                            this.actual_date
                        ].tags.indexOf(tag.id) > -1
                );
                return tags;
            }
            return null;
        },
    },
    created() {
        this.$store.commit('sidebar_available_set', true);

        // We have to watch the params because VueJS will not restart the
        // component when the user navigates to a different date. By watching
        // it, we can respond when it changes
        this.$watch(
            () => this.$route.params,
            (to_params, previous_params) => {
                if (Object.keys(to_params).length > 0) {
                    this.update_date();
                }
            }
        );

        // Update the date
        this.update_date();
    },
    methods: {
        update_date() {
            let regex_date = new RegExp('^([0-9]{4}-[01][0-9]-[0-3][0-9])$');

            if (
                this.date == '' ||
                this.date == null ||
                !regex_date.test(this.date)
            ) {
                // No (valid) date is set, get the date of today
                let today = new Date();
                let year = today.getFullYear();
                let month = String(today.getUTCMonth() + 1).padStart(2, '0');
                let day = String(today.getUTCDate()).padStart(2, '0');
                this.actual_date = `${year}-${month}-${day}`;
            } else {
                this.actual_date = this.date;
            }

            // Update the data for this dashboard view
            let vue_this = this;
            this.$store.commit('update_tags_for_date', {
                date: this.actual_date,
                done: () => {
                    vue_this.tags_loaded = true;
                },
            });
        },
        delete_tag(tag) {
            // Method to delete a tag from this specific day
            console.log(tag);
        },
        add_tag() {
            // Method to add a tag to this specific day
            this.$store.commit('tag_date', {
                date: this.actual_date,
                tag_id: 1,
            });
        },
    },
};
</script>
