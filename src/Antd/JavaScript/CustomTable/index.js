import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Table, Space } from 'antd';

import CustomButton from '../CustomButton';

const CustomTable = ({ headers, items, getItemsNextToken, itemsLoading }) => {
    const [index, setIndex] = useState(1)
    const [loading, setLoading] = useState(false)

    const _headers = useMemo(() => headers.map(_ => {
        if (_ !== 'Acciones') {
            return ({ title: _, dataIndex: _.toLowerCase(), key: _.toLowerCase() })
        } else {
            return ({
                title: _,
                key: _.toLowerCase(),
                dataIndex: _.toLowerCase(),
                render: (btns) => (
                    <Space size="middle">
                        {
                            btns.map(_ => <CustomButton key={'table_btn_' + _.icon} {..._}></CustomButton>)
                        }
                    </Space>
                ),
            })
        }
    }), [headers]);

    const _items = useMemo(
        () => items.map(_ => ({ ..._, key: _.id })),
        [items]
    );

    const onChangeTable = async (e) => {
        setIndex(e.current);
        if (_items.length <= parseInt(e.pageSize) * parseInt(e.current) && getItemsNextToken !== undefined) {
            setLoading(true);
            await getItemsNextToken();
            setLoading(false);
        }
    }

    useEffect(() => {
        setLoading(itemsLoading)
    }, [itemsLoading]);

    return (
        <div style={{ marginTop: 20 }}>
            <Table
                columns={_headers}
                dataSource={_items}
                pagination={{ current: index, pageSize: 5 }}
                loading={loading}
                onChange={onChangeTable}
            />
        </div>
    )
}

CustomTable.propTypes = {
    items: PropTypes.array,
    headers: PropTypes.array,
    getItemsNextToken: PropTypes.func,
    itemsLoading: PropTypes.bool
}

export default React.memo(CustomTable);