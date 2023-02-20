
export const scope_names = {
    'api.auth': { group: 'API', scope: 'Get API token information' },
    'api.ping': { group: 'API', scope: 'Ping the API' },
    'date_tags.create': { group: 'Tags (dates)', scope: 'Tag a specific date' },
    'date_tags.delete': {
        group: 'Tags (dates)',
        scope: 'Untag a specific date',
    },
    'date_tags.retrieve': {
        group: 'Tags (dates)',
        scope: 'Get tags for a specific date',
    },
    'tags.create': { group: 'Tags', scope: 'Create tags' },
    'tags.delete': {
        group: 'Tags',
        scope: 'Delete tags',
    },
    'tags.retrieve': {
        group: 'Tags',
        scope: 'Retrieve tags',
    },
    'tags.update': {
        group: 'Tags',
        scope: 'Update tags',
    },
    'users.create': { group: 'Users', scope: 'Create users (admin only)' },
    'users.delete': {
        group: 'Users',
        scope: 'Delete users (admin only)',
    },
    'users.retrieve': {
        group: 'Users',
        scope: 'Retrieve users (admin only)',
    },
    'users.update': {
        group: 'Users',
        scope: 'Update users (admin only)',
    },
};

export const get_scope_name = (scope_name) => {
    if (scope_name in scope_names) return scope_names[scope_name];
    throw new Error(`Invalid scope name: "${scope_name}"`);
}