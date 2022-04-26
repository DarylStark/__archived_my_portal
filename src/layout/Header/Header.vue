<template>
    <div class="header">
        <MenuToggle></MenuToggle>
        <Spacer></Spacer>
        <SidebarToggle v-if="sidebar_available"></SidebarToggle>
        <UserMenu></UserMenu>
    </div>
</template>

<script>
import MenuToggle from './MenuToggle.vue';
import Spacer from '../../components/Spacer.vue';
import UserMenu from './UserMenu.vue';
import SidebarToggle from './SidebarToggle.vue';

export default {
    name: 'Header',
    computed: {
        sidebar_available() {
            return this.$store.state.ui.sidebar_available;
        },
    },
    components: { MenuToggle, Spacer, UserMenu, SidebarToggle },
};
</script>
