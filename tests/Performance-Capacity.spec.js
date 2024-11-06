const { test, expect } = require('@playwright/test');
const fs = require('fs');

test('Performance Capacity Test', async ({ browser }) => {
    const numberOfUsers = 50; // Jumlah pengguna yang disimulasikan
    const startTime = Date.now();

    // Buat array promises untuk mensimulasikan 50 pengguna
    const promises = Array.from({ length: numberOfUsers }).map(async () => {
        const page = await browser.newPage();
        await page.goto('https://opibox.netlify.app/');
        await page.close();
    });

    // Menjalankan semua simulasi secara paralel
    await Promise.all(promises);

    const endTime = Date.now();
    const loadTime = endTime - startTime;

    // Menghitung waktu rata-rata per pengguna
    const averageLoadTime = loadTime / numberOfUsers;

    console.log(`Total load time for ${numberOfUsers} users: ${loadTime} ms`);
    console.log(`Average load time per user: ${averageLoadTime} ms`);

    // Harapkan waktu total kurang dari 10000 ms untuk 50 pengguna
    const expectedTime = 10000;
    const status = loadTime < expectedTime ? 'Passed' : 'Failed';

    // Menyimpan hasil ke file .txt
    fs.appendFileSync('PerformanceCapacityTest_report.txt', `
    Test Name: Performance Capacity Test
    Number of Users: ${numberOfUsers}
    Total Load Time: ${loadTime} ms
    Average Load Time per User: ${averageLoadTime} ms
    Expected Time: ${expectedTime} ms
    Status: ${status}
    Date: ${new Date().toLocaleString()}
    -----------------------------------
    `);

    // Menyimpan hasil ke file .json
    const result = {
        testName: 'Performance Capacity Test',
        numberOfUsers: numberOfUsers,
        loadTime: loadTime,
        averageLoadTime: averageLoadTime,
        expectedTime: expectedTime,
        status: status,
        date: new Date().toLocaleString(),
    };
    fs.appendFileSync('PerformanceCapacityTest_report.json', JSON.stringify(result, null, 2) + ',\n');

    // Assertion
    expect(loadTime).toBeLessThan(10000);
});
