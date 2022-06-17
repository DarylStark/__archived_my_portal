<template>
    <div class="page_dashboard">
        <Grid>
            <Cell cols="12">
                <SectionTitle>Dashboard for {{ actual_date }}</SectionTitle>
            </Cell>
            <Cell cols="12">
                <Tags v-bind:tags="tags" v-bind:date="actual_date"></Tags>
            </Cell>
        </Grid>
    </div>
</template>

<script>
import Grid from '../../layout/Grid/Grid';
import Cell from '../../layout/Grid/Cell';
import SectionTitle from '../../layout/Titles/SectionTitle.vue';
import Tags from './Tags.vue';

export default {
    name: 'Dashboard',
    components: {
        Grid,
        Cell,
        SectionTitle,
        Tags,
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
            // Make sure this gets recomputed when the counter changes
            this.$store.state.api_data.dashboard_counter;

            if (this.tags_loaded && this.$store.state.api_data.tags) {
                let tags = this.$store.state.api_data.tags.filter(
                    (tag) =>
                        this.$store.state.api_data.dashboard[
                            this.actual_date
                        ].tags.indexOf(tag.id) > -1
                );
                // TODO: SORT
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
    },
};
</script>
