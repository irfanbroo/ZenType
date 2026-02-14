const { chromium } = require('playwright');
const path = require('path');

(async () => {
    try {
        const browser = await chromium.launch();
        const page = await browser.newPage();

        let port = 8081;
        console.log(`Connecting to ${port}...`);
        try {
            await page.goto(`http://127.0.0.1:${port}`, { timeout: 10000 });
        } catch {
            port = 8080;
            console.log(`Retry: Connecting to ${port}...`);
            await page.goto(`http://127.0.0.1:${port}`, { timeout: 10000 });
        }

        // Test Scoped Theme Application
        const result = await page.evaluate(() => {
            const root = document.documentElement;
            // 1. Get initial global variable (e.g., from default theme)
            const initialGlobal = getComputedStyle(root).getPropertyValue('--profile-primary').trim();

            // 2. Create a dummy container
            const container = document.createElement('div');
            container.id = 'test-container';
            document.body.appendChild(container);

            // 3. Apply a custom theme to the container
            // The fix allows applyProfileTheme to target this container specifically
            const testTheme = { mode: 'custom', primary: '#ff0000', accent: '#00ff00', glowPrimary: 'red', glowAccent: 'green' };

            if (typeof window.applyProfileTheme !== 'function') return { success: false, error: 'applyProfileTheme not found' };

            // Call with targetElement
            window.applyProfileTheme(testTheme, container);

            // 4. Check results
            const containerStyle = container.style.getPropertyValue('--profile-primary').trim();
            const newGlobal = getComputedStyle(root).getPropertyValue('--profile-primary').trim();

            return {
                initialGlobal,
                newGlobal,
                containerStyle,
                success: (initialGlobal === newGlobal) && (containerStyle === '#ff0000'),
                isGlobalUnchanged: initialGlobal === newGlobal,
                isContainerChanged: containerStyle === '#ff0000'
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
