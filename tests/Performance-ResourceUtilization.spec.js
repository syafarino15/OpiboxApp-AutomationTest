const { test, expect } = require('@playwright/test');
const fs = require('fs');
const pidusage = require('pidusage');

test('Resource Utilization Test', async ({ browser }) => {
    const numberOfUsers = 50; // Jumlah pengguna yang disimulasikan
    const startTime = Date.now();

    // Buat array promises untuk mensimulasikan 50 pengguna
    const promises = Array.from({ length: numberOfUsers }).map(async () => {
        const page = await browser.newPage();
        await page.goto('https://opibox.netlify.app/');
        await page.close();
    });

    // Awal pemantauan resource sebelum menjalankan simulasi
    let initialUsage = await pidusage(process.pid);

    // Menjalankan semua simulasi secara paralel
    await Promise.all(promises);

    // Akhir pemantauan resource setelah simulasi selesai
    let finalUsage = await pidusage(process.pid);

    const endTime = Date.now();
    const loadTime = endTime - startTime;

    // Menghitung waktu rata-rata per pengguna
    const averageLoadTime = loadTime / numberOfUsers;

    // Menghitung penggunaan CPU dan memori
    const cpuUsage = finalUsage.cpu - initialUsage.cpu;
    const memoryUsage = finalUsage.memory - initialUsage.memory;

    console.log(`Total load time for ${numberOfUsers} users: ${loadTime} ms`);
    console.log(`Average load time per user: ${averageLoadTime} ms`);
    console.log(`CPU usage difference: ${cpuUsage.toFixed(2)}%`);
    console.log(`Memory usage difference: ${(memoryUsage / 1024 / 1024).toFixed(2)} MB`);

    // Harapkan waktu total kurang dari 10000 ms untuk 50 pengguna
    const expectedTime = 10000;
    const status = loadTime < expectedTime ? 'Passed' : 'Failed';

    // Menyimpan hasil ke file .txt
    fs.appendFileSync('ResourceUtilizationTest_report.txt', `
    Test Name: Resource Utilization Test
    Number of Users: ${numberOfUsers}
    Total Load Time: ${loadTime} ms
    Average Load Time per User: ${averageLoadTime} ms
    CPU Usage Difference: ${cpuUsage.toFixed(2)}%
    Memory Usage Difference: ${(memoryUsage / 1024 / 1024).toFixed(2)} MB
    Expected Time: ${expectedTime} ms
    Status: ${status}
    Date: ${new Date().toLocaleString()}
    -----------------------------------
    `);

    // Menyimpan hasil ke file .json
    const result = {
        testName: 'Resource Utilization Test',
        numberOfUsers: numberOfUsers,
        loadTime: loadTime,
        averageLoadTime: averageLoadTime,
        cpuUsageDifference: cpuUsage.toFixed(2) + '%',
        memoryUsageDifference: (memoryUsage / 1024 / 1024).toFixed(2) + ' MB',
        expectedTime: expectedTime,
        status: status,
        date: new Date().toLocaleString(),
    };
    fs.appendFileSync('ResourceUtilizationTest_report.json', JSON.stringify(result, null, 2) + ',\n');

    // Assertion
    expect(loadTime).toBeLessThan(10000);
});

// test('Performance Resource Utilization Test', async ({ page }) => {
//     const startTime = Date.now();
//     const pid = process.pid;
//     const statsBefore = await pidusage(pid);

//     await page.goto('https://opibox.netlify.app/');

//     const statsAfter = await pidusage(pid);
//     const endTime = Date.now();
//     const loadTime = endTime - startTime;
//     const cpuUsage = statsAfter.cpu - statsBefore.cpu;
//     const memoryUsage = statsAfter.memory - statsBefore.memory;

//     const loadTimeStatus = loadTime < 10000 ? 'Lulus' : 'Gagal';
//     const cpuUsageStatus = cpuUsage < 50 ? 'Lulus' : 'Gagal';
//     const memoryUsageStatus = memoryUsage < 500 * 1024 * 1024 ? 'Lulus' : 'Gagal';

//     const report = `
//     **Test Name:** Resource Utilization Test
    
//     **Test Description:**
//     Pengujian ini bertujuan untuk mengukur efisiensi penggunaan sumber daya (CPU dan Memori) selama proses pemuatan halaman dari aplikasi web.
    
//     **Test URL:** https://opibox.netlify.app/
    
//     **Hasil Pengujian:**
    
//     | No. | Metric            | Value                       | Threshold                | Status    |
//     |-----|-------------------|-----------------------------|--------------------------|-----------|
//     | 1   | **Page Load Time**| ${loadTime} ms              | < 10,000 ms              | ${loadTimeStatus}  |
//     | 2   | **CPU Usage**     | ${cpuUsage.toFixed(2)}%     | < 50%                    | ${cpuUsageStatus}  |
//     | 3   | **Memory Usage**  | ${(memoryUsage / 1024 / 1024).toFixed(2)} MB | < 500 MB    | ${memoryUsageStatus}  |
    
//     **Kesimpulan:**
//     - **Page Load Time:** ${loadTimeStatus} - Halaman dimuat dalam waktu ${loadTime} ms.
//     - **CPU Usage:** ${cpuUsageStatus} - Penggunaan CPU sebesar ${cpuUsage.toFixed(2)}%.
//     - **Memory Usage:** ${memoryUsageStatus} - Penggunaan memori sebesar ${(memoryUsage / 1024 / 1024).toFixed(2)} MB.
    
//     **Overall Status:** ${loadTimeStatus === 'Lulus' && cpuUsageStatus === 'Lulus' && memoryUsageStatus === 'Lulus' ? 'Lulus' : 'Gagal'}
//     `;

//     fs.writeFileSync('ResourceUtilizationReport.md', report);

//     // Harapkan waktu muat halaman kurang dari 10000 ms
//     expect(loadTime).toBeLessThan(10000);
//     expect(cpuUsage).toBeLessThan(50); // CPU Usage < 50%
//     expect(memoryUsage).toBeLessThan(500 * 1024 * 1024); // Memory Usage < 500MB
// });
