import React from 'react';
import {Flex} from 'antd';

export const Footer = ({total}: { total: number }) => {
    return (
        <Flex justify={"space-between"}>
            <div>Total</div>
            <div>{total}</div>
        </Flex>
    )
};
