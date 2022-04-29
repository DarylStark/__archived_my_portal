<template>
    <div id="splashscreen">
        <div class="progressbar">
            <div v-bind:style="progressbar_style"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SplashScreen',
    computed: {
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
        done: {
            type: Number,
            required: true,
        },
        total: {
            type: Number,
            required: true,
        },
    },
};
</script>
