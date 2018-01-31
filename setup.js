var {
    exec,
    spawn
} = require('child_process');
var fs = require('fs');

console.log('Setting up dev dependencies, please wait...\n');
var install = spawn('npm', ['install'], {
    detached: false,
    stdio: 'pipe'
});
install.stdout.on('data', data => {
    console.log(data.toString());
});
install.on('close', (code, signal) => {
    process.stdout.write('\x1Bc');
    console.log('Setting up package configuration...\n');
    prompting();
});

/**
 * Updatind package datas
 */
var prompting = () => {
    var prompt = require('prompt');
    var replace = require('replace');
    prompt.start();
    /**
     * Change pkg name
     */
    var packaging = {
        properties: {
            pkg_name: {
                description: 'The name is what your thing is called',
                pattern: /^[a-zA-Z\-]+$/,
                message: 'Name must be only letters or dashes',
                required: true
            },
            username: {
                description: 'The username is your Github name',
                required: true
            },
            name: {
                description: 'What is your name',
                pattern: /^[a-zA-Z\s\-]+$/,
                message: 'Name must be only letters, spaces or dashes'
            },
            email: {
                description: 'What is your e-mail address',
                pattern: /^(([^<>()\[\]\.,;:\s@\']+(\.[^<>()\[\]\.,;:\s@\']+)*)|(\'.+\'))@(([^<>()[\]\.,;:\s@\']+\.)+[^<>()[\]\.,;:\s@\']{2,})$/i,
                message: 'Invalid e-mail'
            },
            url: {
                description: 'What is your URL address',
                pattern: /(http(s)?(:\/\/))?(www\.)?/,
                message: 'Invalid Url'
            }
        }
    };
    prompt.get(packaging, (err, result) => {
        if (result) {
            replace({
                regex: '--pkg-name',
                replacement: result.pkg_name ? result.pkg_name : 'undefined',
                paths: ['package.json'],
                recursive: true,
                silent: true,
            });
            replace({
                regex: '--username',
                replacement: result.username ? result.username : 'undefined',
                paths: ['package.json'],
                recursive: true,
                silent: true,
            });
            replace({
                regex: '--author-name',
                replacement: result.name ? result.name : 'uninformed',
                paths: ['package.json'],
                recursive: true,
                silent: true,
            });
            replace({
                regex: '--author-email',
                replacement: result.email ? result.email : 'uninformed@mail.com',
                paths: ['package.json'],
                recursive: true,
                silent: true,
            });
            replace({
                regex: '--author-url',
                replacement: result.url ? result.url : 'http://uninformed',
                paths: ['package.json'],
                recursive: true,
                silent: true,
            });
            exec('node_modules/.bin/rimraf .git/ setup.js README.md');
            spawn('git', ['init']);
            fs.writeFile('README.md', `# ${result.pkg_name}`, err => {
                if(err) {
                    return console.log(err);
                }
                console.log('README.md Done!\n');
            });
            console.log('All done! Let\'s code!');
        }
    });
};
