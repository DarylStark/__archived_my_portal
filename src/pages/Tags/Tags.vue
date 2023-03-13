<template>
    <Grid class="page_tags">
        <Cell cols="12">
            <SectionTitle>Tags</SectionTitle>
        </Cell>

        <Cell cols="12">
            <template v-if="!adding">
                <div class="add_button">
                    <Button icon="fas fa-add" v-on:click="add">Add tag</Button>
                </div>
            </template>

            <template v-if="adding">
                <Cell cols="12">
                    <AddTag></AddTag>
                </Cell>
            </template>

            <CardList id="tags" ref="list">
                <CardListEmpty v-if="count == 0">
                    There are no tags
                </CardListEmpty>
                <template v-slot:headers>
                    <div class="tags-col-title">Tag</div>
                </template>
                <template v-if="tags != null">
                    <Tag
                        v-for="tag in tags"
                        v-bind:key="tag.id"
                        v-bind:tag="tag"
                    >
                    </Tag>
                </template>
                <template v-slot:actions_selected>
                    <CardListAction
                        list_id="tags"
                        icon="fa-trash"
                        v-bind:action="action_remove_selected"
                        confirm_first
                        v-bind:command="cmd_delete"
                    ></CardListAction>
                </template>
                <template v-slot:actions>
                    <CardListAction
                        list_id="tags"
                        icon="fa-arrows-rotate"
                        v-bind:action="refresh"
                        v-bind:loading="refreshing"
                    ></CardListAction>
                </template>
            </CardList>
        </Cell>
    </Grid>
</template>

<script>
import Grid from '../../layout/Grid/Grid';
import Cell from '../../layout/Grid/Cell';
import SectionTitle from '../../layout/Titles/SectionTitle.vue';
import CardList from '../../cards/CardList';
import CardListAction from '../../cards/CardListAction';
import CardListEmpty from '../../cards/CardListEmpty';
import Tag from './Tag';
import AddTag from './AddTag.vue';
import cmdlist from '../../my/command_list';
import Command from '../../my/command';
import KeyBinding from '../../my/keybinding';
import Button from '../../components/Button';

export default {
    name: 'Tags',
    components: {
        Grid,
        Cell,
        SectionTitle,
        CardList,
        CardListAction,
        CardListEmpty,
        Tag,
        AddTag,
        Button,
    },
    created() {
        this.$store.commit('sidebar_available_set', false);
        this.$store.commit('set_page_title', 'Tags');

        // Event handler for the loading of tags
        this.eventbus.on('get_tags_done', this.stop_refreshing);

        // Event handler for removing individual tags
        this.eventbus.on('remove_tag', this.action_remove);

        // Event handler for hiding the 'add' row
        this.eventbus.on('tags_hide_add_row', this.add);

        // Add command to add tags
        cmdlist.add_command(
            new Command({
                command: 'page_tags.toggle_add',
                scope: 'local-tags',
                group: 'Tags',
                title: 'Toggle add',
                method: this.add,
                show: true,
                icon: 'fa-circle-plus',
                keybinding: new KeyBinding(false, true, false, '+'),
            })
        );
    },
    beforeUnmount() {
        this.eventbus.off('get_tags_done', this.stop_refreshing);
        this.eventbus.off('remove_tag', this.action_remove);
        this.eventbus.off('tags_hide_add_row', this.add);
        cmdlist.remove_command_scope('local-tags');
    },
    data() {
        return {
            refreshing: false,
            adding: false,
            cmd_delete: new Command({
                command: 'page_tags.remove',
                scope: 'local-tags',
                group: 'Tags',
                title: 'Remove selected tags',
                icon: 'fa-trash',
                show: true,
                keybinding: new KeyBinding(false, false, false, 'DELETE'),
            }),
        };
    },
    computed: {
        tags() {
            return this.$store.state.api_data.tags.sort((first, second) => {
                if (first.title.toLowerCase() > second.title.toLowerCase()) {
                    return 1;
                }
                return -1;
            });
        },
        count() {
            if (this.tags != null) {
                return this.tags.length;
            }
            return -1;
        },
    },
    methods: {
        refresh() {
            this.refreshing = true;
            cmdlist.execute('tags.update');
        },
        stop_refreshing() {
            this.refreshing = false;
        },
        remove_tags(tags) {
            // Delete the tags
            this.$store.commit('delete_tags', {
                tags: tags,
                done: (data) => {
                    tags.forEach((session) => {
                        // Emit a event to remove it from the 'selected' list
                        this.eventbus.emit('card_list_changed_tags', {
                            action: 'change_selection',
                            id: `tag_id_${session}`,
                            type: 'remove',
                        });
                    });
                },
            });
        },
        action_remove(id) {
            this.remove_tags([id]);
        },
        action_remove_selected() {
            // Get all ID's of selected elements
            let selected = new Array();
            this.$refs.list.selected.forEach((element) => {
                element = element.replace('tag_id_', '');
                selected.push(element);
            });

            // Remove the elements
            this.remove_tags(selected);
        },
        add() {
            this.adding = !this.adding;
        },
    },
};
</script>
