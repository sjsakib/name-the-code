const withTypeScript = require('@zeit/next-typescript');
const withSass = require('@zeit/next-sass');

module.exports = withSass(withTypeScript());
