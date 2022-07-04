<template>
    <div class="monthcalendar">
        <div class="cal_title">
            <div class="nav" v-on:click="prev_month">
                <i
                    class="fa-solid fa-angle-left"
                    v-on:click="move_date(-1)"
                ></i>
            </div>
            <div class="text">{{ title }}</div>
            <div class="nav" v-on:click="next_month">
                <i
                    class="fa-solid fa-angle-right"
                    v-on:click="move_date(-1)"
                ></i>
            </div>
        </div>
        <div class="weekday" v-for="day in days" v-bind:key="day">
            {{ day }}
        </div>
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
    data() {
        return {
            cal_year: 0,
            cal_month: 0,
        };
    },
    created() {
        this.cal_year = this.year;
        this.cal_month = this.month;
    },
    methods: {
        prev_month() {
            this.cal_month--;
            if (this.cal_month < 1) {
                this.cal_month = 12;
                this.cal_year--;
            }
        },
        next_month() {
            this.cal_month++;
            if (this.cal_month > 12) {
                this.cal_month = 1;
                this.cal_year++;
            }
        },
    },
    computed: {
        title() {
            const months = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ];
            return `${months[this.cal_month - 1]} ${this.cal_year}`;
        },
        days() {
            let days = ['S', 'M', 'T', 'W', 'T', 'F', 'S', 'S'];
            return days.slice(
                this.first_day_sunday ? 0 : 1,
                7 + (this.first_day_sunday ? 0 : 1)
            );
        },
        dates() {
            // Calculate the month to display
            let today = new Date();
            let month = this.cal_month ? this.cal_month - 1 : today.getMonth();
            let year = this.cal_year ? this.cal_year : today.getFullYear();

            // Find out what the first day for the view should be
            const first_of_the_month = new Date();
            first_of_the_month.setUTCFullYear(year);
            first_of_the_month.setUTCMonth(month);
            first_of_the_month.setUTCDate(1);
            first_of_the_month.setUTCHours(0);
            first_of_the_month.setUTCMinutes(0);
            first_of_the_month.setUTCSeconds(0);
            let weekday =
                first_of_the_month.getDay() - (this.first_day_sunday ? 0 : 1);
            if (weekday <= 0) weekday += 7;
            first_of_the_month.setDate(first_of_the_month.getDate() - weekday);

            // Create a array with all the dates to display)
            const dates = new Array();
            for (let i = 0; i < 42; i++) {
                dates.push(new Date(first_of_the_month));
                first_of_the_month.setDate(first_of_the_month.getDate() + 1);
            }

            // Return the array
            return dates;
        },
    },
};
</script>
