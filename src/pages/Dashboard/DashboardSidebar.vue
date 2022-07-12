<template>
    <div>
        <MonthCalendar
            :first_day_sunday="false"
            v-bind:select="navigate_to_date"
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