const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const os = require('os-utils'); // untuk memonitor penggunaan CPU dan memori

test('Reliability-Availability-Load Test', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const numRequests = 100;
    const delay = 200; // Jeda dalam milidetik
    const retryLimit = 3; // Batas pengulangan jika terjadi kegagalan
    const results = [];

    for (let i = 0; i < numRequests; i++) {
        let attempt = 0;
        let success = false;
        const startTime = Date.now();

        while (attempt < retryLimit && !success) {
            try {
                const response = await page.goto('https://opibox.netlify.app/', { waitUntil: 'load', timeout: 10000 });
                const endTime = Date.now();
                const duration = endTime - startTime;
                console.log(`Request ${i + 1} status: ${response.status()}`);

                if (response.status() === 200) {
                    success = true;
                    results.push({ iteration: i, status: 'Success', duration, attempt: attempt + 1 });
                } else {
                    attempt++;
                }

                // Verifikasi bahwa halaman utama berhasil dimuat
                expect(response.status()).toBe(200);

            } catch (error) {
                attempt++;
                if (attempt === retryLimit) {
                    const endTime = Date.now();
                    const duration = endTime - startTime;
                    console.error(`Request ${i + 1} failed after ${retryLimit} attempts: ${error.message}`);
                    results.push({ iteration: i, status: 'Failed', duration, attempt: attempt });
                }
            }
        }

        // Memonitor penggunaan CPU dan memori
        os.cpuUsage((cpuUsage) => {
            const memUsage = os.freememPercentage();
            results[results.length - 1].cpuUsage = (cpuUsage * 100).toFixed(2) + '%';
            results[results.length - 1].memUsage = (memUsage * 100).toFixed(2) + '%';
        });

        await page.waitForTimeout(delay); // Jeda antar permintaan
    }

    await context.close();

    // Menyimpan hasil ke file CSV
    const csvFilePath = path.join(__dirname, 'Reliability-Availability-LoadTest.csv');
    const csvHeader = 'Iteration, Status, Load Time (ms), Attempt, CPU Usage, Memory Usage\n';
    const csvContent = results.map(r => `${r.iteration},${r.status},${r.duration},${r.attempt},${r.cpuUsage || 'N/A'},${r.memUsage || 'N/A'}`).join('\n');
    fs.writeFileSync(csvFilePath, csvHeader + csvContent, 'utf8');
    console.log('CSV report written successfully');

    // Menyimpan hasil ke file TXT
    const txtFilePath = path.join(__dirname, 'Reliability-Availability-LoadTest.txt');
    const txtContent = results.map(r => `Iteration: ${r.iteration}, Status: ${r.status}, Load Time: ${r.duration} ms, Attempt: ${r.attempt}, CPU Usage: ${r.cpuUsage || 'N/A'}, Memory Usage: ${r.memUsage || 'N/A'}`).join('\n');
    fs.writeFileSync(txtFilePath, txtContent, 'utf8');
    console.log('TXT report written successfully');

    // Menyimpan hasil ke file JSON
    const jsonFilePath = path.join(__dirname, 'Reliability-Availability-LoadTest.json');
    const jsonContent = JSON.stringify(results, null, 2);
    fs.writeFileSync(jsonFilePath, jsonContent, 'utf8');
    console.log('JSON report written successfully');
});



// test('Reliability-Availability-Load Test', async ({ browser }) => {
//     const context = await browser.newContext();
//     const page = await context.newPage();

//     // Menghasilkan beberapa permintaan dengan jeda antar permintaan
//     const numRequests = 100;
//     const delay = 200; // Jeda dalam milidetik
//     const responses = [];
//     const results = [];

//     for (let i = 0; i < numRequests; i++) {

//         const startTime = Date.now();

//         try {
//             const response = await page.goto('https://opibox.netlify.app/', { waitUntil: 'load', timeout: 10000 });
//             const endTime = Date.now();
//             const duration = endTime - startTime;
//             console.log(`Request ${i + 1} status: ${response.status()}`);
//             responses.push(response);
//             results.push({ iteration: i, status: 'Success', duration });
//         } catch (error) {
//             const endTime = Date.now();
//             const duration = endTime - startTime;
//             console.error(`Request ${i + 1} failed: ${error.message}`);
//             responses.push(null);
//             results.push({ iteration: i, status: 'Failed', duration });
//         }
//         await page.waitForTimeout(delay); // Menambahkan jeda antar permintaan

//         // const endTime = Date.now();
//         // const loadTime = endTime - startTime;
//         // fs.appendFileSync(reportFile, `${i + 1}, ${loadTime}\n`);
//     }

//     // Verifikasi bahwa semua permintaan berhasil
//     responses.forEach((response, index) => {
//         if (response) {
//             expect(response.status()).toBe(200);
//         } else {
//             console.error(`Request ${index + 1} did not receive a valid response.`);
//         }
//     });

//     await context.close();

//     const csvFilePath = path.join(__dirname, 'Reliability-Availability-LoadTest.csv');
//     const csvHeader = 'Iteration, Status, Load Time (ms)\n';
//     const csvContent = results.map(r => `${r.iteration},${r.status},${r.duration}`).join('\n');

//     fs.writeFileSync(csvFilePath, csvHeader + csvContent, 'utf8');
//     console.log('Report writen successfully');
// });
