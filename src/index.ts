import App from './App';

try {
    let app: App = App.getInstance();
    app.run();
} catch (err) {
    console.error(err);
}
