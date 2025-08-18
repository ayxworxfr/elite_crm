import {
    createContractItem,
    getContractItemList,
    removeContractItem,
    updateContractItem,
} from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type {
    ActionType,
    ProColumns,
} from '@ant-design/pro-components';
import {
    ModalForm,
    ProFormDigit,
    ProFormText,
    ProFormTextArea,
    ProTable
} from '@ant-design/pro-components';
import { Button, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';

export type ContractItemsProps = {
    contract?: API.Contract;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const ContractItems: React.FC<ContractItemsProps> = ({ contract, open, onOpenChange }) => {
    const [createModalOpen, handleCreateModalOpen] = useState<boolean>(false);
    const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
    const [currentItem, setCurrentItem] = useState<API.ContractItem>();

    const actionRef = useRef<ActionType | null>(null);

    // 创建项目条目
    const handleAdd = async (fields: Omit<API.ContractItem, 'item_id' | 'create_time' | 'update_time'>) => {
        if (!contract) return false;

        const hide = message.loading('正在创建项目条目...');
        try {
            await createContractItem({
                ...fields,
                contract_id: contract.contract_id,
                create_by: 1, // 这里应该从用户上下文获取
            });
            hide();
            message.success('项目条目创建成功！');
            return true;
        } catch (error) {
            hide();
            message.error('项目条目创建失败，请重试！');
            return false;
        }
    };

    // 更新项目条目
    const handleUpdate = async (fields: Partial<API.ContractItem> & { item_id: number }) => {
        const hide = message.loading('正在更新项目条目...');
        try {
            await updateContractItem(fields);
            hide();
            message.success('项目条目更新成功！');
            return true;
        } catch (error) {
            hide();
            message.error('项目条目更新失败，请重试！');
            return false;
        }
    };

    // 删除项目条目
    const handleRemove = async (selectedRows: API.ContractItem[]) => {
        const hide = message.loading('正在删除项目条目...');
        if (!selectedRows) return true;
        try {
            const ids = selectedRows.map((row) => row.item_id);
            await removeContractItem({ ids });
            hide();
            message.success('项目条目删除成功！');
            return true;
        } catch (error) {
            hide();
            message.error('项目条目删除失败，请重试！');
            return false;
        }
    };

    // 表格列定义
    const columns: ProColumns<API.ContractItem>[] = [
        {
            title: '项目名称',
            dataIndex: 'item_name',
            tip: '项目条目的名称',
        },
        {
            title: '规格',
            dataIndex: 'specification',
            hideInSearch: true,
        },
        {
            title: '数量',
            dataIndex: 'quantity',
            valueType: 'digit',
            hideInSearch: true,
        },
        {
            title: '单价',
            dataIndex: 'unit_price',
            valueType: 'money',
            hideInSearch: true,
        },
        {
            title: '折扣',
            dataIndex: 'discount',
            valueType: 'digit',
            hideInSearch: true,
            render: (_, record) => `${record.discount}%`,
        },
        {
            title: '金额',
            dataIndex: 'amount',
            valueType: 'money',
            hideInSearch: true,
        },
        {
            title: '描述',
            dataIndex: 'description',
            hideInSearch: true,
            ellipsis: true,
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            valueType: 'dateTime',
            hideInSearch: true,
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [
                <a
                    key="edit"
                    onClick={() => {
                        setCurrentItem(record);
                        handleUpdateModalOpen(true);
                    }}
                >
                    编辑
                </a>,
            ],
        },
    ];

    if (!contract) {
        return null;
    }

    return (
        <Modal
            title={`合同项目条目 - ${contract.contract_name}`}
            open={open}
            onCancel={() => onOpenChange(false)}
            width={1200}
            footer={null}
            destroyOnClose
        >
            <div style={{ padding: '16px 0' }}>
                <ProTable<API.ContractItem>
                    headerTitle="项目条目列表"
                    actionRef={actionRef}
                    rowKey="item_id"
                    search={false}
                    toolBarRender={() => [
                        <Button
                            type="primary"
                            key="primary"
                            onClick={() => {
                                handleCreateModalOpen(true);
                            }}
                        >
                            <PlusOutlined /> 新建项目条目
                        </Button>,
                    ]}
                    request={async (params) => {
                        const requestParams = {
                            current: params.current,
                            pageSize: params.pageSize,
                            contract_id: contract.contract_id,
                        };
                        const result = await getContractItemList(requestParams);
                        return result;
                    }}
                    columns={columns}
                    rowSelection={{
                        onChange: (_, selectedRows) => {
                            // 处理批量操作
                        },
                    }}
                />
            </div>

            {/* 创建项目条目弹窗 */}
            <ModalForm
                title="创建项目条目"
                width="600px"
                open={createModalOpen}
                onOpenChange={handleCreateModalOpen}
                onFinish={async (value) => {
                    const success = await handleAdd(value as any);
                    if (success) {
                        handleCreateModalOpen(false);
                        if (actionRef.current) {
                            actionRef.current.reload();
                        }
                    }
                }}
            >
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '请输入项目名称',
                        },
                    ]}
                    label="项目名称"
                    width="md"
                    name="item_name"
                />
                <ProFormText
                    label="规格"
                    width="md"
                    name="specification"
                />
                <ProFormDigit
                    rules={[
                        {
                            required: true,
                            message: '请输入数量',
                        },
                    ]}
                    label="数量"
                    width="md"
                    name="quantity"
                    min={1}
                />
                <ProFormDigit
                    rules={[
                        {
                            required: true,
                            message: '请输入单价',
                        },
                    ]}
                    label="单价"
                    width="md"
                    name="unit_price"
                    min={0}
                    fieldProps={{
                        precision: 2,
                    }}
                />
                <ProFormDigit
                    label="折扣(%)"
                    width="md"
                    name="discount"
                    min={0}
                    max={100}
                    fieldProps={{
                        precision: 2,
                    }}
                />
                <ProFormTextArea
                    label="描述"
                    width="md"
                    name="description"
                />
            </ModalForm>

            {/* 更新项目条目弹窗 */}
            <ModalForm
                title="更新项目条目"
                width="600px"
                open={updateModalOpen}
                onOpenChange={handleUpdateModalOpen}
                onFinish={async (value) => {
                    const success = await handleUpdate(value as any);
                    if (success) {
                        handleUpdateModalOpen(false);
                        setCurrentItem(undefined);
                        if (actionRef.current) {
                            actionRef.current.reload();
                        }
                    }
                }}
                initialValues={currentItem}
            >
                <ProFormText
                    name="item_id"
                    hidden
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '请输入项目名称',
                        },
                    ]}
                    label="项目名称"
                    width="md"
                    name="item_name"
                />
                <ProFormText
                    label="规格"
                    width="md"
                    name="specification"
                />
                <ProFormDigit
                    rules={[
                        {
                            required: true,
                            message: '请输入数量',
                        },
                    ]}
                    label="数量"
                    width="md"
                    name="quantity"
                    min={1}
                />
                <ProFormDigit
                    rules={[
                        {
                            required: true,
                            message: '请输入单价',
                        },
                    ]}
                    label="单价"
                    width="md"
                    name="unit_price"
                    min={0}
                    fieldProps={{
                        precision: 2,
                    }}
                />
                <ProFormDigit
                    label="折扣(%)"
                    width="md"
                    name="discount"
                    min={0}
                    max={100}
                    fieldProps={{
                        precision: 2,
                    }}
                />
                <ProFormTextArea
                    label="描述"
                    width="md"
                    name="description"
                />
            </ModalForm>
        </Modal>
    );
};

export default ContractItems;
