const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtener los datos de contacto
const getContactInfo = async (req, res) => {
    const sql = "SELECT * FROM datos_contacto ORDER BY id DESC LIMIT 1";
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error al obtener datos de contacto:', err);
            return res.status(500).json({ message: "Error en el servidor" });
        }
        return res.json(result[0]);
    });
};

// Crear o actualizar los datos de contacto
const upsertContactInfo = async (req, res) => {
    const { direccion, email, telefono } = req.body;

    // Validaciones
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Formato de correo electrónico inválido" });
    }

    if (!phoneRegex.test(telefono)) {
        return res.status(400).json({ message: "Formato de número de teléfono inválido" });
    }

    // Verificar si ya existen datos de contacto
    const checkSql = "SELECT * FROM datos_contacto ORDER BY id DESC LIMIT 1";
    db.query(checkSql, (err, result) => {
        if (err) {
            console.error('Error al consultar datos de contacto:', err);
            return res.status(500).json({ message: "Error en el servidor" });
        }

        if (result.length > 0) {
            // Actualizar si ya existe
            const updateSql = "UPDATE datos_contacto SET direccion = ?, email = ?, telefono = ? WHERE id = ?";
            db.query(updateSql, [direccion, email, telefono, result[0].id], (err) => {
                if (err) {
                    console.error('Error al actualizar los datos de contacto:', err);
                    return res.status(500).json({ message: "Error en el servidor" });
                }
                return res.json({ success: "Datos de contacto actualizados correctamente" });
            });
        } else {
            // Crear si no existe
            const insertSql = "INSERT INTO datos_contacto (direccion, email, telefono) VALUES (?, ?, ?)";
            db.query(insertSql, [direccion, email, telefono], (err) => {
                if (err) {
                    console.error('Error al crear los datos de contacto:', err);
                    return res.status(500).json({ message: "Error en el servidor" });
                }
                return res.json({ success: "Datos de contacto creados correctamente" });
            });
        }
    });
};

// Eliminar lógicamente los datos de contacto (opcional si se necesita)
const deleteContactInfo = async (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM datos_contacto WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar los datos de contacto:', err);
            return res.status(500).json({ message: "Error en el servidor" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Datos de contacto no encontrados" });
        }
        return res.json({ success: "Datos de contacto eliminados correctamente" });
    });
};

// Exportar las funciones
module.exports = { getContactInfo, upsertContactInfo, deleteContactInfo };
