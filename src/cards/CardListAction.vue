<template>
    <div class="list_action">
        <i v-bind:class="['fas', icon]"></i>
    </div>
</template>

<script>
import Button from '../components/Button.vue';

export default {
    name: 'CardListAction',
    components: {
        Button,
    },
    props: {
        list_id: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            required: false,
            default: null,
        },
    },
};
</script>