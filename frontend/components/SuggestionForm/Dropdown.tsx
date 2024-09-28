import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, InputBase } from "@mui/material";

const departments = [
  { value: 'HR', label: 'HR' },
  { value: 'IT', label: 'IT' },
  { value: 'Safety', label: 'Safety' },
  { value: 'Quality', label: 'Quality' },
  { value: 'Production', label: 'Production' },
  { value: 'Environment', label: 'Environment' },
  { value: 'Management', label: 'Management' },
  { value: 'Other', label: 'Other' },
];

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 2,
    position: "relative",
    backgroundColor: "white",
    fontSize: 16,
    padding: "10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    border: "1px solid black",
  },
}));

interface DropdownProps {
  setCategory: (category: string) => void;
}

export default function Dropdown({ setCategory }: DropdownProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  const handleSelectChange = (event: SelectChangeEvent) => {
    const selectedValue = event.target.value;
    setSelectedDepartment(selectedValue);
    setCategory(selectedValue);  
  };

  return (
    <div>
      <label htmlFor="department" className="block text-m font-l">Select Department</label>
      <FormControl fullWidth sx={{ marginBottom: "20px", marginLeft: "0px", marginTop: "5px" }}>
        <Select
          labelId="select-department-label"
          id="select-department"
          value={selectedDepartment}
          label="Select Department"
          onChange={handleSelectChange}
          input={<BootstrapInput />}
          sx={{
            "& .MuiSelect-select": {
              color: "black",
            },
          }}
        >
          {departments.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}