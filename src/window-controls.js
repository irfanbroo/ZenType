import { getCurrentWindow } from '@tauri-apps/api/window';

const appWindow = getCurrentWindow();

document.getElementById('titlebar-minimize').addEventListener('click', () => {
    console.log("Minimize Clicked");
    appWindow.minimize();
});

document.getElementById('titlebar-maximize').addEventListener('click', () => {
    console.log("Maximize Clicked");
    appWindow.toggleMaximize();
});

document.getElementById('titlebar-close').addEventListener('click', () => {
    console.log("Close Clicked");
    appWindow.close();
});
