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
                    validate_re="^[A-Za-z0-9\ \-\._]*$"
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
                    validate_re="^[A-Fa-f0-9]{3,6}$"
                    ref="editabletext_color"
                    v-bind:disabled="tag.loading"
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
            // TODO: Implement
            console.log('save title');
        },
        save_color(new_color) {
            // TODO: Implement
            console.log('save color');
        },
        action_remove() {
            this.eventbus.emit('remove_tag', this.tag.id);
        },
        detail_page() {
            // TODO: Implement
            console.log('open detail page');
        },
    },
};
</script>