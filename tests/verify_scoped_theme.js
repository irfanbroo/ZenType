const { chromium } = require('playwright');
const path = require('path');

(async () => {
    try {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        await page.setViewportSize({ width: 1280, height: 720 });

        let port = 8081;
        try {
            await page.goto(`http://127.0.0.1:${port}`, { timeout: 3000 });
        } catch {
            port = 8080;
            await page.goto(`http://127.0.0.1:${port}`, { timeout: 3000 });
        }

        // Test Scoped Theme Application
        const result = await page.evaluate(() => {
            // 1. Get initial global variable
            const initialGlobal = getComputedStyle(document.documentElement).getPropertyValue('--profile-primary').trim();

            // 2. Create a dummy container
            const container = document.createElement('div');
            container.id = 'test-container';
            document.body.appendChild(container);

            // 3. Apply a different theme to the container
            const testTheme = { mode: 'custom', primary: '#ff0000', accent: '#00ff00', glowPrimary: 'red', glowAccent: 'green' };

            // Ensure function exists
            if (typeof window.applyProfileTheme !== 'function') return { success: false, error: 'applyProfileTheme not found' };

            window.applyProfileTheme(testTheme, container);

            // 4. Check results
            const containerStyle = container.style.getPropertyValue('--profile-primary').trim();
            const newGlobal = getComputedStyle(document.documentElement).getPropertyValue('--profile-primary').trim();

            return {
                initialGlobal,
                newGlobal,
                containerStyle,
                success: (initialGlobal === newGlobal) && (containerStyle === '#ff0000')
            };
        });

        console.log('Test Result:', result);

        if (result.success) {
            console.log('SUCCESS: Theme applied to container without affecting global root.');
        } else {
            console.error('FAILURE: Global theme was modified or container style not applied.');
            process.exit(1);
        }

        await browser.close();
    } catch (err) {
        console.error("Script failed:", err);
        process.exit(1);
    }
})();
