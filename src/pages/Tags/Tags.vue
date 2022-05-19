<template>
    <Grid>
        <Cell cols="12">
            <SectionTitle>Tags</SectionTitle>
        </Cell>

        <Cell cols="12">
            <CardList id="tags" ref="list">
                <CardListEmpty v-if="count == 0">
                    There are no tags
                </CardListEmpty>
                <template v-slot:headers>
                    <div class="tags-col-title">Tag</div>
                    <div class="tags-col-color">Color</div>
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
                    ></CardListAction>
                </template>
                <template v-slot:actions>
                    <CardListAction
                        list_id="tags"
                        icon="fa-circle-plus"
                        v-bind:action="add"
                    ></CardListAction>
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
import cmdlist from '../../my/command_list';

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
    },
    created() {
        this.$store.commit('sidebar_available_set', false);

        // Event handler for the loading of tags
        this.eventbus.on('get_tags_done', this.stop_refreshing);

        // Event handler for removing individual tags
        this.eventbus.on('remove_tag', this.action_remove);
    },
    unmounted() {
        this.eventbus.off('get_tags_done', this.stop_refreshing);
        this.eventbus.off('remove_tag', this.action_remove);
    },
    data() {
        return {
            refreshing: false,
        };
    },
    computed: {
        tags() {
            return this.$store.state.api_data.tags;
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
            cmdlist.execute('command', 'tags.update');
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
            // TODO: Implement
            console.log('adding');
        },
    },
};
</script>
