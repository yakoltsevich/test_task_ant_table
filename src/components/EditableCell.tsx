import React from 'react';
import {Form, Input, InputNumber} from 'antd';
import MyDatePicker from "./DatePicker";
import {SelectInput} from "./SelectInput";
import {dateFormat} from "../constants";
import {Item} from "../Types";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text' | 'date' | 'select';
    record: Item;
    index: number;
    form: typeof Form;
    children: React.ReactNode;
}

export const EditableCell: React.FC<EditableCellProps> = ({
                                                              editing,
                                                              dataIndex,
                                                              title,
                                                              inputType,
                                                              record,
                                                              index,
                                                              children,
                                                              form,
                                                              ...restProps
                                                          }) => {
    const inputNode =
        inputType === 'number' ? <InputNumber min={0}/> :
            inputType === 'date' ? <MyDatePicker format={dateFormat}/> :
                inputType === 'select' ? <SelectInput/> :
                    <Input/>;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{margin: 0}}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (children)}
        </td>
    );
};



