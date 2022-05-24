<template>
    <div class="tag">
        <CardListItem
            list_id="tags"
            id="special_add"
            v-bind:loading="loading"
            hide_checkbox
        >
            <div class="tags-col-title">
                <Input
                    v-model="title"
                    type="text"
                    ref="input_title"
                    v-on:key="keydown_title"
                    v-bind:disabled="loading"
                    v-bind:error="error_title"
                    id="add_tag_title"
                    validate_re="^[A-Za-z][A-Za-z0-9\-. ]+$"
                ></Input>
            </div>
            <div class="tags-col-color">
                <Input
                    v-model="color"
                    type="text"
                    ref="input_color"
                    v-on:key="keydown_color"
                    v-bind:disabled="loading"
                    v-bind:error="error_color"
                    id="add_tag_color"
                    validate_re="^[A-Fa-f0-9]{6}$"
                ></Input>
            </div>
            <template v-slot:actions>
                <CardListAction
                    icon="fa-circle-plus"
                    v-bind:action="add"
                    v-bind:loading="loading"
                ></CardListAction>
            </template>
        </CardListItem>
    </div>
</template>

<script>
import CardListItem from '../../cards/CardListItem.vue';
import CardListAction from '../../cards/CardListAction.vue';
import Input from '../../components/Input.vue';

export default {
    name: 'AddTag',
    components: {
        CardListItem,
        CardListAction,
        Input,
    },
    data() {
        return {
            loading: false,
            title: '',
            color: '',
            error_title: false,
            error_color: false,
        };
    },
    methods: {
        reset() {
            this.title = '';
            this.color = '';
            this.$refs.input_title.focus();
        },
        hide() {
            this.eventbus.emit('tags_hide_add_row');
        },
        add() {
            let vue_this = this;

            this.error_title = false;
            this.error_color = false;

            if (!this.$refs.input_title.is_valid()) this.error_title = true;
            if (!this.$refs.input_color.is_valid()) this.error_color = true;

            this.$store.commit('add_tag', {
                title: this.title,
                color: this.color,
                done(data) {
                    console.log(this);
                    vue_this.reset();
                },
                error(error) {
                    // TODO: Error toast
                    vue_this.error_color = true;
                    vue_this.error_title = true;
                    vue_this.$refs.input_title.focus();
                },
            });
        },
        keydown_title(event) {
            if (event.keyCode == 27) {
                this.hide();
            }

            if (event.keyCode == 13) {
                // Go to the color field
                this.$refs.input_color.focus(true);
            }
        },
        keydown_color(event) {
            if (event.keyCode == 27) {
                this.hide();
            }

            if (event.keyCode == 13) {
                // Add the tag
                this.add();
            }
        },
        focus() {
            this.$refs.input_title.focus(true);
        },
    },
};
</script>
