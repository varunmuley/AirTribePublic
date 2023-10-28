require('dotenv').config();

const { container, TYPES } = require('./services/container');

const jobExecutorService = container.get(TYPES.JobExecutorService);
const amqp = require('amqplib');

const rabbitmqUrl = process.env.RABBIT_MQ_CONNECTION;
const queueName = process.env.RABBIT_MQ_QUEUE;

async function initQueue() {
    try {
        jobExecutorService.rabbitMQConnection = await amqp.connect(rabbitmqUrl);
        jobExecutorService.rabbitMQChannel = await jobExecutorService.rabbitMQConnection.createChannel();
        await jobExecutorService.rabbitMQChannel.assertQueue(queueName);
        console.log(`Queue "${queueName}" initiated successfully.`);

        consumeMessage();

    } catch (error) {
        console.error(`[Failed]: initQueue() method failed to create the queue. Error: ${JSON.stringify(error)}`);
    }
  }

async function consumeMessage() {
    try {
      console.log(`Waiting for messages in ${queueName}.`);
      // Consume messages from the queue
      jobExecutorService.rabbitMQChannel.consume(queueName, (message) => {
        if (message) {
            console.log(`Received: ${message.content.toString()}`);
            const jobObj = message.content.toString();
            jobExecutorService.processMessage(jobObj);
            jobExecutorService.rabbitMQChannel.ack(message);
        }
      });
    } catch (error) {
      console.error(`[Failed]: consumeMessage(). Error: ${JSON.stringify(error)}`);
    }
}

async function init() {
    await initQueue();
}

init();