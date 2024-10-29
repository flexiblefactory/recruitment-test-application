import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import Employee from './Employee';
import EmployeeModal from './EmployeeModal';
import {
    Button,
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    Divider,
    Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [sumABC, setSumABC] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        // Establish SignalR connection
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${import.meta.env.VITE_API_URL}/hub`)
            .build();

        connection.start().then(() => {
            console.log("Connected to SignalR");
        });

        // Listen for data change notifications
        connection.on("DataChanged", () => {
            fetchEmployeeData();
            fetchSumABC();
        });

        // Fetch initial data
        fetchEmployeeData();
        fetchSumABC();

        return () => {
            connection.stop();
        };
    }, []);

    const fetchEmployeeData = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/employees`);
        const data = await response.json();
        setEmployees(data);
    };

    const fetchSumABC = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/total-value-abc`);
        const data = await response.json();
        setSumABC(data.totalValue);
    };

    const deleteEmployee = async (id) => {
        await fetch(`${import.meta.env.VITE_API_URL}/employees/${id}`, {
            method: 'DELETE',
        });
        // fetchEmployeeData();
    };

    const handleOpenModal = (employee = null) => {
        setSelectedEmployee(employee);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedEmployee(null);
    };

    const incrementValues = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/increment-values`, {
            method: 'POST',
        });
        /*         if (response.ok) {
                    fetchEmployeeData();
                    fetchSumABC();
                } */
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Employee Management
                </Typography>

                <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenModal()}
                    >
                        Add Employee
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<TrendingUpIcon />}
                        onClick={incrementValues}
                    >
                        Increment Values
                    </Button>
                </Stack>

                <Box sx={{ mb: 4 }}>
                    {employees.map(employee => (
                        <Employee
                            key={employee.id}
                            employee={employee}
                            onDelete={deleteEmployee}
                            onEdit={() => handleOpenModal(employee)}
                        />
                    ))}
                </Box>

                <Divider sx={{ my: 3 }} />

                <Paper
                    elevation={1}
                    sx={{
                        p: 2,
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                        borderRadius: 2
                    }}
                >
                    <Typography variant="h6">
                        Total Value (A, B, C Names): {sumABC >= 11171 ? sumABC : ''}
                    </Typography>
                </Paper>
            </Paper>

            <EmployeeModal
                open={modalOpen}
                handleClose={handleCloseModal}
                employee={selectedEmployee}
            />
        </Container>
    );
};

export default Employees;
