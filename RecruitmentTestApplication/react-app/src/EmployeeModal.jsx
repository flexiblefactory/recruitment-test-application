import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Box, 
  TextField, 
  Button, 
  Typography,
  IconButton,
  Stack,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const EmployeeModal = ({ open, handleClose, employee, onSave }) => {
  const [name, setName] = useState(employee?.name || '');
  const [value, setValue] = useState(employee?.value || '');
  const [nameError, setNameError] = useState(false);
  const [valueError, setValueError] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    if (employee) {
      handleNameChange(employee.name);
      handleValueChange(String(employee.value));
    } else {
      setName('');
      setValue('');
    }
  }, [employee]);

  const handleSubmit = async () => {
    if (!name || !value) {
      return;
    }
    const method = employee ? 'PUT' : 'POST';
    const url = `${import.meta.env.VITE_API_URL}/employees${employee ? `/${employee.id}` : ``}` ;
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, value: parseInt(value, 10) }),
    });

    if (response.ok) {
      
      if(onSave) onSave();
      setName('');
      setValue('');
      handleClose();
    }
    else {
    console.error('Error occurred while saving employee data:', response.status, response.statusText);
    }
  };

  const handleNameChange = (newValue) => {
    setName(newValue);
    setIsEdited(true);
    setNameError(!newValue);
  };

  const handleValueChange = (newValue) => {
     // Allow only numeric input or blank
    if (/^\d*$/.test(newValue)) {
      setValue(newValue);
      setIsEdited(true);
    }
    setValueError(!newValue || isNaN(newValue));
  };

  const isSaveDisabled = !name || !value || isNaN(value);

  return (
    <Modal 
      open={open} 
      onClose={handleClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Paper
        elevation={24}
        sx={{
          position: 'relative',
          width: 400,
          maxWidth: '90%',
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 3
        }}
      >
        <IconButton
          sx={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
          {employee ? 'Edit Employee' : 'Add Employee'}
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Name"
            value={name}
            onChange={e=>handleNameChange(e.target.value)}
            fullWidth
            variant="outlined"
            autoFocus
            error={nameError && isEdited}
            helperText={nameError && isEdited ? 'Name cannot be blank' : ''}
          />
          
          <TextField
            label="Value"
            type="text"
            value={value}
            onChange={e=>handleValueChange(e.target.value)}
            fullWidth
            variant="outlined"
            error={valueError && isEdited}
            helperText={valueError && isEdited ? 'Value must be a number' : ''}
          />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button 
              variant="outlined" 
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSubmit}
              color="primary"
              disabled={isSaveDisabled}
            >
              {employee ? 'Save Changes' : 'Add Employee'}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Modal>
  );
};

export default EmployeeModal;
