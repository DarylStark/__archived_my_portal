// Module with generic functions

function get_slug_for_name(name) {
    let slug = name;
    slug = slug.replaceAll('-', '_');
    slug = slug.replaceAll(' ', '-');
    return slug;
}

export { get_slug_for_name };