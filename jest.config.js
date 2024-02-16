/** @type {import('ts-jest').JestConfigWithTsJest} */
require('dotenv').config({path: '.env.test'});


module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: ['jest-localstorage-mock'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};

