<template>
    <div v-bind:class="class">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'Cell',
    computed: {
        class() {
            let classlist = [this.type];
            // Set the column count
            if (this.cols >= 0 && this.cols <= 12) {
                classlist = [...classlist, 'cols-' + this.cols];
            }

            // Specific for desktop
            if (this.cols_desktop) {
                classlist = [...classlist, 'cols-desktop-' + this.cols_desktop];
            }

            // Specific for tablet
            if (this.cols_tablet) {
                classlist = [...classlist, 'cols-tablet-' + this.cols_tablet];
            }

            // Specific for phone
            if (this.cols_phone) {
                classlist = [...classlist, 'cols-phone-' + this.cols_phone];
            }

            // Set the hiders
            classlist = [this.hide_desktop ? 'hide-desktop' : '', ...classlist];
            classlist = [this.hide_tablet ? 'hide-tablet' : '', ...classlist];
            classlist = [this.hide_phone ? 'hide-phone' : '', ...classlist];

            // Return the created list
            return classlist;
        },
    },
    props: {
        cols: { type: String, default: undefined },
        cols_desktop: { type: String, default: undefined },
        cols_tablet: { type: String, default: undefined },
        cols_phone: { type: String, default: undefined },
        hide_desktop: { type: Boolean, default: false },
        hide_tablet: { type: Boolean, default: false },
        hide_phone: { type: Boolean, default: false },
        type: { type: String, default: 'cell' },
    },
};
</script>
