// Import the 'createStore' method from Veux
import { createRouter, createWebHistory } from 'vue-router'

// Import the pages
import Dashboard from './pages/Dashboard/Dashboard'
import DashboardSidebar from './pages/Dashboard/DashboardSidebar'

import Tags from './pages/Tags/Tags'
import TagDetails from './pages/Tags/TagDetails/TagDetails';
import Notes from './pages/Notes'
import RSS from './pages/RSS'
import Settings from './pages/Settings/Settings'
import APISettings from './pages/APISettings/APISettings'
import ApplicationDetails from './pages/APISettings/ApplicationDetails/ApplicationDetails';

// Error page
import Error404 from './pages/errors/Error-404'

// Create a store for central state management
export default createRouter({
    history: createWebHistory('/ui/'),
    routes: [
        {
            // The homepage is a redirect to the dashboard
            path: '/',
            redirect: '/dashboard',
        },
        {
            path: '/dashboard/:date?',
            name: 'dashboard',
            components: {
                default: Dashboard,
                sidebar: DashboardSidebar
            },
        },
        {
            path: '/tags',
            name: 'tags',
            component: Tags
        },
        {
            path: '/tags/:tag_slug',
            name: 'tagdetails',
            component: TagDetails
        },
        {
            path: '/notes',
            name: 'notes',
            component: Notes
        },
        {
            path: '/rss',
            name: 'rss',
            component: RSS
        },
        {
            path: '/settings',
            name: 'settings',
            component: Settings
        },
        {
            path: '/api_settings',
            name: 'api_settings',
            component: APISettings
        },
        {
            path: '/api_settings/:application_slug',
            name: 'api_settings_details',
            component: ApplicationDetails
        },
        {
            // Error page
            path: '/:pathMatch(.+)',
            component: Error404
        }
    ]
});
