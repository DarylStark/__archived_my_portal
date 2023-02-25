<template>
    <Card no_padding>
        <TokensLoading v-if="loading">Loading token information</TokensLoading>
        <template v-if="!loading">
            <div class="token_info_text">
                This token is created at
                <b
                    ><DateTimeView
                        v-bind:datetime="token.created"
                    ></DateTimeView
                ></b>
                and is authorized for the following scopes:
            </div>
            <div class="scopes">
                <TokenScope></TokenScope>
                <TokenScope></TokenScope>
                <TokenScope></TokenScope>
                <TokenScope></TokenScope>
                <TokenScope></TokenScope>
                <TokenScope></TokenScope>
                <TokenScope></TokenScope>
                <TokenScope></TokenScope>
            </div>
        </template>
    </Card>
</template>

<script>
import Card from '../../../cards/Card';
import CardListAction from '../../../cards/CardListAction';
import DateTimeView from '../../../components/DateTimeView';
import TokensLoading from './TokensLoading.vue';
import TokenScope from './TokenScope.vue';

export default {
    name: 'TokenInfo',
    components: {
        Card,
        DateTimeView,
        TokensLoading,
        CardListAction,
        TokenScope,
    },
    props: {
        token: {
            required: true,
        },
    },
    data() {
        return {
            loading: false,
        };
    },
    created() {},
    methods: {
        delete_scope() {},
    },
};
</script>
