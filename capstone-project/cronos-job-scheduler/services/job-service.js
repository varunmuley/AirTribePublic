const entities = require('../../cronos-common-modules/cronos-database-module/entities');
const uuid = require('uuid');

class JobService {
    jobEnqueueService;
    constructor(JobEnqueueService) {
        this.jobEnqueueService = JobEnqueueService;
    }

    async createJob(jobObj) {
        try {
            if (jobObj.payload_type === 'executeable') {
                //TODO: upload binary file here.
            }

            if (new Date(jobObj.next_scheduled_at) < new Date(Date.now())) {
                return { 
                    error: true,
                    message: "'next_scheduled_at' can't be less than current time."
                };
            }

            const jobModel = {
                id: uuid.v4(),
                type: jobObj.type,
                description: jobObj.description,
                payload: jobObj.payload, // file path here or in line command
                payload_type: jobObj.payload_type,
                frequency: jobObj.frequency,
                interval: jobObj.interval,
                next_scheduled_at: jobObj.next_scheduled_at // calculated date here
            };
        
            const createdJob = await entities.Job.create(jobModel);

            if (new Date(createdJob.dataValues.next_scheduled_at) <= new Date(this.jobEnqueueService.lastFetchedUpto)) {
                // add directly to the buffer also.
                this.jobEnqueueService.addToBuffer(createdJob);
            }

            return createdJob.dataValues;
        } catch (error) {
            console.log(`[Error] Error creating new job. Error: ${JSON.stringify(error)}`);
            throw error;
        }
    }

    async updateJob(jobId, updatedJobObj) {
        try {
            const jobObjToUpdate = await entities.Job.findOne({ 
                where: {
                    id: jobId
                }
            });

            if (new Date(updatedJobObj.next_scheduled_at) < new Date(Date.now())) {
                return { 
                    error: true,
                    message: "'next_scheduled_at' can't be less than current time."
                };
            }

            const updatedJob = await jobObjToUpdate.update(updatedJobObj);

            if (new Date(updatedJob.dataValues.next_scheduled_at) <= new Date(this.jobEnqueueService.lastFetchedUpto)) {
                // add directly to the buffer also.
                this.jobEnqueueService.addToBuffer(updatedJob);
            }
            return updatedJob;
        } catch (exp) {
            console.log(`[Error] Error updating the job. Error: ${JSON.stringify(exp)}`);
            return null;
        }
    }

    async getJob(jobId) {
        try {
            const job = await entities.Job.findOne({ 
                where: {
                    id: jobId
                }
            });
            return job;
        } catch (exp) {
            return null;
        }
    }

    async getAllJobs() {
        try{
            const jobs = await entities.Job.findAll();
            return jobs.map(j => j.dataValues);    
        } catch (exp) {
            return null;
        }
    }

}

module.exports = JobService;