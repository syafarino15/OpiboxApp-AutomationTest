const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const os = require('os');

test('Reliability-Availability-Stress test', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    let successRequests = 0;
    let failedRequests = 0;
    const results = [];

    // Mengukur penggunaan CPU dan memori sebelum permintaan
    const initialCPUUsage = os.loadavg()[0];
    const initialMemoryUsage = process.memoryUsage().rss / (1024 * 1024); // dalam MB

    for (let i = 1; i <= 25; i++) {
        const startTime = Date.now();


        try {
            await page.goto(`https://opibox.netlify.app/load?level=${i}`, { timeout: 10000 });
            const endTime = Date.now();
            const duration = endTime - startTime;

            // Mengukur penggunaan CPU dan memori setelah permintaan
            const finalCPUUsage = os.loadavg()[0];
            const finalMemoryUsage = process.memoryUsage().rss / (1024 * 1024); // dalam MB

            successRequests++;
            console.log(`Load level ${i} succeeded`);

            results.push({
                loadLevel: i,
                status: 'Success',
                duration,
                cpuUsageDiff: finalCPUUsage - initialCPUUsage,
                memoryUsageDiff: finalMemoryUsage - initialMemoryUsage
            });

        } catch (error) {
            const endTime = Date.now();
            const duration = endTime - startTime;

            failedRequests++;
            console.error(`Load level ${i} failed with error: ${error.message}`);

            results.push({
                loadLevel: i,
                status: 'Failed',
                duration,
                error: error.message
            });
        }
    }

    console.log(`Total successful requests: ${successRequests}`);
    console.log(`Total failed requests: ${failedRequests}`);

    await context.close();

    // Menyimpan hasil ke file CSV
    const csvFilePath = path.join(__dirname, 'Reliability-FaultTolerance-StressTest.csv');
    const csvHeader = 'Load Level, Status, Duration (ms), CPU Usage Difference, Memory Usage Difference (MB)\n';
    const csvContent = results.map(r => `${r.loadLevel},${r.status},${r.duration},${r.cpuUsageDiff || 'N/A'},${r.memoryUsageDiff || 'N/A'}`).join('\n');
    fs.writeFileSync(csvFilePath, csvHeader + csvContent, 'utf8');
    console.log('CSV report written successfully');

    // Menyimpan hasil ke file TXT
    const txtFilePath = path.join(__dirname, 'Reliability-FaultTolerance-StressTest.txt');
    const txtContent = results.map(r => `Load Level: ${r.loadLevel}, Status: ${r.status}, Duration: ${r.duration} ms, CPU Usage Difference: ${r.cpuUsageDiff || 'N/A'}, Memory Usage Difference: ${r.memoryUsageDiff || 'N/A'} MB, Error: ${r.error || 'None'}`).join('\n');
    fs.writeFileSync(txtFilePath, txtContent, 'utf8');
    console.log('TXT report written successfully');

    // Menyimpan hasil ke file JSON
    const jsonFilePath = path.join(__dirname, 'Reliability-FaultTolerance-StressTest.json');
    const jsonContent = JSON.stringify(results, null, 2);
    fs.writeFileSync(jsonFilePath, jsonContent, 'utf8');
    console.log('JSON report written successfully');
});



// test('Reliability-Availability-Stress test', async ({ browser }) => {
//     const context = await browser.newContext();
//     const page = await context.newPage();

//     // Mengirim permintaan dengan beban yang meningkat
//     let successRequests = 0;
//     let failedRequests = 0;
//     const results = [];

//     for (let i = 1; i <= 100; i++) {
//         const startTime = Date.now();
//         try {
//             await page.goto(`https://opibox.netlify.app/load?level=${i}`);
//             const endTime = Date.now();
//             const duration = endTime - startTime;
//             successRequests++;
//             console.log(`Load level ${i} succeeded`);
//             results.push({ loadLevel: i, status: 'Success', duration });
//         } catch (error) {
//             const endTime = Date.now();
//             const duration = endTime - startTime;
//             failedRequests++;
//             console.log(`Load level ${i} failed`);
//             results.push({ loadLevel: i, status: 'Failed', duration });
//         }
//     }

//     console.log(`Total successful requests: ${successRequests}`);
//     console.log(`Total failed requests: ${failedRequests}`);

//     await context.close();

//     const csvFilePath = path.join(__dirname, 'Reliability-FaultTolerance-StressTest.csv');
//     const csvHeader = 'Load Level, Status, Duration (ms)\n';
//     const csvContent = results.map(r => `${r.loadLevel},${r.status},${r.duration}`).join('\n');

//     fs.writeFileSync(csvFilePath, csvHeader + csvContent, 'utf8');
//     console.log('Report writen successfully');
// });
