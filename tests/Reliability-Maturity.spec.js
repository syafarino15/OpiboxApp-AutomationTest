const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Jumlah pengulangan pengujian
const iterations = 5;

test('Reliability-Maturity-Endurance Test', async ({ page }) => {
    const results = [];

    for (let i = 0; i < iterations; i++) {
        const startTime = Date.now();

        await page.goto('https://opibox.netlify.app/', { waitUntil: 'load', timeout: 10000 });
        await page.getByRole('link', { name: 'Masuk' }).click();
        await page.getByRole('textbox', { name: 'Masukkan email' }).fill('an2000016080@webmail.uad.ac.id');
        await page.getByRole('textbox', { name: 'Masukkan kata sandi' }).fill('An_2000016080');
        await page.getByRole('button', { name: 'Masuk' }).click();

        // Verifikasi bahwa login berhasil
        await expect(page.locator("//a[normalize-space()='Lihat semua']")).toBeVisible({ timeout: 60000 });

        const endTime = Date.now();
        const duration = endTime - startTime;
        results.push({ iteration: i, status: 'Success', duration });

        // Logout dan ulangi
        await page.getByRole('link', { name: 'Pengaturan' }).click();
        await page.click('#logout');
        await page.getByRole('button', { name: 'Ya' }).click();

        console.log(`Iteration ${i + 1} completed`);
    }

    // // Menyimpan hasil ke file CSV
    // const csvFilePath = path.join(__dirname, 'Reliability-Maturity-EnduranceTest.csv');
    // const csvHeader = 'Iteration, Status, Load Time (ms)\n';
    // const csvContent = results.map(r => `${r.iteration}, ${r.status}, ${r.duration}`).join('\n');
    // fs.writeFileSync(csvFilePath, csvHeader + csvContent, 'utf8');
    // console.log('CSV report written successfully');

    // Menyimpan hasil ke file TXT
    const txtFilePath = path.join(__dirname, 'Reliability-Maturity-EnduranceTest.txt');
    const txtContent = results.map(r => `Iteration: ${r.iteration}, Status: ${r.status}, Load Time: ${r.duration} ms`).join('\n');
    fs.writeFileSync(txtFilePath, txtContent, 'utf8');
    console.log('TXT report written successfully');

    // Menyimpan hasil ke file JSON
    const jsonFilePath = path.join(__dirname, 'Reliability-Maturity-EnduranceTest.json');
    const jsonContent = JSON.stringify(results, null, 2);
    fs.writeFileSync(jsonFilePath, jsonContent, 'utf8');
    console.log('JSON report written successfully');
});

// // Jumlah pengulangan pengujian
// const iterations = 50;

// test('Reliability-Maturity-Endurance Test', async ({ page }) => {
//     const results = [];

//     for (let i = 0; i < iterations; i++) {

//         const startTime = Date.now();

//         await page.goto('https://opibox.netlify.app/', { waitUntil: 'load', timeout: 10000 });
//         await page.getByRole('link', { name: 'Masuk' }).click();
//         await page.getByRole('textbox', { name: 'Masukkan email' }).fill('syafarino010502@gmail.com');
//         await page.getByRole('textbox', { name: 'Masukkan kata sandi' }).fill('Syafarino_010502');
//         await page.getByRole('button', { name: 'Masuk' }).click();

//         // Verifikasi bahwa login berhasil
//         await expect(page.getByRole('heading', { name: 'Proyek Saya' })).toBeVisible();

//         const endTime = Date.now();
//         const duration = endTime - startTime;
//         results.push({ iteration: i, status: 'Success', duration });

//         // Logout dan ulangi
//         await page.getByRole('link', { name: 'Pengaturan' }).click();
//         await page.click('#logout');
//         await page.getByRole('button', { name: 'Ya' }).click();

//         console.log(`Iteration ${i + 1} completed`);
//     }

//     const csvFilePath = path.join(__dirname, 'Reliability-Availability-EnduranceTest.csv');
//     const csvHeader = 'Iteration, Status, Load Time (ms)\n';
//     const csvContent = results.map(r => `${r.iteration}, ${r.status}, ${r.duration}`).join('\n');

//     fs.writeFileSync(csvFilePath, csvHeader + csvContent, 'utf8');
//     console.log('Report writen successfully');
// });