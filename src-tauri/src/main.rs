// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(desktop)]
            {
                let window = app.get_webview_window("main").unwrap();
                
                // Disable right-click context menu via JS execution
                let _ = window.eval("
                    window.addEventListener('contextmenu', (e) => {
                        e.preventDefault();
                    });
                    // Disable F12 / DevTools shortcuts if needed, though 'devtools' feature flag controls this too
                    window.addEventListener('keydown', (e) => {
                        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
                            e.preventDefault();
                        }
                    });
                ");
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
