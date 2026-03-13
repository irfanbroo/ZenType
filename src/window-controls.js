import { getCurrentWindow } from '@tauri-apps/api/window';

const appWindow = getCurrentWindow();

// Expose so non-module scripts (script.js) can call setFullscreen
window.appWindow = appWindow;

document.getElementById('titlebar-minimize').addEventListener('click', () => {
    appWindow.minimize();
});

document.getElementById('titlebar-maximize').addEventListener('click', () => {
    appWindow.toggleMaximize();
});

document.getElementById('titlebar-close').addEventListener('click', () => {
    appWindow.close();
});
