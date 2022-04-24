<template>
    <div class="feeter">
        <ProfileSwitcher></ProfileSwitcher>
        <Spacer></Spacer>
    </div>
</template>

<script>
import Spacer from '../components/Spacer.vue';
import ProfileSwitcher from '../components/ProfileSwitcher.vue';

export default {
    name: 'Feeter',
    components: { Spacer, ProfileSwitcher },
};
</script>
