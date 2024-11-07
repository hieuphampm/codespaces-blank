const format = require('pg-format');
const getPgClient = require('../config/db');

exports.getAllEmployees = async (req, res) => {
    const client = getPgClient();
    await client.connect();
    const result = await client.query('SELECT * FROM employee');
    await client.end();

    res.send({ success: true, code: 200, data: result.rows });
};

exports.getEmployeeById = async (req, res) => {
    const { id } = req.params;
    const client = getPgClient();
    const sql = format("SELECT * FROM employee WHERE id = %L", id);
    await client.connect();
    const result = await client.query(sql);
    await client.end();

    if (result.rows.length > 0) {
        res.send({ success: true, code: 200, data: result.rows[0] });
    } else {
        res.send({ success: false, code: 404, message: "Employee not found" });
    }
};

exports.createEmployee = async (req, res) => {
    const { fullname, email, tel, address } = req.body;
    
    if (!fullname || !email || !tel || !address) {
        return res.send({
            success: false,
            code: 400,
            message: "Missing required fields"
        });
    }
    
    const client = getPgClient();
    const sql = format("INSERT INTO employee (fullname, email, tel, address) VALUES (%L, %L, %L, %L) RETURNING *", fullname, email, tel, address);

    try {
        await client.connect();
        const result = await client.query(sql);
        await client.end();

        res.send({
            success: true,
            code: 201,
            message: "Employee created successfully",
            data: result.rows[0]
        });
    } catch (error) {
        await client.end();
        res.send({
            success: false,
            code: 500,
            message: "Database error",
            error: error.message
        });
    }
};

exports.updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { fullname, email, tel, address } = req.body;

    if (!id || (!fullname && !email && !tel && !address)) {
        return res.send({
            success: false,
            code: 400,
            message: "Invalid ID or missing fields to update"
        });
    }

    const fieldsToUpdate = [];
    if (fullname) fieldsToUpdate.push(format("fullname = %L", fullname));
    if (email) fieldsToUpdate.push(format("email = %L", email));
    if (tel) fieldsToUpdate.push(format("tel = %L", tel));
    if (address) fieldsToUpdate.push(format("address = %L", address));

    const sql = format("UPDATE employee SET %s WHERE id = %L RETURNING *", fieldsToUpdate.join(", "), id);

    const client = getPgClient();
    try {
        await client.connect();
        const result = await client.query(sql);
        await client.end();

        if (result.rows.length > 0) {
            res.send({
                success: true,
                code: 200,
                message: "Employee updated successfully",
                data: result.rows[0]
            });
        } else {
            res.send({
                success: false,
                code: 404,
                message: "Employee not found"
            });
        }
    } catch (error) {
        await client.end();
        res.send({
            success: false,
            code: 500,
            message: "Database error",
            error: error.message
        });
    }
};

exports.deleteEmployee = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.send({
            success: false,
            code: 400,
            message: "Invalid ID"
        });
    }

    const client = getPgClient();
    const sql = format("DELETE FROM employee WHERE id = %L RETURNING *", id);

    try {
        await client.connect();
        const result = await client.query(sql);
        await client.end();

        if (result.rowCount > 0) {
            res.send({
                success: true,
                code: 200,
                message: "Employee deleted successfully"
            });
        } else {
            res.send({
                success: false,
                code: 404,
                message: "Employee not found"
            });
        }
    } catch (error) {
        await client.end();
        res.send({
            success: false,
            code: 500,
            message: "Database error",
            error: error.message
        });
    }
};
