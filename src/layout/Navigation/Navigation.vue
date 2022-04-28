<template>
    <div
        v-bind:class="[
            'navigation',
            { floating: floating },
            { hide: !visible },
        ]"
    >
        <NavigationSection
            icon="fa-list"
            title="Dashboard"
            url="/dashboard"
            id="nav_dashboard"
        ></NavigationSection>
        <NavigationSection
            icon="fa-tags"
            title="Tags"
            url="/tags"
            id="nav_tags"
        ></NavigationSection>
        <NavigationSection
            icon="fa-book-open"
            title="Notes"
            url="/notes"
            id="nav_notes"
            custom_submenu
        >
            <NavigationFolders></NavigationFolders>
        </NavigationSection>
        <NavigationSection
            icon="fa-rss"
            title="RSS feeds"
            url="/rss"
            id="nav_rss"
            custom_submenu
            ><NavigationFolders></NavigationFolders
        ></NavigationSection>

        <NavigationSection
            icon="fa-person"
            title="Personal"
            url="/personal"
            id="nav_personal"
        >
            <NavigationItem
                url="/social"
                title="Social"
                id="nav_social"
            ></NavigationItem>
            <NavigationItem
                url="/music"
                title="Music"
                id="nav_music"
            ></NavigationItem>
            <NavigationItem
                url="/finances"
                title="Finances"
                id="nav_finances"
            ></NavigationItem>
        </NavigationSection>

        <NavigationSection
            icon="fa-graduation-cap"
            title="Personal Development"
            url="/personal_development"
            id="nav_personal_development"
        >
            <NavigationItem
                url="/certifications"
                title="Certifications"
                id="nav_certifications"
            ></NavigationItem>
            <NavigationItem
                url="/courses"
                title="Courses"
                id="nav_courses"
            ></NavigationItem>
        </NavigationSection>

        <NavigationSection
            icon="fa-building"
            title="Professional"
            url="/professional"
            id="nav_professional"
        >
            <NavigationItem
                url="/jobs"
                title="Jobs"
                id="nav_jobs"
            ></NavigationItem>
        </NavigationSection>
    </div>
</template>

<script>
import NavigationItem from './NavigationItem.vue';
import NavigationSection from './NavigationSection.vue';
import NavigationFolders from './NavigationFolders.vue';
import cmdlist from '../../my/command_list';
import KeyBinding from '../../my/keybinding';

export default {
    name: 'Navigation',
    computed: {
        visible() {
            return this.$store.state.ui.navigation_visible;
        },
        floating() {
            return this.$store.state.ui.device_type == 'phone';
        },
    },
    created() {
        cmdlist.add_command(
            'global',
            'Navigation',
            'navigation.hide',
            'Hide',
            this.$store.commit,
            ['navigation_visible_set', false],
            true
        );
        cmdlist.add_command(
            'global',
            'Navigation',
            'navigation.show',
            'Show',
            this.$store.commit,
            ['navigation_visible_set', true],
            true
        );
        cmdlist.add_command(
            'global',
            'Navigation',
            'navigation.toggle',
            'Toggle',
            this.$store.commit,
            'navigation_visible_toggle',
            true,
            new KeyBinding(true, false, false, 'B')
        );
    },
    components: {
        NavigationItem,
        NavigationSection,
        NavigationFolders,
    },
};
</script>
