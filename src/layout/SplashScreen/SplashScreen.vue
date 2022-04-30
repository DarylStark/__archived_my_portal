<template>
    <div id="splashscreen">
        <div class="items">
            <div v-for="element in elements" v-bind:key="element">
                <i class="fas fa-spinner spin" v-if="element.loading"></i>
                <i class="fas fa-check" v-if="!element.loading"></i>
                {{ element.title }}
            </div>
        </div>
        <div class="progressbar">
            <div v-bind:style="progressbar_style"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SplashScreen',
    computed: {
        done() {
            return this.elements.filter((x) => !x.loading).length;
        },
        total() {
            return this.elements.length;
        },
        percent() {
            return (this.done / this.total) * 100;
        },
        progressbar_style() {
            return {
                width: `${this.percent}%`,
            };
        },
    },
    props: {
        elements: {
            type: Array,
            required: true,
        },
    },
};
</script>
