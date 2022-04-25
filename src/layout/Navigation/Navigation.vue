<template>
    <div v-bind:class="['navigation', { hide: !visible }]">
        <NavigationSection
            icon="fa-list"
            title="Dashboard"
            url="/dashboard"
        ></NavigationSection>
        <NavigationSection
            icon="fa-tags"
            title="Tags"
            url="/tags"
        ></NavigationSection>
        <NavigationSection
            icon="fa-book-open"
            title="Notes"
            url="/notes"
            custom_submenu
        >
            <NavigationFolders></NavigationFolders>
        </NavigationSection>
        <NavigationSection
            icon="fa-rss"
            title="RSS feeds"
            url="/rss"
            custom_submenu
            ><NavigationFolders></NavigationFolders
        ></NavigationSection>

        <NavigationSection icon="fa-person" title="Personal" url="/personal">
            <NavigationItem url="/social">Social</NavigationItem>
            <NavigationItem url="/music">Music</NavigationItem>
            <NavigationItem url="/finances">Finances</NavigationItem>
        </NavigationSection>

        <NavigationSection
            icon="fa-graduation-cap"
            title="Personal Development"
            url="/personal_development"
        >
            <NavigationItem url="/certifications"
                >Certifications</NavigationItem
            >
            <NavigationItem url="/courses">Courses</NavigationItem>
        </NavigationSection>

        <NavigationSection
            icon="fa-building"
            title="Professional"
            url="/professional"
        >
            <NavigationItem url="/jobs">Jobs</NavigationItem>
        </NavigationSection>
    </div>
</template>

<script>
import NavigationItem from './NavigationItem.vue';
import NavigationSection from './NavigationSection.vue';
import NavigationFolders from './NavigationFolders.vue';

export default {
    name: 'Navigation',
    computed: {
        visible() {
            return this.$store.state.ui.navigation_visible;
        },
    },
    components: {
        NavigationItem,
        NavigationSection,
        NavigationFolders,
    },
};
</script>
