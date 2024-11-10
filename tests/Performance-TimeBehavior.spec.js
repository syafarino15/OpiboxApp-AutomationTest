const { test, expect } = require('@playwright/test');
const fs = require('fs');

test('Performance Time Behavior Test', async ({ page }) => {
    const startTime = Date.now();

    // Navigasi ke halaman yang akan diuji
    await page.goto('https://opibox.netlify.app/');
    const endTime = Date.now();
    const loadTime = endTime - startTime;

    console.log(`Page load time: ${loadTime} ms`);

    // Harapkan waktu muat halaman kurang dari 10000 ms
    const expectedTime = 10000;
    const status = loadTime < expectedTime ? 'Passed' : 'Failed';

    // Menyimpan hasil ke file .txt
    fs.appendFileSync('PerformanceTimeBehaviorTest_report.txt', `
    Test Name: Performance Time Behavior
    URL: https://opibox.netlify.app/
    Load Time: ${loadTime} ms
    Expected Time: ${expectedTime} ms
    Status: ${status}
    Date: ${new Date().toLocaleString()}
    -----------------------------------
    `);

    // Menyimpan hasil ke file .json
    const result = {
        testName: 'Performance Time Behavior',
        url: 'https://opibox.netlify.app/',
        loadTime: loadTime,
        expectedTime: expectedTime,
        status: status,
        date: new Date().toLocaleString(),
    };
    fs.appendFileSync('PerformanceTimeBehaviorTest_report.json', JSON.stringify(result, null, 2) + ',\n');

    // Assertion
    expect(loadTime).toBeLessThan(10000);
});


// test('Performance test', async ({ page }) => {
//     await page.goto('https://opibox.netlify.app/');
//     const performanceTiming = JSON.parse(await page.evaluate(() => JSON.stringify(window.performance.timing)));
//     const loadTime = performanceTiming.loadEventEnd - performanceTiming.navigationStart;
//     console.log(`Load time: ${loadTime} ms`);

//     // Harapkan waktu muat halaman kurang dari 2500 ms
//     expect(loadTime).toBeLessThan(2500);
// });

// test('performance test 2', async ({ page }) => {
//     const startTime = Date.now();

//     await page.goto('https://opibox.netlify.app/');
//     await page.waitForLoadState('load');
//     const endTime = Date.now();
//     const loadTime = endTime - startTime;
//     console.log(`Load time: ${loadTime} ms`);

//     // Harapkan waktu muat halaman kurang dari 2500 ms
//     expect(loadTime).toBeLessThan(2500);
// });
