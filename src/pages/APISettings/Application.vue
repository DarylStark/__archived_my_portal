<template>
    <CardListItem
        list_id="api_applications"
        v-bind:id="id"
        v-bind:loading="client.loading"
        content_as_label
        class='application'
    >
        <div class='title'>
            <p class='app_name'>{{ client.app_name }}</p>
            <p class='app_publisher'>By {{ client.app_publisher }}</p>
            <p class='features'>
                <div class="disabled" v-if='!client.enabled'>Disabled</div>
                <div class="expired" v-if='expired'>Expired</div>
            </p>
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
import DateTime from '../../my/datetime.js';

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
        expired() {
            if (this.client.expires) {
                let date_object = new DateTime(this.client.expires, true);
                return date_object.datetime < new Date();
            }
            return false;
        },
    },
    methods: {
        action_info() {
            this.$router.push(`/api_settings/${this.client.slug}`);
        },
        action_remove() {
            this.eventbus.emit('remove_api_client', this.client.id);
        },
    },
};
</script>
