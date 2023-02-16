<template>
    <div v-bind:class="['item', { checked: value }]">
        <div v-if="checkbox" v-bind:class="['checkbox', { loading: loading }]">
            <input
                type="checkbox"
                v-on:change="check"
                v-model="value"
                v-show="!loading"
                v-bind:class="{ hide: hide_checkbox }"
                v-bind:id="id"
            />
            <i class="fas fa-spinner spin" v-show="loading"></i>
        </div>
        <div class="columns">
            <template v-if="content_as_label">
                <label v-bind:for="id">
                    <slot></slot>
                </label>
            </template>
            <template v-if="!content_as_label">
                <slot></slot>
            </template>
        </div>
        <div class="actions">
            <slot name="actions"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CardListItem',
    props: {
        id: {
            type: String,
            required: true,
        },
        list_id: {
            type: String,
            required: true,
        },
        checkbox: {
            type: Boolean,
            required: false,
            default: true,
        },
        checked: {
            type: Boolean,
            required: false,
            default: false,
        },
        loading: {
            type: Boolean,
            required: false,
            default: false,
        },
        hide_checkbox: {
            type: Boolean,
            required: false,
            default: false,
        },
        content_as_label: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    created() {
        // Create the string for events to listen on
        this.event = `card_list_changed_${this.list_id}`;

        // Set the value
        this.value = this.checked;

        // Subscribe to events for this list
        this.eventbus.on(this.event, this.check_all);
    },
    unmounted() {
        this.eventbus.off(this.event, this.check_all);
    },
    data() {
        return {
            value: false,
            event: '',
        };
    },
    methods: {
        check() {
            if (!this.id.includes('special_')) {
                this.eventbus.emit(this.event, {
                    action: 'change_selection',
                    id: this.id,
                    type: this.value ? 'add' : 'remove',
                });
            }
        },
        check_all(data) {
            // A event is submitted, check if we need to check this element or
            // uncheck it
            if (data.action == 'check_all') {
                if (this.value != data.value) {
                    this.value = data.value;
                    this.check();
                }
            }
        },
        toggle() {
            this.value = !this.value;
            this.check();
        },
    },
};
</script>
