const express = require("express")
const Employee = require("../Models/Employee")
const { check, validationResult } = require('express-validator');
const authenticateToken = require('../Middleware/authenticateToken');

const routes = express.Router()

routes.get("/emp/employees", authenticateToken, (req, res) => {
    Employee.find().then((employees) => {
        res.send(employees).status(200)
    }).catch((err) => {
        res.status(500).send({message: err.message})
    })
})

routes.post("/emp/employees", [ authenticateToken,
    check('first_name', 'First name is required').not().isEmpty(),
    check('last_name', 'Last name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail()
  ], async (req, res) => {

    const errors = validationResult(req); //https://express-validator.github.io/docs/6.0.0/validation-result-api/
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }  

    const employeeData = req.body
    console.log(employeeData);
    try {
        const employee = new Employee(employeeData)
        const newEmployee = await employee.save()
        res.status(201).json({
            message: 'Employee created successfully.',
            employee_id: newEmployee._id
          });
    } catch (err) {
        res.status(500).send({message: err.message})
    }
})

routes.get("/emp/employees/:empid", authenticateToken, (req, res) => {
    Employee.findById(req.params.empid, req.body, {new: true})
    .then((employee) => {
        if(employee) {
            res.send(employee).status(200)
        } else {
            res.status(404).send({message: "Employee not found"})
        }
    }).catch((err) => {
        res.status(500).send({message: err.message})
    })
})

routes.post("/emp/employees/:empid", authenticateToken, (req, res) => {
    Employee.findByIdAndUpdate(req.params.empid, req.body, {new: true})
    .then((employee) => {
        if(employee) {
            res.status(200).json({
                message: 'Employee details updated successfully.'
              });
        } else {
            res.status(404).send({message: "Employee not found"})
        }
    }).catch((err) => {
        res.status(500).send({message: err.message})
    })
})

routes.delete("/emp/employees", authenticateToken, (req, res) => {
    const empId = req.query.eid;

    Employee.findByIdAndDelete(empId).then((employee) => {
        if(employee) {
            res.status(204).json({
                message: 'Employee deleted successfully.'
              });
        } else {
            res.status(404).send({message: "Employee not found"})
        }
    }).catch((err) => {
        res.status(500).send({message: err.message})
    })
})

module.exports = routes