<template>
    <Card no_padding>Scopes come here</Card>
</template>

<script>
import Card from '../../../cards/Card';

export default {
    name: 'TokenInfo',
    components: {
        Card,
    },
    props: {
        scope_id: {
            type: Number,
            requuired: true,
        },
    },
};
</script>
