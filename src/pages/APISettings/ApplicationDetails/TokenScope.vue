<template>
    <div class="scope">
        <div class="actions">
            <CardListAction
                icon="fa-trash"
                v-bind:action="delete_scope"
                confirm_first
                v-bind:loading="loading"
            ></CardListAction>
        </div>
        <div class="name">
            <b>{{ scope_name.group }}</b
            >: {{ scope_name.scope }}
        </div>
    </div>
</template>

<script>
import CardListAction from '../../../cards/CardListAction';
import { get_scope_name } from '../../../my/oauth_scopes';

export default {
    name: 'TokenInfo',
    components: {
        CardListAction,
    },
    props: {
        token_scope: {
            required: true,
        },
    },
    data() {
        return {
            loading: false,
        };
    },
    computed: {
        scope_name() {
            return get_scope_name(this.token_scope.scope);
        },
    },
    methods: {
        delete_scope() {},
    },
};
</script>
