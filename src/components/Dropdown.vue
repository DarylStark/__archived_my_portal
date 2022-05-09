<template>
    <select v-model="selected_value" v-on:change="update" class="dropdown">
        <option
            v-for="option in options"
            v-bind:key="option.value"
            v-bind:value="option.value"
            v-bind:disabled="disabled"
        >
            {{ option.title }}
        </option>
    </select>
</template>

<script>
export default {
    name: 'Dropdown',
    props: {
        options: {
            type: Array,
            required: true,
        },
        selected: {
            type: String,
            required: true,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['changed'],
    data() {
        return {
            selected_value: this.selected,
        };
    },
    methods: {
        update() {
            this.$emit('changed');
        },
        set_value(value) {
            console.log(value);
            this.selected_value = value;
        },
    },
};
</script>
