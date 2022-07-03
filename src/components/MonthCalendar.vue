<template>
    <div class="monthcalendar">
        <div
            class="day"
            v-for="date in dates"
            v-bind:key="date"
            v-on:click="select(date)"
        >
            {{ date.getDate() }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'MonthCalendar',
    props: {
        month: {
            type: Number,
            required: false,
            default: null,
        },
        year: {
            type: Number,
            required: false,
            default: null,
        },
        first_day_sunday: {
            type: Boolean,
            required: false,
            default: false,
        },
        select: {
            required: true,
        },
    },
    computed: {
        dates() {
            // Calculate the month to display
            const today = new Date();
            const month = this.month ? this.month - 1 : today.getMonth();
            const year = this.year ? this.year : today.getFullYear();

            // Find out what the first day for the view should be
            const start_date = new Date();
            start_date.setUTCFullYear(year);
            start_date.setUTCMonth(month);
            start_date.setUTCDate(1);
            start_date.setUTCHours(0);
            start_date.setUTCMinutes(0);
            start_date.setUTCSeconds(0);
            const startday = this.first_day_sunday ? 0 : 1;

            // TODO: Make sure the first day is a sunday or monday, depening on the
            //       first_day_sunday setting

            // Create a array with all the dates to display)
            const dates = new Array();
            for (let i = 0; i < 42; i++) {
                dates.push(new Date(start_date));
                start_date.setDate(start_date.getDate() + 1);
            }

            // Return the array
            return dates;
        },
    },
};
</script>
