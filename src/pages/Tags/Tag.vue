<template>
    <div class="tag">
        <CardListItem
            list_id="tags"
            v-bind:id="id"
            v-bind:loading="tag.loading"
        >
            <div class="tags-col-title">
                <EditableText
                    v-bind:value="tag.title"
                    empty_text="No title"
                    v-bind:id="id"
                    v-bind:done="save_title"
                    validate_re="^[A-Za-z][A-Za-z0-9\-. ]+$"
                    ref="editabletext_title"
                    v-bind:disabled="tag.loading"
                >
                </EditableText>
            </div>
            <div class="tags-col-color">
                <EditableText
                    v-bind:value="tag.color"
                    empty_text="No color"
                    v-bind:id="id"
                    v-bind:done="save_color"
                    validate_re="^[A-Fa-f0-9]{6}$"
                    ref="editabletext_color"
                    v-bind:disabled="tag.loading"
                    display_as="tag_color"
                >
                </EditableText>
            </div>
            <template v-slot:actions>
                <CardListAction
                    list_id="tags"
                    icon="fa-list"
                    v-bind:action="detail_page"
                ></CardListAction>
                <CardListAction
                    icon="fa-trash"
                    v-bind:action="action_remove"
                    confirm_first
                    v-bind:loading="tag.loading"
                ></CardListAction>
            </template>
        </CardListItem>
    </div>
</template>

<script>
import CardListAction from '../../cards/CardListAction';
import CardListItem from '../../cards/CardListItem.vue';
import EditableText from '../../components/EditableText';

export default {
    name: 'Tag',
    components: {
        CardListItem,
        CardListAction,
        EditableText,
    },
    props: {
        tag: {
            required: true,
        },
    },
    computed: {
        id() {
            return `tag_id_${this.tag.id}`;
        },
    },
    methods: {
        save_title(new_title) {
            let vue_this = this;

            this.$store.commit('set_tag', {
                id: this.tag.id,
                title: new_title,
                done: (data) => {
                    this.$refs.editabletext_title.stop_input();
                },
                error: (error) => {
                    this.eventbus.emit('toast_show', {
                        title: 'Tag already exists',
                        text: 'The chosen name for this tag already exists.',
                        type: 'error',
                        icon: 'fa-tag',
                    });

                    this.$refs.editabletext_title.error = true;
                    this.$refs.editabletext_title.focus(true);
                },
            });
        },
        save_color(new_color) {
            this.$store.commit('set_tag', {
                id: this.tag.id,
                color: new_color,
                done: (data) => {
                    this.$refs.editabletext_color.stop_input();
                },
                error: (error) => {
                    this.eventbus.emit('toast_show', {
                        title: 'Tag already exists',
                        text: 'The chosen name for this tag already exists.',
                        type: 'error',
                        icon: 'fa-tag',
                    });

                    this.$refs.editabletext_color.error = true;
                    this.$refs.editabletext_color.focus(true);
                },
            });
        },
        action_remove() {
            this.eventbus.emit('remove_tag', this.tag.id);
        },
        detail_page() {
            // TODO: Implement
            this.$router.push(`/tags/${this.tag.slug}`);
        },
    },
};
</script>