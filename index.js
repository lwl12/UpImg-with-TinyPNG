const upimg = require('upimg')
const tinify = require("tinify");
const readline = require('readline');
const fs = require("fs");

tinify.key = "YOUR_TINIFY_KEY";
tinify.proxy = "http://YOUR_PROXY_IF_NECESSARY";

const main = () => {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Input Image URL: ', async (answer) => {

        const pic = tinify.fromUrl(answer).resize({
            method: "scale",
            height: 201
        });
        rl.close();
        console.log("\x1b[32mTask submitted.\x1b[0m");

        await pic.toFile("./optimized");
        console.log("\x1b[33mOptimized. Size: \x1b[36m" + (fs.statSync("./optimized").size / 1000.0) + "KB\x1b[0m");

        await upimg.jd
            .upload('./optimized')
            .then(json => {
                require('child_process').spawn('clip').stdin.end(json.url);
                console.log("\x1b[32mUpload success.\x1b[37m " + json.url + "\x1b[0m")
                })
            .catch(err => console.error(err.message));

        return main();
    });
}

main();