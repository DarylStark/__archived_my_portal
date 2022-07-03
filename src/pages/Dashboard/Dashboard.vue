<template>
    <div class="page_dashboard">
        <Grid>
            <Cell cols="12">
                <div class="title">
                    <div class="previous">
                        <i
                            class="fa-solid fa-arrow-left"
                            v-on:click="move_date(-1)"
                        ></i>
                    </div>
                    <SectionTitle>Dashboard for {{ actual_date }}</SectionTitle>
                    <div class="next">
                        <i
                            class="fa-solid fa-arrow-right"
                            v-on:click="move_date(1)"
                        ></i>
                    </div>
                </div>
            </Cell>
            <Cell cols="12">
                <Tags v-bind:date="actual_date"></Tags>
            </Cell>
        </Grid>
        <p>
            <router-link to="/dashboard/">No milk, <b>today</b></router-link>
        </p>
        <p>
            <router-link to="/dashboard/2022-10-26">Oct 26, 2022</router-link>
        </p>
        <p>
            <router-link to="/dashboard/2023-01-20">Jan 20, 2023</router-link>
        </p>
        <MonthCalendar
            year="2022"
            month="10"
            :first_day_sunday="false"
            v-bind:select="navigate_to_date"
        ></MonthCalendar>
    </div>
</template>

<script>
import Grid from '../../layout/Grid/Grid';
import Cell from '../../layout/Grid/Cell';
import SectionTitle from '../../layout/Titles/SectionTitle.vue';
import Tags from './Tags.vue';
import MonthCalendar from '../../components/MonthCalendar.vue';

export default {
    name: 'Dashboard',
    components: {
        Grid,
        Cell,
        SectionTitle,
        Tags,
        MonthCalendar,
    },
    data() {
        return {
            actual_date: null,
        };
    },
    computed: {
        date() {
            return this.$route.params.date;
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
        },
        navigate_to_date(date_obj) {
            let year = date_obj.getFullYear();
            let month = String(date_obj.getUTCMonth() + 1).padStart(2, '0');
            let day = String(date_obj.getUTCDate()).padStart(2, '0');

            let date_string = `${year}-${month}-${day}`;
            this.$router.push(`/dashboard/${date_string}`);
        },
        move_date(difference) {
            let date_obj = new Date(this.actual_date);
            date_obj.setDate(date_obj.getDate() + difference);
            this.navigate_to_date(date_obj);
        },
    },
};
</script>
