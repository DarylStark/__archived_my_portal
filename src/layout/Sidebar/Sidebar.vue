<template>
    <div v-bind:class="['sidebar', { floating: floating }, { hide: !visible }]">
        Sidebar
    </div>
</template>

<script>
import cmdlist from '../../my/command_list';
import KeyBinding from '../../my/keybinding';

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
            'global',
            'Sidebar',
            'sidebar.hide',
            'Hide',
            this.$store.commit,
            ['sidebar_visible_set', false],
            true,
            undefined,
            true,
            'fa-list-ul'
        );
        cmdlist.add_command(
            'global',
            'Sidebar',
            'sidebar.show',
            'Show',
            this.$store.commit,
            ['sidebar_visible_set', true],
            true,
            undefined,
            true,
            'fa-list-ul'
        );
        cmdlist.add_command(
            'global',
            'Sidebar',
            'sidebar.toggle',
            'Toggle',
            this.$store.commit,
            'sidebar_visible_toggle',
            true,
            new KeyBinding(true, true, false, 'B'),
            true,
            'fa-list-ul'
        );
    },
};
</script>
