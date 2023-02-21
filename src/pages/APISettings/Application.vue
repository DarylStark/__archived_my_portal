<template>
    <CardListItem
        list_id="api_applications"
        v-bind:id="id"
        v-bind:loading="client.loading"
        content_as_label
    >
        <div>
            <b>{{ client.app_name }}</b> by {{ client.app_publisher }}
        </div>
        <template v-slot:actions>
            <CardListAction
                icon="fa-circle-info"
                v-bind:action="action_info"
            ></CardListAction>
            <CardListAction
                icon="fa-trash"
                v-bind:action="action_remove"
                confirm_first
                v-bind:loading="client.loading"
            ></CardListAction>
        </template>
    </CardListItem>
</template>

<script>
import CardListItem from '../../cards/CardListItem';
import CardListAction from '../../cards/CardListAction';

export default {
    name: 'Application',
    components: {
        CardListItem,
        CardListAction,
    },
    props: {
        client: {
            required: true,
        },
    },
    computed: {
        id() {
            return `application_id_${this.client.id}`;
        },
    },
    methods: {
        action_info() {},
        action_remove() {
            this.eventbus.emit('remove_api_client', this.client.id);
        },
    },
};
</script>
