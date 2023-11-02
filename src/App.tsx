import React, {useEffect, useState} from 'react';
import {Form, Table, Button} from 'antd';
import moment, {Moment} from "moment";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import {ActionDropdown} from "./components/ActionDropdown";
import {Footer} from "./components/Footer";
import {EditableCell} from "./components/EditableCell";
import {cellInputType, dateFormat, localStorageTableKey, operationTypes} from "./constants";
import {Item} from "./Types";

const App: React.FC = () => {
    const [form] = Form.useForm();
    const [count, setCount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [tableData, setTableData] = useState<Item[]>([])
    const [editingRowKey, setEditingRowKey] = useState('');
    const [newRowKey, setNewRowKey] = useState('');

    useEffect(() => {
        const newData = JSON.parse(localStorage.getItem(localStorageTableKey) || '[]')
        setTableData(newData)
        setCount(newData.length)
        recalculateTotalAmount(newData)
    }, []);

    const isEditing = (row: Item) => row.key === editingRowKey || row.key === newRowKey;

    const cancelEdit = () => {
        if (newRowKey) {
            deleteRow(newRowKey)
        }
        setEditingRowKey('');
    };

    const addRow = () => {
        const newData: Item = {
            key: String(count),
            date: moment(new Date()),
            amount: 0,
            type: operationTypes.expense,
            note: ``,
        }
        setTableData([...tableData, newData]);
        setNewRowKey(String(count));
        editRow(newData)
        setCount(count + 1);
    };

    const deleteRow = (key: React.Key) => {
        const newData = [...tableData];

        const index = tableData.findIndex((item) => key === item.key);
        if (index > -1) {
            newData.splice(index, 1);
            setTableData(newData);
            setNewRowKey('')
            setEditingRowKey('');
            localStorage.setItem(localStorageTableKey, JSON.stringify(newData));
            recalculateTotalAmount(newData)
        } else {
            console.log('record does not exist')
        }
    };

    const editRow = (row: Item) => {
        row.date = moment(row.date)
        form.setFieldsValue(row);
        setEditingRowKey(row.key);
    };

    const saveEditing = async (key: React.Key) => {
        try {
            const row = (await form.validateFields()) as Item;
            const newData = [...tableData];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setTableData(newData);
            } else {
                newData.push(row);
                setTableData(newData);
            }
            localStorage.setItem(localStorageTableKey, JSON.stringify(newData));
            setNewRowKey('')
            setEditingRowKey('');
            recalculateTotalAmount(newData)
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const recalculateTotalAmount = (data: Item[]) => {
        let newAmount = 0
        data.forEach(el => {
            newAmount += (el.type === operationTypes.expense ? -el.amount : el.amount)
        })
        setTotalAmount(newAmount)
    }

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            editable: true,
            render: (date: string | Moment) => <div>{moment(date).format(dateFormat)}</div>,
            sorter: (a: { date: number; }, b: { date: number; }) => a.date.valueOf() - b.date.valueOf(),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            editable: true,
            sorter: (a: { amount: number; }, b: { amount: number; }) => a.amount - b.amount,
            render: (_: any, row: Item) => {
                return <div>{row.type === operationTypes.expense ? '-' : ''}{row.amount}$</div>
            },
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            editable: true,
        },
        {
            title: 'Note',
            dataIndex: 'note',
            key: 'note',
            editable: true,
        },
        {
            title: 'Action',
            key: 'action',
            dataIndex: 'action',
            render: (_: any, row: Item) => {
                return isEditing(row) ? (
                    <>
                        <Button type="text" icon={<CheckOutlined/>} onClick={() => saveEditing(row.key)}/>
                        <Button type="text" icon={<CloseOutlined/>} onClick={cancelEdit}/>
                    </>
                ) : (
                    <ActionDropdown
                        disabled={!!editingRowKey}
                        row={row}
                        editRow={editRow}
                        deleteRow={deleteRow}/>
                );
            },
        },
    ]

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: Item) => ({
                record,
                inputType: cellInputType[col.dataIndex as keyof typeof cellInputType],
                dataIndex: col.dataIndex,
                title: col.title,
                form: form,
                editing: isEditing(record),
            }),
        };
    });
    return (
        <div style={{padding: '50px'}}>
            <Button type="primary"
                    disabled={!!editingRowKey}
                    style={!!editingRowKey ? {} : {backgroundColor: 'black'}}
                    onClick={addRow}>Add new</Button>
            <br/>
            <br/>
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={tableData}
                    // @ts-ignore
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={false}
                    footer={() => <Footer total={totalAmount}/>}
                />
            </Form>
        </div>
    )
};

export default App;