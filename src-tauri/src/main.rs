// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::Manager;
use discord_rich_presence::{activity, DiscordIpc, DiscordIpcClient};

// Wrapper so we can store the client + app start time in Tauri managed state
struct DiscordClient {
    client: Mutex<Option<DiscordIpcClient>>,
    start_time: i64,
}

#[tauri::command]
fn set_discord_presence(
    discord: tauri::State<DiscordClient>,
    state_text: String,
    large_image_text: String,
) {
    let start = discord.start_time;
    if let Ok(mut guard) = discord.client.lock() {
        // Helper closure to build the activity
        let build_activity = |client: &mut DiscordIpcClient| {
            client.set_activity(
                activity::Activity::new()
                    .details("Discipline Meets Speed")
                    .state(&state_text)
                    .assets(
                        activity::Assets::new()
                            .large_image("app_logo")
                            .large_text(&large_image_text),
                    )
                    .timestamps(
                        activity::Timestamps::new()
                            .start(start),
                    ),
            )
        };

        let needs_reconnect = if let Some(client) = guard.as_mut() {
            build_activity(client).is_err()
        } else {
            true
        };

        if needs_reconnect {
            // Drop old client, create fresh connection and retry
            *guard = None;
            if let Ok(mut new_client) = DiscordIpcClient::new("1475312349484159147") {
                if new_client.connect().is_ok() {
                    let _ = build_activity(&mut new_client);
                    *guard = Some(new_client);
                }
            }
        }
    }
}

#[tauri::command]
fn clear_discord_presence(discord: tauri::State<DiscordClient>) {
    if let Ok(mut guard) = discord.client.lock() {
        if let Some(client) = guard.as_mut() {
            let _ = client.clear_activity();
        }
    }
}

fn main() {
    let start_time = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;

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
                        )
                        .timestamps(
                            activity::Timestamps::new()
                                .start(start_time),
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
        .manage(DiscordClient {
            client: Mutex::new(discord_client),
            start_time,
        })
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
