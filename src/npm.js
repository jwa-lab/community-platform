const npm = require("npm");

module.exports = {
    execNpm(command) {
        return new Promise((resolve, reject) => {
            npm.load(() => {
                try {
                    npm.run(command, resolve);
                } catch (err) {
                    reject(err);
                }
            });
        });
        
    }
}