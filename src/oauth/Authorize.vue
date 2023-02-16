<template>
    <div>
        <Card>
            <template v-slot:title> {{ application.name }} </template>
            The application <b>{{ application.name }}</b> by
            <b>{{ application.publisher }}</b> would like to access your account
            and requests your permissions for the following scopes:
        </Card>
        <CardList id="permissions">
            <CardListItem
                id="id_1"
                list_id="id_1"
                v-bind:checkbox="true"
                v-bind:checked="true"
                ><div>Retrieve your tags</div></CardListItem
            >
            <CardListItem
                id="id_1"
                list_id="id_1"
                v-bind:checkbox="true"
                v-bind:checked="true"
                ><div>Create tags</div></CardListItem
            >
            <CardListItem
                id="id_1"
                list_id="id_1"
                v-bind:checkbox="true"
                v-bind:checked="true"
                ><div>Edit tags</div></CardListItem
            >
            <CardListItem
                id="id_1"
                list_id="id_1"
                v-bind:checkbox="true"
                v-bind:checked="true"
                ><div>Delete tags</div></CardListItem
            >
        </CardList>
        <Card>
            <p>
                Note: you can choose which permissions to grant. If you chose to
                not grant a specific permission, the functionality of the
                application may be impacted.
            </p>
        </Card>
    </div>
</template>

<script>
import Card from '../cards/Card';
import CardList from '../cards/CardList';
import CardListItem from '../cards/CardListItem';

export default {
    name: 'Authorize',
    components: {
        Card,
        CardList,
        CardListItem,
    },
    props: {
        application: {
            type: Object,
            required: true,
        },
    },
};
</script>
