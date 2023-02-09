<template>
    <Card no_padding>
        <div v-if="!tags_loaded" class="loading_tags">
            <div><i class="fas fa-spinner spin"></i></div>
            <div>Loading tags</div>
        </div>
        <div class="tags" v-if="tags_loaded && tags.length > 0">
            <div
                v-bind:class="['add_tag_icon', { spin: adding }]"
                v-on:click="add_tag"
                v-if="tags"
            >
                <i class="fas fa-add"></i>
            </div>
            <TagButton
                v-for="tag in tags"
                v-bind:tag="tag"
                v-bind:key="tag"
                v-bind:delete_method="delete_tag"
            ></TagButton>
        </div>
        <div class="empty_tags" v-if="tags_loaded && tags.length == 0">
            <p>This day has no tags yet</p>
            <div class="add_tag_icon" v-on:click="add_tag" v-if="tags">
                <template v-if="!adding">
                    <i class="fas fa-add"></i>
                    Add tag
                </template>
                <template v-if="adding">
                    <i class="fas fa-spinner spin"></i> Adding tag
                </template>
            </div>
        </div>
    </Card>
</template>

<script>
import Card from '../../cards/Card.vue';
import TagButton from '../../components/TagButton.vue';
import cmdlist from '../../my/command_list';
import Command from '../../my/command';
import eventbus from '../../dashboard-eventbus';
import KeyBinding from '../../my/keybinding';

export default {
    name: 'Tags',
    components: {
        Card,
        TagButton,
    },
    props: {
        date: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            tags_loaded: false,
            refresh_key: true,
            adding: false,
        };
    },
    watch: {
        date: function (new_value, old_value) {
            this.update_tags();
        },
    },
    computed: {
        tags() {
            // Property to force the tags to refresh
            this.refresh_key;

            if (this.$store.state.api_data.tags) {
                if (this.tags_loaded) {
                    console.log('HERE');
                    let all_tags =
                        this.$store.state.api_data.dashboard_tags[this.date];
                    if (!all_tags) return [];

                    // Extract all tag IDs from the source
                    const tag_ids = this.$store.state.api_data.dashboard_tags[
                        this.date
                    ].map((e) => e.tag_id);

                    // Create a array with all relevant tag objects
                    const tag_list = this.$store.state.api_data.tags.filter(
                        (tag) => tag_ids.indexOf(tag.id) >= 0
                    );

                    // Return the created array
                    return tag_list.sort((tag_a, tag_b) =>
                        tag_a.title > tag_b.title ? 1 : -1
                    );
                }
            }
            return new Array();
        },
    },
    created() {
        // Add command to update tags for this specific date
        cmdlist.add_command(
            new Command({
                command: 'dashboard.tags.update',
                scope: 'local-dashboard-tags',
                group: 'Dashboard',
                title: 'Update tags',
                method: this.update_tags,
                args: true,
                show: true,
                icon: 'fa-arrows-rotate',
            })
        );
        cmdlist.add_command(
            new Command({
                command: 'dashboard.tags.add',
                scope: 'local-dashboard-tags',
                group: 'Dashboard',
                title: 'Add tag',
                method: this.add_tag,
                show: false,
                icon: 'fa-add',
                keybinding: new KeyBinding(true, true, false, '#'),
            })
        );

        this.update_tags();
    },
    unmounted() {
        cmdlist.remove_command_scope('local-dashboard-tags');
    },
    methods: {
        update_tags(force = false) {
            console.log('Begin update tags');
            let vue_this = this;
            this.tags_loaded = false;
            this.$store.commit('update_tags_for_date', {
                date: this.date,
                force: force,
                done: (data) => {
                    vue_this.tags_loaded = true;
                    console.log('Done updating tags');
                },
            });
        },
        delete_tag(tag) {
            tag.loading = true;
            // Method to delete a tag from this specific day
            this.$store.commit('untag_date', {
                date: this.date,
                tag_id: tag.id,
                done: () => {
                    this.refresh_key = !this.refresh_key;
                    tag.loading = false;
                },
                error: () => {
                    // TODO: give error
                    tag.loading = false;
                },
            });
        },
        set_adding() {
            this.adding = true;
            eventbus.on('command_palette_closed_no_save', this.set_not_adding);
        },
        set_not_adding() {
            this.adding = false;
            eventbus.off('command_palette_closed_no_save', this.set_not_adding);
        },
        add_selected_tags(tag) {
            this.$store.commit('tag_date', {
                date: this.date,
                tag_id: tag.id,
                done: () => {
                    this.refresh_key = !this.refresh_key;
                    this.set_not_adding();
                },
                error: () => {
                    this.set_not_adding();
                },
            });
        },
        add_tag() {
            if (!this.adding) {
                // Method to add a tag to this specific day

                // TODO: Make sure the user can only select tags in the command palette
                this.$store.commit(
                    'set_command_palette_command',
                    this.add_selected_tags
                );
                this.set_adding();
                cmdlist.execute('command_palette.show_tag_picker');
            }
        },
    },
};
</script>