require('reflect-metadata');
const inversify = require("inversify");
const { Container } = require('inversify');

const JobService = require('./job-service');
const JobEnqueueService = require('./job-enqueue-service');
const UserService = require('./user-service');

const TYPES = {
    UserService: Symbol.for('UserService'),
    JobService: Symbol.for('JobService'),
    JobEnqueueService: Symbol.for('JobEnqueueService')
};

inversify.decorate(inversify.injectable(), UserService);
inversify.decorate(inversify.injectable(), JobService);
inversify.decorate(inversify.injectable(), JobEnqueueService);

inversify.decorate(inversify.inject(TYPES.JobEnqueueService), JobService, 0);

const container = new Container();

container.bind(TYPES.UserService).to(UserService);
container.bind(TYPES.JobService).to(JobService);
container.bind(TYPES.JobEnqueueService).to(JobEnqueueService);

module.exports = { container, TYPES };