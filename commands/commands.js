#!/usr/bin/env node

const program = require('commander')

const start = require('../index')

program
    .version('1.0.0')
    .description('Application to resizing images')


program
    .command('start')
    .description('Start application')
    .action(() => start())

program.parse(process.argv)
