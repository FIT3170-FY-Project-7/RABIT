﻿import React, { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { FormLabel } from "@mui/material";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function CheckboxDropdown({ keys, setSelectedKeys }) {
	return (
		<>
			<Autocomplete
				fullWidth
				multiple
				options={keys}
				disableCloseOnSelect
				getOptionLabel={(option) => option.toString()}
				renderOption={(props, option, { selected }) => (
					<li {...props}>
						<Checkbox
							icon={icon}
							checkedIcon={checkedIcon}
							style={{ marginRight: 8 }}
							checked={selected}
						/>
						{option}
					</li>
				)}
				renderInput={(params) => <TextField {...params} label="Parameters" />}
				onChange={(_e, option) => setSelectedKeys(option)}
			/>
		</>
	);
}
