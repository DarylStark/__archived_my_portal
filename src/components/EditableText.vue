<template>
    <div class="editabletext">
        <!-- Normal mode -->
        <template v-if="!edit_mode">
            <div
                v-if="value != null"
                v-on:click="edit"
                v-bind:style="style"
                v-bind:class="display_as"
            >
                {{ value }}
                <span class="prepend" v-if="prepend">{{ prepend }}</span>
            </div>
            <div
                v-if="value == null || value == ''"
                class="empty_name"
                v-on:click="edit"
            >
                {{ empty_text }}
                <span class="prepend" v-if="prepend">{{ prepend }}</span>
            </div>
        </template>
        <!-- Edit mode -->
        <template v-if="edit_mode">
            <Input
                v-model="v"
                type="text"
                flat
                ref="input"
                v-on:key="keydown"
                v-on:focusout="focusout"
                v-bind:disabled="disabled"
                v-bind:validate_re="validate_re"
                v-bind:id="id"
                v-bind:error="error"
            ></Input>
        </template>
    </div>
</template>

<script>
import Input from './Input.vue';

export default {
    name: 'EditableText',
    components: {
        Input,
    },
    data() {
        return {
            edit_mode: false,
            v: null,
            cancel: false,
            error: false,
        };
    },
    props: {
        value: {},
        empty_text: {},
        done: {
            required: true,
        },
        id: {
            type: String,
            required: true,
        },
        validate_re: {
            type: String,
            required: false,
        },
        disabled: {
            type: Boolean,
            required: false,
        },
        prepend: {
            type: String,
            required: false,
        },
        display_as: {
            type: String,
            required: false,
            default: '',
        },
    },
    computed: {
        style() {
            if (this.display_as == 'tag_color') {
                return {
                    'border-color': `#${this.value}`,
                    background: `#${this.value}90`,
                };
            }
            return {};
        },
    },
    methods: {
        edit() {
            this.v = this.value;
            this.edit_mode = true;
            this.focus(true);
        },
        focus(select = false) {
            this.$nextTick(() => {
                this.$refs.input.focus(select);
            });
        },
        keydown(event) {
            if (event.keyCode == 27) {
                // Cancel
                this.stop_input();
            }

            if (event.keyCode == 13) {
                // Done!
                this.cancel = true;
                this.execute_done();
            }
        },
        focusout() {
            // Done!
            if (!this.cancel) {
                this.execute_done();
            }
            this.cancel = false;
        },
        execute_done() {
            if (this.$refs.input.is_valid() || this.v == null) {
                this.done(this.v || '');
                return;
            }
            this.$refs.input.focus(true);
        },
        stop_input() {
            this.edit_mode = false;
            this.cancel = true;
        },
    },
};
</script>