const uuid = require('uuid');
const { exec, execFile } = require('child_process');
const { JobExecution } = require('../models/entities');

const queueName = process.env.RABBIT_MQ_QUEUE;

class JobExecutorService {
    jobRetryCountMap;
    rabbitMQConnection;
    rabbitMQChannel;

    constructor() {
        this.jobRetryCountMap = new Map();
        this.init();
    }

    executeCommand(jobObj, jobExecutionObj){
        try {
            const payloadCommand = jobObj.payload;
            exec(payloadCommand, async (error, stdout, stderr) => {
                if (error) {
                    console.log(error);
                    jobExecutionObj.status = 'failed';
                    jobExecutionObj.execution_completed_at = new Date();
                    await jobExecutionObj.save();
                    this.retryJob(jobObj);
                    return;
                }
                if(stderr && stderr!='Debugger attached.\nWaiting for the debugger to disconnect...\n') {
                    console.log(stderr);
                    jobExecutionObj.status = 'failed';
                    jobExecutionObj.execution_completed_at = new Date();
                    await jobExecutionObj.save();
                    this.retryJob(jobObj);
                    return;
                }
                console.log(stdout);
                jobExecutionObj.status = 'success';
                jobExecutionObj.execution_completed_at = new Date();
                await jobExecutionObj.save();
                return;
            });
            jobExecutionObj.status = 'executing';
            jobExecutionObj.execution_started_at = new Date();
            jobExecutionObj.save();
        } catch (error) {
            console.log(`[Failed] executeCommand failed. Error : ${JSON.stringify(error)}`);
            jobExecutionObj.status = 'failed';
            jobExecutionObj.execution_completed_at = new Date();
            jobExecutionObj.save();

            this.retryJob(jobObj);
        }
    };

    retryJob(jobObj) {
        const retry_count = this.getRetryCount(jobObj.id ,jobObj.max_retry);
        if (retry_count === -1 ) {
            return;
        }
        // cool off for 30 sec
        setTimeout(() => {
            jobObj.retry_count_no = retry_count;
            jobObj.enqueued_at = new Date();
            this.rabbitMQChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(jobObj)));
        }, 30000);

    }

    executeFile(filePath, args){
        execFile(filePath, args ,(error, stdout, stderr) => {
            console.log(stdout) 
        });
    };

    async processMessage(jobObjStr) {
        // create execute entity entry.
        try {
            // job execution id
            const jobObj = JSON.parse(jobObjStr);
            const jobExecutionId = uuid.v4();
            const jobExecutionObj = await JobExecution.create({
                id: jobExecutionId,
                JobId: jobObj.id,
                status: "claimed",
                retry_count_no: jobObj.retry_count_no || 0,
                output_file_path: 'logs/' + jobExecutionId + '.log',
                enqueued_at: jobObj.enqueued_at,
                claimed_at: new Date(),
                execution_started_at: null,
                execution_completed_at: null
            });
            this.execute(jobObj, jobExecutionObj);
        } catch (error) {
            console.log(`[Failed] execution entity creation failed. Error : ${JSON.stringify(error)}`);
        }
    }

    execute(jobObj, jobExecutionObj) {
        // Create execution entity and then start execution.
        if (jobObj.payload_type === 'command') {
            this.executeCommand(jobObj, jobExecutionObj);
        } else if (jobObj.payload_type === 'executeable') {

        } else {
            console.log('Only command line and executable files supported as of now.');
        }
    }

    getRetryCount(jobId, max_retry) {
        if (!max_retry) {
            max_retry =2;
        }
        const jobRetryCount = this.jobRetryCountMap.get(jobId);
        if (!jobRetryCount)  {
            this.jobRetryCountMap.set(jobId, 1);
            return 1;
        }
        if (jobRetryCount + 1 <= max_retry) {
            this.jobRetryCountMap.set(jobId, jobRetryCount + 1);
            return jobRetryCount + 1;
        }
        // No more retries allowed.
        return -1;
    }

    async init() {
    }
}

module.exports = JobExecutorService;