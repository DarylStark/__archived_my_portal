<template>
    <div>
        <template v-if="value != null">
            {{ value }}
        </template>
        <template v-if="value == null">
            {{ empty_text }}
        </template>
    </div>
</template>

<script>
export default {
    name: 'EditableText',
    props: {
        value: {},
        empty_text: {},
    },
};
</script>