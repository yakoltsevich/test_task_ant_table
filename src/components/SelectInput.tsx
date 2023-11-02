import React from 'react';
import {Select} from 'antd';

interface SelectInputProps {
    value?: string,
    onChange?: () => void
}
export const SelectInput = ({value, onChange}: SelectInputProps) => (
    <Select
        onChange={onChange}
        value={value}
        options={[
            {value: 'income', label: 'Income'},
            {value: 'expense', label: 'Expense'},
        ]}
    />
);
