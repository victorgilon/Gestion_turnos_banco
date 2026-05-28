CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO productos (nombre, precio)
VALUES
  ('Tenis urbanos', 150000.00),
  ('Gorra de béisbol', 35000.00),
  ('Sudadera con capucha', 95000.00),
  ('Cinturón de cuero', 55000.00),
  ('Medias térmicas (par)', 12000.00),
  ('Bermuda de lino', 75000.00);