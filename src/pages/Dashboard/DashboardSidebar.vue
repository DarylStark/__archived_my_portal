<template>
    <div>
        <MonthCalendar
            :first_day_sunday="false"
            v-bind:select="navigate_to_date"
            v-bind:highlight="highlight_days"
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
    data() {
        return {
            // TODO: Make sure this is the selected date
            highlight_days: ['2023-01-01', '2023-01-05', '2023-02-01'],
        };
    },
    methods: {
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