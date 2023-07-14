/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: ['react-app'],
    ignorePatterns: ['**/{node_modules,public,dist}'],
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: 'tsconfig.json'
    }
};
