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
            icon="fa-hashtag"
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
                icon="fa-person"
            ></NavigationItem>
            <NavigationItem
                url="/music"
                title="Music"
                id="nav_music"
                icon="fa-person"
            ></NavigationItem>
            <NavigationItem
                url="/finances"
                title="Finances"
                id="nav_finances"
                icon="fa-person"
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
                icon="fa-graduation-cap"
            ></NavigationItem>
            <NavigationItem
                url="/courses"
                title="Courses"
                id="nav_courses"
                icon="fa-graduation-cap"
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
                icon="fa-building"
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
import Command from '../../my/command';

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
            new Command({
                command: 'nav_bar.hide',
                group: 'Navigation Bar',
                title: 'Hide',
                method: this.$store.commit,
                args: ['navigation_visible_set', false],
                icon: 'fa-bars',
            })
        );

        cmdlist.add_command(
            new Command({
                command: 'nav_bar.show',
                group: 'Navigation Bar',
                title: 'Show',
                method: this.$store.commit,
                args: ['navigation_visible_set', true],
                icon: 'fa-bars',
            })
        );

        cmdlist.add_command(
            new Command({
                command: 'nav_bar.toggle',
                group: 'Navigation Bar',
                title: 'Toggle',
                method: this.$store.commit,
                args: 'navigation_visible_toggle',
                icon: 'fa-bars',
                keybinding: new KeyBinding(true, false, false, 'B'),
            })
        );
    },
    components: {
        NavigationItem,
        NavigationSection,
        NavigationFolders,
    },
};
</script>
