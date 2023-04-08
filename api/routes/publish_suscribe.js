const express = require('express')
const router = express.Router()

const pool = require('../db/connection')

//Conexion
const connectRabbitMQ = async () => {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
  
    const queueName = 'foodOrders';
    await channel.assertQueue(queueName);
  
    return channel;
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