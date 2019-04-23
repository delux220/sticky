var path = require('path');

module.exports = {
proxy: {
        '/api': {
            target: 'https://beautyclout.dev',
            secure: true
        }
    }
};