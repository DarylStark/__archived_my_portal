<template>
    <div class="tag">
        <CardListItem
            list_id="tags"
            v-bind:id="id"
            v-bind:loading="tag.loading"
            content_as_label
        >
            <div class="tags-col-title">
                <p class="title">{{ tag.title }}</p>
                <TagLine v-bind:color="tag.color"></TagLine>
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
import TagLine from './TagLine.vue';

export default {
    name: 'Tag',
    components: {
        CardListItem,
        CardListAction,
        EditableText,
        TagLine,
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
        action_remove() {
            this.eventbus.emit('remove_tag', this.tag.id);
        },
        detail_page() {
            this.$router.push(`/tags/${this.tag.slug}`);
        },
    },
};
</script>