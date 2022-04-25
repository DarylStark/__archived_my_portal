<template>
    <div v-bind:class="['navigation', { hide: !visible }]">
        <NavigationSection
            icon="fa-list"
            title="Dashboard"
            href="/dashboard"
        ></NavigationSection>
        <NavigationSection icon="fa-tags" title="Tags" href="/tags"
            ><NavigationItem href="/notes/add"
                >Add tag</NavigationItem
            ></NavigationSection
        >
        <NavigationSection
            icon="fa-book-open"
            title="Notes"
            href="/notes"
        ></NavigationSection>
        <NavigationSection
            icon="fa-rss"
            title="RSS feeds"
            href="/rss"
        ></NavigationSection>

        <NavigationSection icon="fa-person" title="Personal">
            <NavigationItem href="/social">Social</NavigationItem>
            <NavigationItem href="/music">Music</NavigationItem>
            <NavigationItem href="/finances">Finances</NavigationItem>
        </NavigationSection>

        <NavigationSection
            icon="fa-graduation-cap"
            title="Personal Development"
        >
            <NavigationItem href="/certifications"
                >Certifications</NavigationItem
            >
            <NavigationItem href="/courses">Courses</NavigationItem>
        </NavigationSection>

        <NavigationSection icon="fa-building" title="Professional">
            <NavigationItem href="/jobs">Jobs</NavigationItem>
        </NavigationSection>
    </div>
</template>

<script>
import NavigationItem from './NavigationItem.vue';
import NavigationSection from './NavigationSection.vue';

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
    },
};
</script>
