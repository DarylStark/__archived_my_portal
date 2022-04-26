<template>
    <div class="feeter">
        <Spacer></Spacer>
        <Notifications></Notifications>
    </div>
</template>

<script>
import Spacer from '../../components/Spacer.vue';
import Notifications from './Notifications.vue';

export default {
    name: 'Feeter',
    components: { Spacer, Notifications },
};
</script>
