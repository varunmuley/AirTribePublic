require('reflect-metadata');
const inversify = require("inversify");
const { Container } = require('inversify');

const JobExecutorService = require('./job-executor-service');

const TYPES = {
    JobExecutorService: Symbol.for('JobExecutorService')
};

inversify.decorate(inversify.injectable(), JobExecutorService);

const container = new Container();

container.bind(TYPES.JobExecutorService).to(JobExecutorService);

module.exports = { container, TYPES };