const express = require('express')
const router = express.Router()

const amqp = require('amqplib')
require('dotenv').config()

//cree la conexion con el rabbitmq desplegado en ec2 la ip es 18.204.160.57 (toda la info viene en .env)

const hostname = process.env.HOST || 'localhost'
const protocol = process.env.PROTOCOL
const username = process.env.USERNAME
const password = process.env.PASSWORD
const queue = process.env.QUEUE


const rabbitSettings = {
  protocol: protocol,
  hostname: hostname,
  username: username,
  password: password,
  vhost: '/'
}

const pool = require('../db/connection')

//Conexion y mandar a una queue
async function connect(message) {
  try {
      const conn = await amqp.connect(rabbitSettings)
      console.log("*Conectado*")

      const channel = await conn.createChannel();

      channel.sendToQueue(queue, Buffer.from(message))


  }
  catch (error){
      console.log('Erro =>', error)
  }
}


//Publicar
router.post('/orden_mq', async (req, res) => {
    const { order } = req.body;
    const message = {
      order
    };
  
    // Aquí se puede agregar la lógica para procesar la orden recibida
    // ...
  
    // Se publica la orden en la cola de RabbitMQ
    const channel = await connectRabbitMQ();
    const queueName = 'foodOrders';
  
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(req.body)));
    console.log(`Order recibida: ${JSON.stringify(req.body)}`);
    res.status(200).json({ message: 'Order recibida' });
  });

//Consumir
const consumeOrders = async () => {
    const channel = await connectRabbitMQ();
    const queueName = 'foodOrders';
  
    channel.consume(queueName, (message) => {
      const content = JSON.parse(message.content.toString());
      const order = content.order;
  
      // Aquí se puede agregar la lógica para procesar la orden recibida
      // ...
  
      console.log(`Orden procesada: ${JSON.stringify(content)}`);
  
      channel.ack(message); // Se confirma la recepción del mensaje
    });
}

consumeOrders();

module.exports = router;