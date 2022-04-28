<template>
    <div v-bind:class="['sidebar', { floating: floating }, { hide: !visible }]">
        Sidebar
    </div>
</template>

<script>
import cmdlist from '../../my/command_list';
import KeyBinding from '../../my/keybinding';
import Command from '../../my/command';

export default {
    name: 'Sidebar',
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
            })
        );
    },
};
</script>
