// Module with functions for tags

import { get_slug_for_name } from './generic';

function get_tag_slug(title) {
    return get_slug_for_name(title);
}

export { get_tag_slug };