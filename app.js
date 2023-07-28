const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000; 

// Configuración de la conexión a la base de datos
const dbPath = '/home/chucarita/Descargas/northwind.db';

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  } else {
    console.log('Conexión a la base de datos SQLite establecida');
  }
});

app.use(express.static('frontend'));

app.get('/', (req, res) => {
  res.send('<h1>Bienvenido, ya está más cerca de buscar su orden...</h1>');
});

  app.get('/buscar-orden/:numeroOrden', (req, res) => {
    const numeroOrden = req.params.numeroOrden;
    console.log('Número de Orden recibido:', numeroOrden);

  // Consulta SQL
  const query = `
  SELECT o.OrderID, c.CompanyName, c.Address, p.ProductName, od.UnitPrice, od.Quantity, COUNT(DISTINCT o2.OrderID) AS CantidadOtrasOrdenes
  FROM Orders o 
  JOIN Customers c ON o.CustomerID = c.CustomerID
  JOIN "Order Details" od ON o.OrderID = od.OrderID
  JOIN Products p ON od.ProductID = p.ProductID
  LEFT JOIN "Order Details" o2 ON o2.OrderID <> o.OrderID AND od.ProductID = o2.ProductID
  WHERE o.OrderID = ${numeroOrden}
`;

  db.all(query, (err, rows) => {
    if (err) {
      console.error('Error al buscar la orden:', err.message);
      res.status(500).json({ error: 'Error al buscar la orden', errorMessage: err.message });
      return;
    }

    if (rows.length === 0) {
      res.status(404).json({ error: 'Orden no encontrada' });
      return;
    }
    res.json(rows); 
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
});
