<template>
    <div v-bind:class="['sidebar', { floating: floating }, { hide: !visible }]">
        <MonthCalendar
            :first_day_sunday="false"
            v-bind:select="navigate_to_date"
        ></MonthCalendar>
    </div>
</template>

<script>
import cmdlist from '../../my/command_list';
import KeyBinding from '../../my/keybinding';
import Command from '../../my/command';
import MonthCalendar from '../../components/MonthCalendar.vue';

export default {
    name: 'Sidebar',
    components: {
        MonthCalendar,
    },
    computed: {
        visible() {
            return this.$store.state.ui.sidebar_visible;
        },
        floating() {
            return this.$store.state.ui.device_type == 'phone';
        },
    },
    created() {
        cmdlist.add_command(
            new Command({
                command: 'sidebar.hide',
                group: 'Sidebar',
                title: 'Hide',
                method: this.$store.commit,
                args: ['sidebar_visible_set', false],
                icon: 'fa-list-ul',
            })
        );

        cmdlist.add_command(
            new Command({
                command: 'sidebar.show',
                group: 'Sidebar',
                title: 'Show',
                method: this.$store.commit,
                args: ['sidebar_visible_set', true],
                icon: 'fa-list-ul',
            })
        );

        cmdlist.add_command(
            new Command({
                command: 'sidebar.toggle',
                group: 'Sidebar',
                title: 'Toggle',
                method: this.$store.commit,
                args: 'sidebar_visible_toggle',
                icon: 'fa-list-ul',
                keybinding: new KeyBinding(true, true, false, 'B'),
            })
        );
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
