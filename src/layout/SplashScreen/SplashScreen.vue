<template>
    <div id="splashscreen">
        <div class="items">
            <div
                v-for="element in elements"
                v-bind:key="element"
                v-bind:class="{ error: element.error }"
            >
                <template v-if="!element.error">
                    <i class="fas fa-spinner spin" v-if="element.loading"></i>
                    <i class="fas fa-check" v-if="!element.loading"></i>
                </template>
                <i class="fas fa-triangle-exclamation" v-if="element.error"></i>
                {{ element.title }}
            </div>
        </div>
        <div v-bind:class="['progressbar', { error: error }]">
            <div v-bind:style="progressbar_style"></div>
        </div>
        <div v-if="error" class="reload">
            <p>A error occured. Please reload the page.</p>

            <Button v-on:click="reload">Reload</Button>
        </div>
    </div>
</template>

<script>
import Button from '../../components/Button.vue';

export default {
    name: 'SplashScreen',
    components: {
        Button,
    },
    computed: {
        error() {
            return this.elements.filter((x) => x.error).length > 0;
        },
        done() {
            return this.elements.filter((x) => !x.loading || x.error).length;
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
    methods: {
        reload() {
            location.reload();
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
