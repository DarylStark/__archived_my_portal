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
                    <SectionTitle>{{ full_date }}</SectionTitle>
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
    </div>
</template>

<script>
import Grid from '../../layout/Grid/Grid';
import Cell from '../../layout/Grid/Cell';
import SectionTitle from '../../layout/Titles/SectionTitle.vue';
import Tags from './Tags.vue';
import Command from '../../my/command';
import cmdlist from '../../my/command_list';
import KeyBinding from '../../my/keybinding';

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
        };
    },
    computed: {
        date() {
            return this.$route.params.date;
        },
        full_date() {
            let date_obj = new Date(this.actual_date);
            const day_names = [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
            ];
            const month_names = [
                'january',
                'february',
                'march',
                'april',
                'may',
                'june',
                'july',
                'august',
                'september',
                'october',
                'november',
                'december',
            ];

            return `${day_names[date_obj.getDay()]} ${date_obj.getDate()}
            ${month_names[date_obj.getMonth()]}
            ${date_obj.getFullYear()}`;
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

        cmdlist.add_command(
            new Command({
                command: 'dashboard.next_day',
                scope: 'local-dashboard',
                group: 'Dashboard',
                title: 'Next day',
                method: this.move_date,
                args: [1],
                show: true,
                icon: 'fa-arrow-right',
                keybinding: new KeyBinding(true, false, false, '.'),
            })
        );
        cmdlist.add_command(
            new Command({
                command: 'dashboard.previous_day',
                scope: 'local-dashboard',
                group: 'Dashboard',
                title: 'Previous day',
                method: this.move_date,
                args: [-1],
                show: true,
                icon: 'fa-arrow-right',
                keybinding: new KeyBinding(true, false, false, ','),
            })
        );
        cmdlist.add_command(
            new Command({
                command: 'dashboard.today',
                scope: 'local-dashboard',
                group: 'Dashboard',
                title: 'Today',
                method: this.today,
                show: true,
                icon: 'fa-arrow-right',
                keybinding: new KeyBinding(true, false, false, '='),
            })
        );

        // Update the date
        this.update_date();
    },
    unmounted() {
        cmdlist.remove_command_scope('local-dashboard');
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
                let month = String(today.getMonth() + 1).padStart(2, '0');
                let day = String(today.getDate()).padStart(2, '0');
                this.actual_date = `${year}-${month}-${day}`;
            } else {
                this.actual_date = this.date;
            }
        },
        navigate_to_date(date_obj) {
            let year = date_obj.getFullYear();
            let month = String(date_obj.getMonth() + 1).padStart(2, '0');
            let day = String(date_obj.getDate()).padStart(2, '0');

            let date_string = `${year}-${month}-${day}`;
            this.$router.push(`/dashboard/${date_string}`);
        },
        move_date(difference) {
            let date_obj = new Date(this.actual_date);
            date_obj.setDate(date_obj.getDate() + difference);
            this.navigate_to_date(date_obj);
        },
        today() {
            this.navigate_to_date(new Date());
        },
    },
};
</script>
