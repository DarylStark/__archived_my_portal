// Module with functions for tags

function get_tag_slug(title) {
    let slug = title;
    slug = slug.replaceAll('-', '_');
    slug = slug.replaceAll(' ', '-');
    return slug;
}

export { get_tag_slug };