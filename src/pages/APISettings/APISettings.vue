<template>
    <Grid id="api_settings">
        <!-- Page title -->

        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
        <Cell cols="8">
            <SectionTitle>Applications</SectionTitle>
        </Cell>
        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>

        <template v-if="!adding">
            <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
            <Cell cols="8" class="add_button">
                <Button icon="fas fa-add" v-on:click="toggle_adding"
                    >Add application</Button
                >
            </Cell>
            <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
        </template>

        <template v-if="adding">
            <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
            <Cell cols="8">
                <AddApplication></AddApplication>
            </Cell>
            <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
        </template>

        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
        <Cell cols="8">
            <Applications></Applications>
        </Cell>
        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
    </Grid>
</template>

<script>
import Grid from '../../layout/Grid/Grid';
import Cell from '../../layout/Grid/Cell';
import SectionTitle from '../../layout/Titles/SectionTitle.vue';
import Applications from './Applications';
import Button from '../../components/Button';
import AddApplication from './AddApplication.vue';
import cmdlist from '../../my/command_list';
import Command from '../../my/command';
import KeyBinding from '../../my/keybinding';

export default {
    name: 'APISettings',
    components: {
        Grid,
        Cell,
        SectionTitle,
        Applications,
        Button,
        AddApplication,
    },
    created() {
        this.$store.commit('sidebar_available_set', false);
        this.eventbus.on('add_application_cancelled', this.toggle_adding);

        // Local Vue object
        let vue_this = this;

        // Add commands
        cmdlist.add_command(
            new Command({
                command: 'api_settings.add',
                scope: 'local-api-settings',
                group: 'API settings',
                title: 'Add application',
                icon: 'fa-plus',
                method: () => {
                    vue_this.adding = true;
                },
                keybinding: new KeyBinding(false, true, false, '+'),
            })
        );
    },
    unmounted() {
        this.eventbus.off('add_application_cancelled', this.toggle_adding);
        cmdlist.remove_command_scope('local-api-settings');
    },
    data() {
        return {
            adding: false,
        };
    },
    methods: {
        toggle_adding() {
            this.adding = !this.adding;
        },
    },
};
</script>
