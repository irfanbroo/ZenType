if (window.__TAURI_INTERNALS__) {
    import('@tauri-apps/api/window').then(({ getCurrentWindow }) => {
        const appWindow = getCurrentWindow();
        window.appWindow = appWindow;

        document.getElementById('titlebar-minimize')?.addEventListener('click', () => {
            appWindow.minimize();
        });

        document.getElementById('titlebar-maximize')?.addEventListener('click', () => {
            appWindow.toggleMaximize();
        });

        document.getElementById('titlebar-close')?.addEventListener('click', () => {
            appWindow.close();
        });
    });
}
