import React from 'react';
import {MoreOutlined} from '@ant-design/icons';
import type {MenuProps} from 'antd';
import {Dropdown} from 'antd';
import {Item} from "../Types";

interface ActionDropdownProps {
    disabled: boolean,
    row: Item,
    editRow: (row: Item) => void,
    deleteRow: (key: string) => void
}
export const ActionDropdown = ({disabled, row, editRow, deleteRow}: ActionDropdownProps) => {
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <div onClick={() => editRow(row)}>Edit</div>
            ),
        },
        {
            key: '2',
            label: (
                <div onClick={() => deleteRow(row.key)}>Delete</div>
            ),
        },

    ];
    return (
        <Dropdown disabled={disabled} menu={{items}}>
            <MoreOutlined/>
        </Dropdown>
    )
};
