import {
    createContract,
    getContractList,
    removeContract,
    updateContract,
    updateContractStatus,
} from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type {
    ActionType,
    ProColumns,
    ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import {
    FooterToolbar,
    ModalForm,
    PageContainer,
    ProDescriptions,
    ProFormDatePicker,
    ProFormDigit,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
    ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, message, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import ContractItems from './components/ContractItems';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';

const ContractList: React.FC = () => {
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [showItemModal, setShowItemModal] = useState<boolean>(false);
    const [currentContract, setCurrentContract] = useState<API.Contract>();

    const actionRef = useRef<ActionType | null>(null);
    const [currentRow, setCurrentRow] = useState<API.Contract>();
    const [selectedRowsState, setSelectedRows] = useState<API.Contract[]>([]);

    const intl = useIntl();

    // 合同状态选项
    const contractStatusOptions = [
        { label: intl.formatMessage({ id: 'pages.contract.status.draft' }), value: 0 },
        { label: intl.formatMessage({ id: 'pages.contract.status.approval' }), value: 1 },
        { label: intl.formatMessage({ id: 'pages.contract.status.signed' }), value: 2 },
        { label: intl.formatMessage({ id: 'pages.contract.status.terminated' }), value: 3 },
    ];

    // 合同类型选项
    const contractTypeOptions = [
        { label: intl.formatMessage({ id: 'pages.contract.type.sales' }), value: 'sales' },
        { label: intl.formatMessage({ id: 'pages.contract.type.purchase' }), value: 'purchase' },
        { label: intl.formatMessage({ id: 'pages.contract.type.service' }), value: 'service' },
        { label: intl.formatMessage({ id: 'pages.contract.type.lease' }), value: 'lease' },
    ];

    // 获取状态标签
    const getStatusTag = (status: number) => {
        const statusMap = {
            0: { color: 'default', text: intl.formatMessage({ id: 'pages.contract.status.draft' }) },
            1: { color: 'processing', text: intl.formatMessage({ id: 'pages.contract.status.approval' }) },
            2: { color: 'success', text: intl.formatMessage({ id: 'pages.contract.status.signed' }) },
            3: { color: 'error', text: intl.formatMessage({ id: 'pages.contract.status.terminated' }) },
        };
        const { color, text } = statusMap[status as keyof typeof statusMap] || statusMap[0];
        return <Tag color={color}>{text}</Tag>;
    };

    // 添加合同
    const handleAdd = async (fields: API.CreateContractRequest) => {
        const hide = message.loading(intl.formatMessage({ id: 'pages.contract.message.creating' }));
        try {
            await createContract({ ...fields, status: 0 }); // 默认草稿状态
            hide();
            message.success(intl.formatMessage({ id: 'pages.contract.message.createSuccess' }));
            return true;
        } catch (error) {
            hide();
            message.error(intl.formatMessage({ id: 'pages.contract.message.createFailed' }));
            return false;
        }
    };

    // 更新合同
    const handleUpdate = async (fields: FormValueType) => {
        const hide = message.loading(intl.formatMessage({ id: 'pages.contract.message.updating' }));
        try {
            await updateContract(fields);
            hide();
            message.success(intl.formatMessage({ id: 'pages.contract.message.updateSuccess' }));
            return true;
        } catch (error) {
            hide();
            message.error(intl.formatMessage({ id: 'pages.contract.message.updateFailed' }));
            return false;
        }
    };

    // 删除合同
    const handleRemove = async (selectedRows: API.Contract[]) => {
        const hide = message.loading(intl.formatMessage({ id: 'pages.contract.message.deleting' }));
        if (!selectedRows) return true;
        try {
            const ids = selectedRows.map((row) => row.contract_id);
            await removeContract({ ids });
            hide();
            message.success(intl.formatMessage({ id: 'pages.contract.message.deleteSuccess' }));
            return true;
        } catch (error) {
            hide();
            message.error(intl.formatMessage({ id: 'pages.contract.message.deleteFailed' }));
            return false;
        }
    };

    // 更新合同状态
    const handleStatusUpdate = async (contractId: number, newStatus: number) => {
        try {
            await updateContractStatus({ contract_id: contractId, status: newStatus });
            message.success(intl.formatMessage({ id: 'common.message.updateSuccess' }));
            actionRef.current?.reload();
        } catch (error) {
            message.error(intl.formatMessage({ id: 'common.message.updateFailed' }));
        }
    };

    // 表格列定义
    const columns: ProColumns<API.Contract>[] = [
        {
            title: intl.formatMessage({ id: 'pages.contract.field.contractNo' }),
            dataIndex: 'contract_no',
            tip: intl.formatMessage({ id: 'pages.contract.field.contractNo' }),
            render: (dom, entity) => {
                return (
                    <a
                        onClick={() => {
                            setCurrentRow(entity);
                            setShowDetail(true);
                        }}
                    >
                        {dom}
                    </a>
                );
            },
        },
        {
            title: intl.formatMessage({ id: 'pages.contract.field.contractName' }),
            dataIndex: 'contract_name',
            valueType: 'text',
        },
        {
            title: intl.formatMessage({ id: 'pages.contract.field.customerId' }),
            dataIndex: 'customer_id',
            hideInSearch: true,
        },
        {
            title: intl.formatMessage({ id: 'pages.contract.field.amount' }),
            dataIndex: 'amount',
            valueType: 'money',
            hideInSearch: true,
        },
        {
            title: intl.formatMessage({ id: 'pages.contract.field.startDate' }),
            dataIndex: 'start_date',
            valueType: 'date',
            hideInSearch: true,
        },
        {
            title: intl.formatMessage({ id: 'pages.contract.field.endDate' }),
            dataIndex: 'end_date',
            valueType: 'date',
            hideInSearch: true,
        },
        {
            title: intl.formatMessage({ id: 'common.field.status' }),
            dataIndex: 'status',
            valueType: 'select',
            valueEnum: {
                0: { text: intl.formatMessage({ id: 'pages.contract.status.draft' }), status: 'Default' },
                1: { text: intl.formatMessage({ id: 'pages.contract.status.approval' }), status: 'Processing' },
                2: { text: intl.formatMessage({ id: 'pages.contract.status.signed' }), status: 'Success' },
                3: { text: intl.formatMessage({ id: 'pages.contract.status.terminated' }), status: 'Error' },
            },
            render: (_, record) => getStatusTag(record.status),
        },
        {
            title: intl.formatMessage({ id: 'pages.contract.field.contractType' }),
            dataIndex: 'contract_type',
            valueType: 'select',
            valueEnum: {
                sales: { text: intl.formatMessage({ id: 'pages.contract.type.sales' }) },
                purchase: { text: intl.formatMessage({ id: 'pages.contract.type.purchase' }) },
                service: { text: intl.formatMessage({ id: 'pages.contract.type.service' }) },
                lease: { text: intl.formatMessage({ id: 'pages.contract.type.lease' }) },
            },
        },
        {
            title: intl.formatMessage({ id: 'common.field.createTime' }),
            dataIndex: 'create_time',
            valueType: 'dateTime',
            hideInSearch: true,
        },
        {
            title: intl.formatMessage({ id: 'common.action.actions' }),
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [
                <a
                    key="edit"
                    onClick={() => {
                        handleUpdateModalOpen(true);
                        setCurrentRow(record);
                    }}
                >
                    {intl.formatMessage({ id: 'common.action.edit' })}
                </a>,
                <a
                    key="items"
                    onClick={() => {
                        setCurrentContract(record);
                        setShowItemModal(true);
                    }}
                >
                    {intl.formatMessage({ id: 'pages.contract.items.title' })}
                </a>,
                <a
                    key="status"
                    onClick={() => {
                        const nextStatus = (record.status + 1) % 4;
                        handleStatusUpdate(record.contract_id, nextStatus);
                    }}
                >
                    {intl.formatMessage({ id: 'pages.contract.status.title' })}
                </a>,
            ],
        },
    ];

    return (
        <PageContainer>
            <ProTable<API.Contract>
                headerTitle={intl.formatMessage({ id: 'pages.contract.list.title' })}
                actionRef={actionRef}
                rowKey="contract_id"
                search={{
                    labelWidth: 120,
                }}
                toolBarRender={() => [
                    <Button
                        type="primary"
                        key="primary"
                        onClick={() => {
                            handleModalOpen(true);
                        }}
                    >
                        <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="新建" />
                    </Button>,
                ]}
                request={getContractList}
                columns={columns}
                rowSelection={{
                    onChange: (_, selectedRows) => {
                        setSelectedRows(selectedRows);
                    },
                }}
            />
            {selectedRowsState?.length > 0 && (
                <FooterToolbar
                    extra={
                        <div>
                            {intl.formatMessage({ id: 'common.count.selected' })} <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> {intl.formatMessage({ id: 'common.count.items' })}
                        </div>
                    }
                >
                    <Button
                        onClick={async () => {
                            await handleRemove(selectedRowsState);
                            setSelectedRows([]);
                            actionRef.current?.reloadAndRest?.();
                        }}
                    >
                        {intl.formatMessage({ id: 'common.action.batchDelete' })}
                    </Button>
                </FooterToolbar>
            )}

            {/* 创建合同弹窗 */}
            <ModalForm
                title={intl.formatMessage({ id: 'pages.contract.create.title' })}
                width="800px"
                open={createModalOpen}
                onOpenChange={handleModalOpen}
                onFinish={async (value) => {
                    const success = await handleAdd(value as API.CreateContractRequest);
                    if (success) {
                        handleModalOpen(false);
                        if (actionRef.current) {
                            actionRef.current.reload();
                        }
                    }
                    return success;
                }}
            >
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({ id: 'common.validation.required' }),
                        },
                    ]}
                    label={intl.formatMessage({ id: 'pages.contract.field.contractNo' })}
                    width="md"
                    name="contract_no"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({ id: 'common.validation.required' }),
                        },
                    ]}
                    label={intl.formatMessage({ id: 'pages.contract.field.contractName' })}
                    width="md"
                    name="contract_name"
                />
                <ProFormDigit
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({ id: 'common.validation.required' }),
                        },
                    ]}
                    label={intl.formatMessage({ id: 'pages.contract.field.customerId' })}
                    width="md"
                    name="customer_id"
                />
                <ProFormDigit
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({ id: 'common.validation.required' }),
                        },
                    ]}
                    label={intl.formatMessage({ id: 'pages.contract.field.amount' })}
                    width="md"
                    name="amount"
                    min={0}
                    fieldProps={{
                        precision: 2,
                    }}
                />
                <ProFormDatePicker
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({ id: 'common.validation.required' }),
                        },
                    ]}
                    label={intl.formatMessage({ id: 'pages.contract.field.startDate' })}
                    width="md"
                    name="start_date"
                />
                <ProFormDatePicker
                    label={intl.formatMessage({ id: 'pages.contract.field.endDate' })}
                    width="md"
                    name="end_date"
                />
                <ProFormSelect
                    label={intl.formatMessage({ id: 'pages.contract.field.contractType' })}
                    width="md"
                    name="contract_type"
                    options={contractTypeOptions}
                />
                <ProFormTextArea
                    label={intl.formatMessage({ id: 'pages.contract.field.paymentTerms' })}
                    width="md"
                    name="payment_terms"
                />
                <ProFormTextArea
                    label={intl.formatMessage({ id: 'common.field.description' })}
                    width="md"
                    name="description"
                />
            </ModalForm>

            {/* 更新合同弹窗 */}
            <UpdateForm
                open={updateModalOpen}
                onOpenChange={handleUpdateModalOpen}
                onFinish={async (value) => {
                    const success = await handleUpdate(value as FormValueType);
                    if (success) {
                        handleUpdateModalOpen(false);
                        setCurrentRow(undefined);
                        if (actionRef.current) {
                            actionRef.current.reload();
                        }
                    }
                    return success;
                }}
                values={currentRow || {}}
            />

            {/* 合同详情抽屉 */}
            <Drawer
                width={600}
                open={showDetail}
                onClose={() => {
                    setCurrentRow(undefined);
                    setShowDetail(false);
                }}
                closable={false}
            >
                {currentRow?.contract_name && (
                    <>
                        <ProDescriptions<API.Contract>
                            column={2}
                            title={currentRow?.contract_name}
                            request={async () => ({
                                data: currentRow || {},
                            })}
                            params={{
                                id: currentRow?.contract_id,
                            }}
                            columns={columns as ProDescriptionsItemProps<API.Contract>[]}
                        />
                    </>
                )}
            </Drawer>

            {/* 合同项目条目管理 */}
            <ContractItems
                contract={currentContract}
                open={showItemModal}
                onOpenChange={setShowItemModal}
            />
        </PageContainer>
    );
};

export default ContractList;
