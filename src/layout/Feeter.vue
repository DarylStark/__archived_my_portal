<template>
    <div class="feeter">
        <ProfileSwitcher></ProfileSwitcher>
        <Spacer></Spacer>
        <Notifications></Notifications>
    </div>
</template>

<script>
import Spacer from '../components/Spacer.vue';
import ProfileSwitcher from '../components/ProfileSwitcher.vue';
import Notifications from '../components/Notifications.vue';

export default {
    name: 'Feeter',
    components: { Spacer, ProfileSwitcher, Notifications },
};
</script>
