<template>
    <div>
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

export default {
    name: 'DashboardSidebar',
    components: {
        MonthCalendar,
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
            highlight_days: ['2023-01-01', '2023-01-05', '2023-02-01'],
        };
    },
    methods: {
        update_date() {
            let selected_date = this.$route.params.date;
            if (selected_date == '') {
                this.current_month = null;
                this.current_year = null;
            } else {
                let date = new Date(selected_date);
                this.current_month = date.getUTCMonth() + 1;
                this.current_year = date.getFullYear();
            }
        },
        navigate_to_date(date_obj) {
            let year = date_obj.getFullYear();
            let month = String(date_obj.getUTCMonth() + 1).padStart(2, '0');
            let day = String(date_obj.getUTCDate()).padStart(2, '0');

            let date_string = `${year}-${month}-${day}`;
            this.$router.push(`/dashboard/${date_string}`);
        },
    },
};
</script>