// FROM: https://github.com/callemall/material-ui/blob/master/scripts/copy-files.js
/*
 The MIT License (MIT)

 Copyright (c) 2014 Call-Em-All

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

const path = require('path');
const fse = require('fs-extra');

const files = [
    'README.md',
    'LICENSE',
];

Promise.all(
    files.map((file) => copyFile(file))
)
    .then(() => createPackageFile());

function copyFile(file) {
    const buildPath = resolveBuildPath(file);
    return new Promise((resolve) => {
        fse.copy(
            file,
            buildPath,
            (err) => {
                if (err) throw err;
                resolve();
            }
        );
    })
        .then(() => console.log(`Copied ${file} to ${buildPath}`));
}

function resolveBuildPath(file) {
    return path.resolve(__dirname, './dist/', path.basename(file));
}

function createPackageFile() {
    return new Promise((resolve) => {
        fse.readFile(path.resolve(__dirname, './package.json'), 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            resolve(data);
        });
    })
        .then((data) => JSON.parse(data))
        .then((packageData) => {
            const {
                name,
                author,
                version,
                description,
                keywords,
                repository,
                license,
                dependencies,
            } = packageData;

            const minimalPackage = {
                name,
                author,
                version,
                description,
                main: './index.js',
                keywords,
                repository,
                license,
                dependencies,
            };

            return new Promise((resolve) => {
                const buildPath = path.resolve(__dirname, './dist/package.json');
                const data = JSON.stringify(minimalPackage, null, 2);
                fse.writeFile(buildPath, data, (err) => {
                    if (err) throw (err);
                    console.log(`Created package.json in ${buildPath}`);
                    resolve();
                });
            });
        });
}