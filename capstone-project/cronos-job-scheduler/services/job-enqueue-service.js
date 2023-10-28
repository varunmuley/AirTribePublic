const EventEmitter = require('events');
const entities = require('../../cronos-common-modules/cronos-database-module/entities');
const timerHelper = require('../../cronos-common-modules/utils/timer-helper');
const { Op } = require('sequelize');
const amqp = require('amqplib');

const rabbitmqUrl = process.env.RABBIT_MQ_CONNECTION;
const queueName = process.env.RABBIT_MQ_QUEUE;

class JobEnqueueService {
    cachedJobBuffer;
    jobEnqueueTimerMap;
    eventEmitter;
    rabbitMQConnection;
    rabbitMQChannel;
    lastFetchedUpto = new Date();

    constructor() {
        this.cachedJobBuffer = new Map();
        this.jobEnqueueTimerMap = new Map();
        this.init();
    }

    async initQueueChannel() {
        try {
            this.rabbitMQConnection = await amqp.connect(rabbitmqUrl);
            this.rabbitMQChannel = await this.rabbitMQConnection.createChannel();
            await this.rabbitMQChannel.assertQueue(queueName);
        } catch (error) {
            console.log(`Error creating channel to RabbitMQ. Error: ${JSON.stringify(error)}`);
        }
    }
    
    async init() {
        await this.initQueueChannel();
        await this.initJobsFetchInterval();
    }
    
    async initJobsFetchInterval() {
        // Initial fetch.
        await this.fetchJobs();
        const fetchInterval = process.env.FETCH_INTERVAL || 2;
        setInterval(async () =>{
            // Fetch jobs from DB in every <configurable> mins(default value is 2 min) and add to the buffer.
            console.log(`Fetching jobs for next 5 min`);
            this.fetchJobs();
        }, fetchInterval * 60 * 1000);
    }
    
    async fetchJobs() {
        try {
            const fetchUpto = process.env.FETCH_UPTO_NEXT || 5;
            const fetchUptoTimestamp = new Date(Date.now() + fetchUpto * 60 * 1000);
            const fetchedJobs = await entities.Job.findAll({
                where: {
                        next_scheduled_at: {
                            [Op.gte]: this.lastFetchedUpto,
                            [Op.lte]: fetchUptoTimestamp
                        }
                    }
            });
            for (const fetchedJob of fetchedJobs) { 
                // Add to buffer
                this.addToBuffer(fetchedJob);
            }
            this.lastFetchedUpto = fetchUptoTimestamp;
        } catch (exp) {
            console.log(`[Failed] job-enqueue-service->fetchJobs failed. Error: ${JSON.stringify(exp)}`);
        }
    }
    
    addToBuffer(jobObj) {
        const jobId = jobObj.dataValues.id;
        this.cachedJobBuffer.set(jobId, jobObj);
        const existingTimer = this.jobEnqueueTimerMap.get(jobId)
        if (existingTimer) {
            // Create existing timer.
            clearTimeout(existingTimer);
        }
        const calculatedTimeout = timerHelper.calculateRemaingTimeoutDuration(jobObj.dataValues.next_scheduled_at);
        const newTimer = setTimeout(() => {
            const jobToEnqueue = this.cachedJobBuffer.get(jobId)?.dataValues;
            if (jobToEnqueue) {
                jobToEnqueue.enqueued_at = new Date();
                this.enqueueJob(jobToEnqueue);
            } else {
                throw 'Job not found in cache';
            }
        }, calculatedTimeout);
        console.log(`Enqueue timer initiated for Job ID: ${jobObj.dataValues.id} at ${new Date()}, remaining time (approx): ${timerHelper.milliSecToMinAndSec(calculatedTimeout)}` + Date.now().toString());
        this.jobEnqueueTimerMap.set(jobObj.dataValues.id, newTimer);
    }
    
    async enqueueJob(jobEnqueueObject) {
        try {
            await this.publishToQueue(jobEnqueueObject);
            await this.updateJobForNextSchedule(jobEnqueueObject);
        } catch (error) {
            console.error(`Error enqueueing Job ID: ${jobEnqueueObject.id}. Error: ${JSON.stringify(error)}`);
        }
    }
    
    async publishToQueue(jobEnqueueObject) {
        try {
            await this.rabbitMQChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(jobEnqueueObject)));
        } catch (error) {
            console.error(`Error publishing Job ID: ${jobEnqueueObject.id} to queue. Error: ${JSON.stringify(error)}`);
            throw error;
        }
    }

    async updateJobForNextSchedule(jobObj) {
        try {
            const jobId = jobObj.id;
            const jobEntity = this.cachedJobBuffer.get(jobId);
            if (jobObj.type === 'recurring') {
                const next_scheduled_at = new Date(Date.now() + timerHelper.calculateTimeoutDuration(jobObj.frequency, jobObj.interval));
                jobEntity.next_scheduled_at = next_scheduled_at;
                await jobEntity.save();
            }
            if (new Date(jobEntity.next_scheduled_at) <= new Date(this.lastFetchedUpto)) {
                // Add to buffer again.
                this.addToBuffer(jobEntity);
            } else {
                this.cachedJobBuffer.delete(jobEnqueueObject.id);
            }
        } catch (error) {
            console.error(`Error updating Job ID: ${jobObj.id}. Error: ${JSON.stringify(error)}`);
        }
    }
}

module.exports = JobEnqueueService;