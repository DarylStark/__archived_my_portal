<template>
    <div id="dashboard_sidebar">
        <div id="today_button">
            <Button icon="fas fa-calendar-day" v-on:click="today">Today</Button>
        </div>
        <MonthCalendar
            :first_day_sunday="false"
            v-bind:select="navigate_to_date"
            v-bind:highlight="highlight_days"
            v-bind:month="current_month"
            v-bind:year="current_year"
            ref="calendar"
        ></MonthCalendar>
    </div>
</template>

<script>
import MonthCalendar from '../../components/MonthCalendar.vue';
import Button from '../../components/Button.vue';

export default {
    name: 'DashboardSidebar',
    components: {
        MonthCalendar,
        Button,
    },
    created() {
        this.$watch(
            () => this.$route.params,
            (to_params, previous_params) => {
                if (Object.keys(to_params).length > 0) {
                    this.update_date();
                }
            }
        );

        this.update_date();
    },
    data() {
        return {
            current_month: null,
            current_year: null,
            highlight_days: null,
        };
    },
    methods: {
        update_date() {
            let selected_date = this.$route.params.date;
            let date = new Date();
            if (selected_date != '') date = new Date(selected_date);

            this.current_month = date.getMonth() + 1;
            this.current_year = date.getFullYear();
            this.highlight_days = [
                `${date.getFullYear()}-${
                    date.getMonth() + 1
                }-${date.getDate()}`,
            ];
        },
        navigate_to_date(date_obj) {
            let year = date_obj.getFullYear();
            let month = String(date_obj.getMonth() + 1).padStart(2, '0');
            let day = String(date_obj.getDate()).padStart(2, '0');

            let date_string = `${year}-${month}-${day}`;
            this.$router.push(`/dashboard/${date_string}`);
        },
        today() {
            this.navigate_to_date(new Date());
        },
    },
};
</script>