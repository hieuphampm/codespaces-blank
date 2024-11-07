const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middleware/auth');

module.exports = (server) => {
    server.get('/employee', employeeController.getAllEmployees);
    server.get('/employee/:id', employeeController.getEmployeeById);
    
    server.post('/employee', authMiddleware, employeeController.createEmployee);
    server.patch('/employee/:id', authMiddleware, employeeController.updateEmployee);
    server.del('/employee/:id', authMiddleware, employeeController.deleteEmployee);
};
