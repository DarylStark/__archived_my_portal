<template>
    <div class="input">
        <label v-if="!!this.$slots['default']" v-bind:for="id">
            <slot></slot>
        </label>
        <div v-bind:class="outer_class">
            <div class="icon" v-if="icon">
                <i v-bind:class="icon"></i>
            </div>
            <input
                v-bind:type="password ? 'password' : 'text'"
                v-bind:id="id"
                v-bind:name="name"
                v-bind:placeholder="placeholder"
                v-bind:value="modelValue"
                ref="input"
                v-on:input="update_value"
                v-bind:disabled="disabled"
                v-on:keydown="keydown"
                v-on:focusout="focusout"
            />
        </div>
    </div>
</template>

<script>
export default {
    name: 'Input',
    props: {
        id: {
            type: String,
            required: true,
        },
        name: String,
        password: Boolean,
        icon: String,
        placeholder: String,
        modelValue: String,
        error: {
            type: Boolean,
            default: false,
        },
        flat: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        validate_re: {
            type: String,
        },
        align: {
            type: String,
            default: 'left',
        },
    },
    computed: {
        outer_class() {
            // Classlist for the out div of the input

            let classes = [
                'field',
                { error: this.error },
                { disabled: this.disabled },
                { flat: this.flat },
            ];

            if (['left', 'center', 'right'].includes(this.align)) {
                // A correct 'align' type is given
                classes = [...classes, 'align-' + this.align];
            }

            // Return the class list
            return classes;
        },
    },
    emits: ['update:modelValue', 'key', 'focusout', 'enter', 'esc'],
    methods: {
        focus(select = false) {
            this.$refs.input.focus();
            if (select) {
                this.$refs.input.select();
            }
        },
        update_value(event) {
            // Update the local data
            this.value = event.target.value;

            // Send a event so the parent knows the value is changed
            this.$emit('update:modelValue', event.target.value);
        },
        is_valid() {
            // Check if a regex is given
            if (this.validate_re) {
                if (this.modelValue != null) {
                    // Validate the regex
                    let regex = new RegExp(this.validate_re);
                    return regex.test(this.modelValue);
                }
                return false;
            }

            // No regex given; all values are considered correct
            return true;
        },
        enter(event) {
            this.$emit('enter', event);
        },
        esc(event) {
            this.$emit('esc', event);
        },
        keydown(event) {
            this.$emit('key', event);
            if (event.keyCode == 13) this.enter();
            else if (event.keyCode == 27) this.esc();
        },
        focusout(event) {
            this.$emit('focusout', event);
        },
    },
};
</script>
