# The My Portal application

The portal application is a NodeJS project, based on a VueJS framework, that created the frontend for the My project. This frontend is uses SCSS to create the CSS file. It used VueJS to create the JavaScript files. By using webpack, the JavaScript files get transpiled to a `.js` file for use in the webbrowser. These file can be served using the `my_web_ui` service, which is created in the `my` [repository](https://github.com/DarylStark/my).

## Run the development server

There is a development server that compiles the CSS when changing a `.scss` file and that compiles the JavaScript into a testable file while editing the code. To start this, execute the following commands:

```bash
cd src
npm vuejs-server &
npm scss-watch &
```

For convenience, a VS Code build task is created that does this. It is called `My (portal) - Develop - Run VueJS development server and SCSS watcher`. There are also tasks to run the SCSS watcher or the VueJS server independently.

## Compile the SCSS

To compile the SCSS to a `.css` file, you can either use the VS Code build task `My (portal) - Compile - SCSS files`, or execute the following commands;

```bash
cd src
npm scss-build
```

The resulting CSS will be placed in `dist/css`.

## Compile the JavaScript

To compile the JavaScript to a `.js`, you can either use the VS code build task `My (portal) - Compile - VueJS project`, or execute the following commands;

```bash
cd src
npm vuejs-build
```
