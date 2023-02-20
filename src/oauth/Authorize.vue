<template>
    <form>
        <Card>
            <template v-slot:title>
                {{ application.app_name }} requests your authorization
            </template>
            The application <b>{{ application.app_name }}</b> by
            <b>{{ application.app_publisher }}</b> would like to access your
            account and requests your permission to do so. It requests
            permissions to following scopes:
        </Card>
        <CardList id="permissions">
            <CardListItem
                v-for="scope in scopes"
                v-bind:key="scope"
                v-bind:id="scope"
                list_id="permissions"
                v-bind:checkbox="true"
                v-bind:checked="true"
                v-bind:content_as_label="true"
            >
                <div>
                    <b>{{ get_scope_name(scope).group }}: </b>
                    {{ get_scope_name(scope).scope }}
                </div>
            </CardListItem>
        </CardList>
        <Card>
            <p>
                If you want to grant <b>{{ application.app_name }}</b> access to
                your account, check the scopes that you want to give it
                permissions to and click on <b>Save</b>. If you don't want to
                give <b>{{ application.app_name }}</b> your permissions, you can
                just close this page without saving.
            </p>
            <p>Keep in mind that you can revoke scopes after allowing them.</p>
            <template v-slot:actions>
                <Button icon="fa fa-key" critical>Save</Button>
            </template>
        </Card>
    </form>
</template>

<script>
import Card from '../cards/Card';
import CardList from '../cards/CardList';
import CardListItem from '../cards/CardListItem';
import Button from '../components/Button';
import { get_scope_name } from '../my/oauth_scopes';

export default {
    name: 'Authorize',
    components: {
        Card,
        CardList,
        CardListItem,
        Button,
    },
    props: {
        application: {
            type: Object,
            required: true,
        },
        scopes: {
            type: Array,
            required: true,
        },
    },
    methods: {
        get_scope_name(scope_name) {
            // This function is defined in `../my/oauth_scopes`, but VueJS
            // can only used methods in the template that are defined in the
            // methods key of the VueJS object. That's why we use this as a
            // project object
            return get_scope_name(scope_name);
        },
    },
};
</script>
