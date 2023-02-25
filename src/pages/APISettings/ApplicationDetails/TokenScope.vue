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
        <div class="name">Token 1</div>
    </div>
</template>

<script>
import CardListAction from '../../../cards/CardListAction';

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
    methods: {
        delete_scope() {},
    },
};
</script>
