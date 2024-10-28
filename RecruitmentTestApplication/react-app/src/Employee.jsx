import React from 'react';
import { Card, CardContent, Typography, IconButton, Box, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Employee = ({ employee, onDelete, onEdit }) => {
    return (
        <Card sx={{ 
            mb: 2, 
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3
            }
        }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h6" component="div">
                            {employee.name}
                        </Typography>
                        <Chip 
                            label={`Value: ${employee.value}`}
                            color="primary"
                            size="small"
                            sx={{ mt: 1 }}
                        />
                    </Box>
                    <Box>
                        <IconButton 
                            onClick={onEdit}
                            color="primary"
                            size="small"
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton 
                            onClick={() => onDelete(employee.id)}
                            color="error"
                            size="small"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default Employee;
