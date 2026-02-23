// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;
use tauri::Manager;
use discord_rich_presence::{activity, DiscordIpc, DiscordIpcClient};

// Wrapper so we can store the client in Tauri managed state
struct DiscordClient(Mutex<Option<DiscordIpcClient>>);

#[tauri::command]
fn set_discord_presence(
    discord: tauri::State<DiscordClient>,
    state_text: String,
    large_image_text: String,
) {
    if let Ok(mut guard) = discord.0.lock() {
        if let Some(client) = guard.as_mut() {
            let _ = client.set_activity(
                activity::Activity::new()
                    .details("Discipline Meets Speed")
                    .state(&state_text)
                    .assets(
                        activity::Assets::new()
                            .large_image("app_logo")
                            .large_text(&large_image_text),
                    ),
            );
        }
    }
}

#[tauri::command]
fn clear_discord_presence(discord: tauri::State<DiscordClient>) {
    if let Ok(mut guard) = discord.0.lock() {
        if let Some(client) = guard.as_mut() {
            let _ = client.clear_activity();
        }
    }
}

fn main() {
    // Try to connect to Discord — if Discord isn't running, we just skip
    let discord_client = match DiscordIpcClient::new("1475312349484159147") {
        Ok(mut client) => {
            if client.connect().is_ok() {
                // Set initial idle presence
                let _ = client.set_activity(
                    activity::Activity::new()
                        .details("Discipline Meets Speed")
                        .state("In Stillness")
                        .assets(
                            activity::Assets::new()
                                .large_image("app_logo")
                                .large_text("Last Practice: 0 WPM"),
                        ),
                );
                Some(client)
            } else {
                None
            }
        }
        Err(_) => None,
    };

    tauri::Builder::default()
        .manage(DiscordClient(Mutex::new(discord_client)))
        .invoke_handler(tauri::generate_handler![
            set_discord_presence,
            clear_discord_presence
        ])
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
