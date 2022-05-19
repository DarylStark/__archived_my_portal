<template>
    <div>{{ value }}</div>
</template>

<script>
import DateTime from '../my/datetime';

export default {
    name: 'DateTimeView',
    props: {
        datetime: {
            type: String,
            required: true,
        },
    },
    computed: {
        value() {
            let local = new DateTime(this.datetime).as_local_datetime();
            return local.format('%Y-%m-%d %H:%M:%S');
        },
    },
};
</script>