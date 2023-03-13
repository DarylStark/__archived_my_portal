<template>
    <div v-bind:class="['monthcalendar', { border: border }]">
        <div class="cal_title">
            <div class="nav" v-on:click="prev_month">
                <i class="fa-solid fa-angle-left"></i>
            </div>
            <div class="text">{{ title }}</div>
            <div class="nav" v-on:click="next_month">
                <i class="fa-solid fa-angle-right"></i>
            </div>
        </div>
        <div class="weekday"></div>
        <div class="weekday" v-for="day in days" v-bind:key="day">
            {{ day }}
        </div>
        <template v-for="date in dates" v-bind:key="date">
            <div
                v-bind:class="[
                    'day',
                    {
                        selected: is_date_highlighted(date.date),
                    },
                ]"
                v-on:click="click_on_date(date.date)"
                v-if="date.type == 'date'"
            >
                {{ date.date.getDate() }}
            </div>
            <div class="weeknumber" v-if="date.type == 'weeknumber'">
                {{ date.weeknumber }}
            </div>
        </template>
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
        border: {
            type: Boolean,
            required: false,
            default: false,
        },
        highlight: {
            type: Array,
            default: new Array(),
        },
    },
    data() {
        return {
            cal_year: 0,
            cal_month: 0,
        };
    },
    created() {
        this.set_correct_values();
    },
    watch: {
        month(val) {
            this.set_correct_values();
        },
        year(val) {
            this.set_correct_values();
        },
    },
    methods: {
        set_correct_values() {
            let today = new Date();
            this.cal_year = this.year ? this.year : today.getFullYear();
            this.cal_month = this.month ? this.month : today.getMonth() + 1;
        },
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
        weeknumber(date_object) {
            let date = new Date(date_object.getTime());
            if (date.getDay() == 0) date.setDate(date.getDate() + 1);
            date.setHours(0, 0, 0, 0);

            // Thursday in current week decides the year.
            date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));

            // January 4 is always in week 1.
            var week1 = new Date(date.getFullYear(), 0, 4);

            // Adjust to Thursday in week 1 and count number of weeks from date to week1.
            return (
                1 +
                Math.round(
                    ((date.getTime() - week1.getTime()) / 86400000 -
                        3 +
                        ((week1.getDay() + 6) % 7)) /
                        7
                )
            );
        },
        is_date_highlighted(date_object) {
            return this.dates_to_highlight.includes(date_object.toDateString());
        },
        click_on_date(date) {
            this.select(date, this.is_date_highlighted(date));
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
                let date_obj = new Date(first_of_the_month);
                if (
                    (date_obj.getDay() == 0 && this.first_day_sunday) ||
                    (date_obj.getDay() == 1 && !this.first_day_sunday)
                )
                    dates.push({
                        type: 'weeknumber',
                        weeknumber: this.weeknumber(date_obj),
                    });

                dates.push({
                    type: 'date',
                    date: date_obj,
                });
                first_of_the_month.setDate(first_of_the_month.getDate() + 1);
            }

            // Return the array
            return dates;
        },
        dates_to_highlight() {
            let highlighted = this.highlight;
            highlighted.forEach((element, index, arr) => {
                arr[index] = new Date(element).toDateString();
            });
            return highlighted;
        },
    },
};
</script>
