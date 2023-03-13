<template>
    <Card class="add_form">
        <template v-slot:title>Add tag</template>
        <template v-slot:title_actions>
            <CardTitleAction
                icon="fa-xmark"
                v-bind:action="cancel"
            ></CardTitleAction>
        </template>
        <Input
            v-bind:error="error_title"
            id="title"
            v-model="title"
            icon="fas fa-tag"
            ref="input_title"
            v-on:enter="focus_next(1)"
            v-bind:disabled="saving"
            validate_re="^[A-Za-z][A-Za-z0-9\-. ]+$"
            >Name</Input
        >
        <Input
            v-bind:error="error_color"
            id="color"
            v-model="color"
            icon="fas fa-palette"
            ref="input_color"
            v-on:enter="focus_next(2)"
            v-bind:disabled="saving"
            validate_re="^[A-Fa-f0-9]{6}$"
            >Color</Input
        >

        <div class="save">
            <Button
                v-on:click="save"
                icon="fas fa-tag"
                v-bind:disabled="saving"
                v-bind:saving="saving"
                >Add tag</Button
            >
        </div>
    </Card>
</template>

<script>
import Card from '../../cards/Card';
import CardTitleAction from '../../cards/CardTitleAction';
import Input from '../../components/Input';
import Button from '../../components/Button';
import cmdlist from '../../my/command_list';
import Command from '../../my/command';
import KeyBinding from '../../my/keybinding';

export default {
    name: 'AddTag',
    components: {
        Card,
        CardTitleAction,
        Input,
        Button,
    },
    created() {
        // Local Vue object
        let vue_this = this;

        // Add commands
        cmdlist.add_command(
            new Command({
                command: 'page_tags.cancel_adding',
                scope: 'local-page-tags-adding',
                group: 'Tags',
                title: 'Cancel adding',
                icon: 'fa-plus',
                method: () => {
                    vue_this.cancel();
                },
                keybinding: new KeyBinding(false, false, false, 'ESCAPE'),
            })
        );
    },
    mounted() {
        this.$refs.input_title.focus();
    },
    beforeUnmount() {
        cmdlist.remove_command_scope('local-page-tags-adding');
    },
    data() {
        return {
            saving: false,
            title: '',
            color: '',
            error_title: false,
            error_color: false,
        };
    },
    methods: {
        save() {
            let vue_this = this;

            this.error_title = false;
            this.error_color = false;

            if (!this.$refs.input_title.is_valid()) this.error_title = true;
            if (!this.$refs.input_color.is_valid()) this.error_color = true;

            if (this.error_title) {
                this.$refs.input_title.focus(true);
                return;
            }

            if (this.error_color) {
                this.$refs.input_color.focus(true);
                return;
            }

            this.saving = true;

            this.$store.commit('add_tag', {
                title: this.title,
                color: this.color,
                done(data) {
                    vue_this.saving = false;
                    vue_this.cancel();
                },
                error(error) {
                    // TODO: Error toast
                    vue_this.saving = false;
                    vue_this.error_title = true;
                    vue_this.error_color = true;

                    vue_this.$nextTick(() => {
                        vue_this.$refs.input_title.focus(true);
                    });

                    console.log('error');
                },
            });
        },
        cancel() {
            this.eventbus.emit('tags_hide_add_row');
        },
        focus_next(index) {
            if (index == 1) this.$refs.input_color.focus();
            if (index == 2) this.save();
        },
    },
};
</script>
