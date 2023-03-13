<template>
    <CardList id="tag_details" v-bind:checkbox="false" class="detail_card">
        <CardListItem
            id="title"
            list_id="tag_details"
            v-bind:checkbox="false"
            v-bind:loading="true"
            v-if="tag"
        >
            <div class="details_left">Title</div>
            <div class="details_right">
                <EditableText
                    v-bind:value="tag.title"
                    empty_text="No name"
                    v-bind:id="get_id('tag_title')"
                    v-bind:done="save_title"
                    validate_re="^[A-Za-z][A-Za-z0-9\-. ]+$"
                    ref="editabletext_tag_title"
                    v-bind:disabled="tag.loading"
                >
                </EditableText>
            </div>
        </CardListItem>
        <CardListItem
            id="title"
            list_id="tag_details"
            v-bind:checkbox="false"
            v-bind:loading="true"
        >
            <div class="details_left">Color</div>
            <div class="details_right">
                <EditableText
                    v-bind:value="tag.color"
                    empty_text="No color set"
                    v-bind:id="get_id('tag_color')"
                    v-bind:done="save_color"
                    validate_re="^[A-Fa-f0-9]{6}$"
                    ref="editabletext_tag_color"
                    v-bind:disabled="tag.loading"
                >
                </EditableText>
                <TagLine v-bind:color="tag.color"></TagLine>
            </div>
        </CardListItem>
    </CardList>
</template>

<script>
import CardList from '../../../cards/CardList';
import CardListItem from '../../../cards/CardListItem';
import EditableText from '../../../components/EditableText';
import { get_slug_for_name } from '../../../my/generic';
import TagLine from './../TagLine.vue';

export default {
    name: 'TagDetailForm',
    props: {
        tag: {
            required: true,
        },
    },
    components: {
        CardList,
        CardListItem,
        EditableText,
        TagLine,
    },
    methods: {
        get_id(prepend) {
            return `${prepend}_${this.tag.id}`;
        },
        save_title(new_title) {
            let vue_this = this;
            this.$store.commit('set_tag', {
                id: this.tag.id,
                title: new_title,
                done: (data) => {
                    this.$refs.editabletext_tag_title.stop_input();
                    this.$router.replace(
                        `/tags/${get_slug_for_name(new_title)}`
                    );
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
                    this.$refs.editabletext_tag_color.stop_input();
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
    },
};
</script>
