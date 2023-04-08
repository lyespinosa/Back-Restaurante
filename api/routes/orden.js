const express = require('express')
const router = express.Router()

const pool = require('../db/connection')


//Obtener todas las ordenes 
router.get('/api/ordenes', (req, res) => {
    pool.query('SELECT * FROM ordenes', (err, rows, fields) => {
      if(!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    });  
});

// Obtener una orden
router.get('/api/ordenes/:id', (req, res) => {
    const { id } = req.params; 
    pool.query('SELECT * FROM ordenes WHERE id = ?', [id], (err, rows, fields) => {
      if (!err) {
        res.json(rows[0]);
      } else {
        console.log(err);
      }
    });
});
  
// Borrar una orden
router.delete('/api/ordenes/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM ordenes WHERE id = ?', [id], (err, rows, fields) => {
      if(!err) {
        res.json({status: 'Orden eliminada'});
      } else {
        console.log(err);
      }
    });
});


//Crear Orden
router.post('/api/ordenes', async (req, res) => {

    const {pedidos, mesero_id} = req.body;
    const nuevaOrden = {
        pedidos : JSON.stringify(pedidos),
        mesero_id
    }
    await pool.query('INSERT INTO ordenes set ?', [nuevaOrden],(err, rows, fields) => {
        if(!err) {
          res.json({status: 'Orden realizada'});
        } else {
          console.log(err);
        }
    });
  
});

//Editar Orden
router.post('api/ordenes/:id', async (req, res) => {
   
    const {id, pedidos, mesero_id} = req.body
    const nuevaOrden = {
      pedidos, mesero_id
    }
    await pool.query('UPDATE ordenes set ? WHERE id = ?', [nuevaOrden,id], (err, rows, fields) => {
        if(!err) {
          res.json({status: 'Orden actualizada'});
        } else {
          console.log(err);
        }
    });
})
  
module.exports = router;