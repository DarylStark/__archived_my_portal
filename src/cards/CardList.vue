<template>
    <Card no_padding class="list">
        <!-- When loading -->
        <template v-if="loading">
            <slot></slot>
        </template>
        <!-- when not loading -->
        <template v-if="!loading">
            <div
                class="actions_selected"
                v-if="$slots.actions_selected && selected.length > 0"
            >
                <div v-if="checkbox" class="checkbox">
                    <input
                        type="checkbox"
                        v-on:change="change_all"
                        v-model="check_all"
                        ref="checkall_1"
                    />
                </div>
                <div class="count">{{ selected_count_text }}</div>
                <div class="actions">
                    <slot name="actions_selected"></slot>
                </div>
            </div>
            <div class="headers" v-if="$slots.headers && selected.length == 0">
                <div v-if="checkbox" class="checkbox">
                    <input
                        type="checkbox"
                        v-on:change="change_all"
                        v-model="check_all"
                        ref="checkall_2"
                    />
                </div>
                <div class="columns">
                    <slot name="headers"></slot>
                </div>
                <div class="actions" v-if="$slots.actions">
                    <slot name="actions"></slot>
                </div>
            </div>
            <slot name="add_row"></slot>
            <slot></slot>
        </template>
    </Card>
</template>

<script>
import Card from './Card';

export default {
    name: 'CardList',
    components: {
        Card,
    },
    props: {
        id: {
            type: String,
            required: true,
        },
        loading: {
            type: Boolean,
            required: false,
            default: false,
        },
        checkbox: {
            type: Boolean,
            required: false,
            default: true,
        },
    },
    data() {
        return {
            selected: new Array(),
            event: '',
            check_all: false,
        };
    },
    computed: {
        selected_count_text() {
            let word = 'item';
            if (this.selected.length > 1) {
                word = 'items';
            }
            return `${this.selected.length} ${word} selected`;
        },
    },
    created() {
        // Create the string for events to listen on
        this.event = `card_list_changed_${this.id}`;

        // Listen for the events
        this.eventbus.on(this.event, this.update);
    },
    unmounted() {
        this.eventbus.off(this.event, this.update);
    },
    methods: {
        update(event) {
            if (event.action == 'change_selection') {
                if (event.type == 'add') {
                    this.selected.push(event.id);
                } else {
                    this.selected = this.selected.filter(
                        (element) => element != event.id
                    );
                }

                if (this.selected.length > 0) {
                    this.eventbus.emit(`${this.event}_empty`, false);
                } else {
                    this.eventbus.emit(`${this.event}_empty`, true);
                    this.$nextTick(() => {
                        this.$refs.checkall_2.checked = false;
                    });
                }
            }
        },
        change_all() {
            // Emit a event to select all
            this.eventbus.emit(this.event, {
                action: 'check_all',
                value: this.check_all,
            });
        },
    },
};
</script>
