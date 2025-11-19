const fs = require("fs");
const path = require("path");

function saveImagePng (image, directory, name) {

    const chartDir = path.join(__dirname, directory);
    const fileName = `${name}.png`;
    const filePath = path.join(chartDir, fileName);

    const imageBuffer = Buffer.from(image, "base64");

    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, imageBuffer, (err) => {
            if (err) return reject(err);
            resolve(filePath);
        });
    });
}

module.exports = { saveImagePng };