<template>
    <div v-bind:class="['sidebar', { floating: floating }, { hide: !visible }]">
        Sidebar
    </div>
</template>

<script>
import cmdlist from '../../my/command_list';

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
            ['sidebar_visible_set', false]
        );
        cmdlist.add_command(
            'global',
            'Sidebar',
            'sidebar.show',
            'Show',
            this.$store.commit,
            ['sidebar_visible_set', true]
        );
        cmdlist.add_command(
            'global',
            'Sidebar',
            'sidebar.toggle',
            'Toggle',
            this.$store.commit,
            'sidebar_visible_toggle'
        );
    },
};
</script>
