<template>
    <div class="editabletext">
        <!-- Normal mode -->
        <template v-if="!edit_mode">
            <div v-if="value != null" v-on:click="edit">
                {{ value }}
            </div>
            <div v-if="value == null" class="empty" v-on:click="edit">
                {{ empty_text }}
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
                v-bind:disabled="saving"
                v-bind:validate_re="validate_re"
                v-bind:id="id"
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
            saving: false,
            cancel: false,
            input_error: false,
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
    },
    methods: {
        edit() {
            this.v = this.value;
            this.edit_mode = true;
            this.$nextTick(() => {
                this.$refs.input.focus(true);
            });
        },
        keydown(event) {
            if (event.keyCode == 27) {
                // Cancel
                this.edit_mode = false;
                this.cancel = true;
            }

            if (event.keyCode == 13) {
                // Done!
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
            if (this.$refs.input.is_valid()) {
                if (this.done(this.v)) {
                    this.edit_mode = false;
                    this.cancel = true;
                    this.input_error = false;
                    return;
                }
            }

            console.log('not valid');
            this.input_error = true;
            this.$refs.input.focus(true);
        },
    },
};
</script>