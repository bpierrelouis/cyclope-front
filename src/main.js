async function enableMocking() {
    if (import.meta.env.DEV) {
        const { worker } = await import('./mocks/browser');
        return worker.start();
    }
}

enableMocking().then(() => {
    import('./bootstrap');
});