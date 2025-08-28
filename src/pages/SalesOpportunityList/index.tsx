import {
    addOpportunityActivity,
    addSalesOpportunity,
    advanceOpportunityStage,
    getSalesOpportunityList,
    loseOpportunity,
    removeSalesOpportunity,
    updateSalesOpportunity
} from '@/services/ant-design-pro/api';
import { BarChartOutlined, PlusOutlined } from '@ant-design/icons';
import type {
    ActionType,
    ProColumns,
    ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import {
    FooterToolbar,
    PageContainer,
    ProDescriptions,
    ProTable
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, message, Progress, Tag, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import AddActivityForm from './components/AddActivityForm';
import CreateForm from './components/CreateForm';
import SalesAnalytics from './components/SalesAnalytics';
import StageAdvanceForm from './components/StageAdvanceForm';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';

// 销售机会状态配置 - 将在组件内部定义
// 活动类型选项 - 将在组件内部定义

// 这些函数将在组件内部定义

const SalesOpportunityList: React.FC = () => {
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
    const [addActivityModalOpen, handleAddActivityModalOpen] = useState<boolean>(false);
    const [stageAdvanceModalOpen, handleStageAdvanceModalOpen] = useState<boolean>(false);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [showAnalytics, setShowAnalytics] = useState<boolean>(false);
    const [currentRow, setCurrentRow] = useState<API.SalesOpportunity>();
    const [selectedRows, setSelectedRows] = useState<API.SalesOpportunity[]>([]);
    const actionRef = useRef<ActionType | null>(null);
    const intl = useIntl();

    // 销售机会状态配置
    const opportunityStatusOptions = [
        { value: 0, label: intl.formatMessage({ id: 'pages.salesOpportunity.status.initial' }), color: 'blue' },
        { value: 1, label: intl.formatMessage({ id: 'pages.salesOpportunity.status.analysis' }), color: 'cyan' },
        { value: 2, label: intl.formatMessage({ id: 'pages.salesOpportunity.status.proposal' }), color: 'orange' },
        { value: 3, label: intl.formatMessage({ id: 'pages.salesOpportunity.status.negotiate' }), color: 'purple' },
        { value: 4, label: intl.formatMessage({ id: 'pages.salesOpportunity.status.won' }), color: 'green' },
        { value: 5, label: intl.formatMessage({ id: 'pages.salesOpportunity.status.lost' }), color: 'red' },
    ];

    // 活动类型选项
    const actionTypeOptions = [
        { value: 'call', label: intl.formatMessage({ id: 'pages.salesOpportunity.actionType.call' }) },
        { value: 'email', label: intl.formatMessage({ id: 'pages.salesOpportunity.actionType.email' }) },
        { value: 'meeting', label: intl.formatMessage({ id: 'pages.salesOpportunity.actionType.meeting' }) },
        { value: 'visit', label: intl.formatMessage({ id: 'pages.salesOpportunity.actionType.visit' }) },
        { value: 'demo', label: intl.formatMessage({ id: 'pages.salesOpportunity.actionType.demo' }) },
        { value: 'proposal', label: intl.formatMessage({ id: 'pages.salesOpportunity.actionType.proposal' }) },
        { value: 'followUp', label: intl.formatMessage({ id: 'pages.salesOpportunity.actionType.followUp' }) },
        { value: 'note', label: intl.formatMessage({ id: 'pages.salesOpportunity.actionType.note' }) },
    ];

    // 处理函数
    const handleAdd = async (fields: API.SalesOpportunity) => {
        const hide = message.loading(intl.formatMessage({ id: 'common.message.adding' }));
        try {
            await addSalesOpportunity({ ...fields });
            hide();
            message.success(intl.formatMessage({ id: 'common.message.addSuccess' }));
            return true;
        } catch (error) {
            hide();
            message.error(intl.formatMessage({ id: 'common.message.addFailed' }));
            return false;
        }
    };

    const handleUpdate = async (fields: FormValueType) => {
        const hide = message.loading(intl.formatMessage({ id: 'common.message.updating' }));
        try {
            await updateSalesOpportunity(fields);
            hide();
            message.success(intl.formatMessage({ id: 'common.message.updateSuccess' }));
            return true;
        } catch (error) {
            hide();
            message.error(intl.formatMessage({ id: 'common.message.updateFailed' }));
            return false;
        }
    };

    const handleRemove = async (selectedRows: API.SalesOpportunity[]) => {
        const hide = message.loading(intl.formatMessage({ id: 'common.message.deleting' }));
        if (!selectedRows) return true;
        try {
            await removeSalesOpportunity({
                ids: selectedRows.map((row) => (row.opportunity_id ? row.opportunity_id : 0)),
            });
            hide();
            message.success(intl.formatMessage({ id: 'common.message.deleteSuccess' }));
            return true;
        } catch (error) {
            hide();
            message.error(intl.formatMessage({ id: 'common.message.deleteFailed' }));
            return false;
        }
    };

    const handleAdvanceStage = async (fields: { opportunity_id: number; new_status: number }) => {
        const hide = message.loading(intl.formatMessage({ id: 'common.message.updating' }));
        try {
            await advanceOpportunityStage(fields);
            hide();
            message.success(intl.formatMessage({ id: 'common.message.updateSuccess' }));
            return true;
        } catch (error) {
            hide();
            message.error(intl.formatMessage({ id: 'common.message.updateFailed' }));
            return false;
        }
    };

    const handleLoseOpportunity = async (fields: { opportunity_id: number; reason: string }) => {
        const hide = message.loading(intl.formatMessage({ id: 'pages.salesOpportunity.message.losing' }));
        try {
            await loseOpportunity(fields);
            hide();
            message.success(intl.formatMessage({ id: 'pages.salesOpportunity.message.loseSuccess' }));
            return true;
        } catch (error) {
            hide();
            message.error(intl.formatMessage({ id: 'pages.salesOpportunity.message.loseFailed' }));
            return false;
        }
    };

    const handleAddActivity = async (fields: { opportunity_id: number; action_type: string; description: string }) => {
        const hide = message.loading(intl.formatMessage({ id: 'common.message.adding' }));
        try {
            await addOpportunityActivity(fields);
            hide();
            message.success(intl.formatMessage({ id: 'common.message.addSuccess' }));
            return true;
        } catch (error) {
            hide();
            message.error(intl.formatMessage({ id: 'common.message.addFailed' }));
            return false;
        }
    };

    // 表格列定义
    const columns: ProColumns<API.SalesOpportunity>[] = [
        {
            title: intl.formatMessage({ id: 'pages.salesOpportunity.field.opportunityName' }),
            dataIndex: 'opportunity_name',
            tip: intl.formatMessage({ id: 'pages.salesOpportunity.field.opportunityName' }),
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
            title: intl.formatMessage({ id: 'pages.salesOpportunity.table.customer' }),
            dataIndex: ['customer', 'customer_name'],
            valueType: 'text',
            hideInSearch: true,
        },
        {
            title: intl.formatMessage({ id: 'pages.salesOpportunity.field.customerId' }),
            dataIndex: 'customer_id',
            hideInTable: true,
            hideInSearch: false,
        },
        {
            title: intl.formatMessage({ id: 'pages.salesOpportunity.table.owner' }),
            dataIndex: ['owner', 'username'],
            valueType: 'text',
            hideInSearch: true,
            render: (_, record) => {
                // 优先显示name，如果没有则显示username
                return record.owner ? (record.owner.username) : '-';
            },
        },
        {
            title: intl.formatMessage({ id: 'pages.salesOpportunity.field.ownerId' }),
            dataIndex: 'owner_id',
            hideInTable: true,
            hideInSearch: false,
        },
        {
            title: intl.formatMessage({ id: 'pages.salesOpportunity.field.amount' }),
            dataIndex: 'amount',
            valueType: 'money',
            render: (_, record) => (
                <span>¥{record.amount?.toLocaleString()}</span>
            ),
        },
        {
            title: intl.formatMessage({ id: 'pages.salesOpportunity.field.probability' }),
            dataIndex: 'probability',
            valueType: 'digit',
            render: (_, record) => (
                <Tooltip title={`${record.probability}%`}>
                    <Progress
                        percent={record.probability}
                        size="small"
                        status={record.probability >= 80 ? 'success' : record.probability >= 50 ? 'normal' : 'exception'}
                    />
                </Tooltip>
            ),
        },
        {
            title: intl.formatMessage({ id: 'pages.salesOpportunity.field.expectedCloseDate' }),
            dataIndex: 'expected_close_date',
            valueType: 'date',
            render: (_, record) => (
                <span>{record.expected_close_date}</span>
            ),
        },
        {
            title: intl.formatMessage({ id: 'common.field.status' }),
            dataIndex: 'status',
            valueType: 'select',
            valueEnum: {
                0: { text: intl.formatMessage({ id: 'pages.salesOpportunity.status.initial' }), status: 'Default' },
                1: { text: intl.formatMessage({ id: 'pages.salesOpportunity.status.analysis' }), status: 'Processing' },
                2: { text: intl.formatMessage({ id: 'pages.salesOpportunity.status.proposal' }), status: 'Warning' },
                3: { text: intl.formatMessage({ id: 'pages.salesOpportunity.status.negotiate' }), status: 'Processing' },
                4: { text: intl.formatMessage({ id: 'pages.salesOpportunity.status.won' }), status: 'Success' },
                5: { text: intl.formatMessage({ id: 'pages.salesOpportunity.status.lost' }), status: 'Error' },
            },
            render: (_, record) => {
                const status = opportunityStatusOptions.find(s => s.value === record.status);
                return status ? (
                    <Tag color={status.color}>{status.label}</Tag>
                ) : null;
            },
        },
        {
            title: intl.formatMessage({ id: 'pages.salesOpportunity.field.stage' }),
            dataIndex: 'stage',
            valueType: 'text',
        },
        {
            title: intl.formatMessage({ id: 'pages.salesOpportunity.table.source' }),
            dataIndex: ['source', 'source_name'],
            valueType: 'text',
            hideInSearch: true,
        },
        {
            title: intl.formatMessage({ id: 'pages.salesOpportunity.field.sourceId' }),
            dataIndex: 'source_id',
            hideInTable: true,
            hideInSearch: false,
        },
        {
            title: intl.formatMessage({ id: 'pages.salesOpportunity.field.nextAction' }),
            dataIndex: 'next_action',
            valueType: 'text',
            hideInSearch: true,
            ellipsis: true,
        },
        {
            title: intl.formatMessage({ id: 'pages.salesOpportunity.field.nextActionDate' }),
            dataIndex: 'next_action_date',
            valueType: 'date',
            hideInSearch: true,
        },
        {
            title: intl.formatMessage({ id: 'pages.salesOpportunity.table.createTime' }),
            dataIndex: 'create_time',
            valueType: 'dateTime',
            hideInSearch: true,
            hideInForm: true,
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
                    key="advance"
                    onClick={() => {
                        handleStageAdvanceModalOpen(true);
                        setCurrentRow(record);
                    }}
                >
                    {intl.formatMessage({ id: 'pages.salesOpportunity.action.advance' })}
                </a>,
                <a
                    key="activity"
                    onClick={() => {
                        handleAddActivityModalOpen(true);
                        setCurrentRow(record);
                    }}
                >
                    {intl.formatMessage({ id: 'pages.salesOpportunity.action.activity' })}
                </a>,
                <a
                    key="lose"
                    onClick={() => {
                        // 这里可以弹出一个确认框，让用户输入失败原因
                        const reason = prompt(intl.formatMessage({ id: 'pages.salesOpportunity.placeholder.failReason' }));
                        if (reason) {
                            handleLoseOpportunity({
                                opportunity_id: record.opportunity_id!,
                                reason: reason,
                            });
                        }
                    }}
                >
                    {intl.formatMessage({ id: 'pages.salesOpportunity.action.lose' })}
                </a>,
            ],
        },
    ];

    return (
        <PageContainer>
            <ProTable<API.SalesOpportunity>
                headerTitle={intl.formatMessage({ id: 'pages.salesOpportunity.list.title' })}
                actionRef={actionRef}
                rowKey="opportunity_id"
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
                    <Button
                        key="analytics"
                        onClick={() => {
                            setShowAnalytics(true);
                        }}
                    >
                        <BarChartOutlined /> {intl.formatMessage({ id: 'pages.salesOpportunity.action.analytics' })}
                    </Button>,
                ]}
                request={getSalesOpportunityList}
                columns={columns}
                rowSelection={{
                    onChange: (_, selectedRows) => {
                        setSelectedRows(selectedRows);
                    },
                }}
            />
            {selectedRows?.length > 0 && (
                <FooterToolbar
                    extra={
                        <div>
                            {intl.formatMessage({ id: 'common.count.selected' })} <a style={{ fontWeight: 600 }}>{selectedRows.length}</a> {intl.formatMessage({ id: 'common.count.items' })}
                        </div>
                    }
                >
                    <Button
                        onClick={async () => {
                            await handleRemove(selectedRows);
                            setSelectedRows([]);
                            actionRef.current?.reloadAndRest?.();
                        }}
                    >
                        {intl.formatMessage({ id: 'common.action.batchDelete' })}
                    </Button>
                </FooterToolbar>
            )}

            {/* 创建表单 */}
            <CreateForm
                open={createModalOpen}
                onOpenChange={handleModalOpen}
                onFinish={async (value) => {
                    const success = await handleAdd(value as API.SalesOpportunity);
                    if (success) {
                        handleModalOpen(false);
                        if (actionRef.current) {
                            actionRef.current.reload();
                        }
                    }
                    return success;
                }}
            />

            {/* 更新表单 */}
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

            {/* 添加活动表单 */}
            <AddActivityForm
                open={addActivityModalOpen}
                onOpenChange={handleAddActivityModalOpen}
                onFinish={async (value) => {
                    const success = await handleAddActivity({
                        opportunity_id: currentRow?.opportunity_id!,
                        action_type: value.action_type,
                        description: value.description,
                    });
                    if (success) {
                        handleAddActivityModalOpen(false);
                        setCurrentRow(undefined);
                        if (actionRef.current) {
                            actionRef.current.reload();
                        }
                    }
                    return success;
                }}
                opportunityId={currentRow?.opportunity_id}
            />

            {/* 阶段推进表单 */}
            <StageAdvanceForm
                open={stageAdvanceModalOpen}
                onOpenChange={handleStageAdvanceModalOpen}
                onFinish={async (value) => {
                    const success = await handleAdvanceStage({
                        opportunity_id: currentRow?.opportunity_id!,
                        new_status: value.new_status,
                    });
                    if (success) {
                        handleStageAdvanceModalOpen(false);
                        setCurrentRow(undefined);
                        if (actionRef.current) {
                            actionRef.current.reload();
                        }
                    }
                    return success;
                }}
                currentStatus={currentRow?.status}
            />

            {/* 详情抽屉 */}
            <Drawer
                width={600}
                open={showDetail}
                onClose={() => {
                    setCurrentRow(undefined);
                    setShowDetail(false);
                }}
                closable={false}
            >
                {currentRow?.opportunity_name && (
                    <>
                        <ProDescriptions<API.SalesOpportunity>
                            column={2}
                            title={currentRow?.opportunity_name}
                            request={async () => ({
                                data: currentRow || {},
                            })}
                            params={{
                                id: currentRow?.opportunity_id,
                            }}
                            columns={columns as ProDescriptionsItemProps<API.SalesOpportunity>[]}
                        />
                    </>
                )}
            </Drawer>

            {/* 销售分析抽屉 */}
            <Drawer
                width={800}
                open={showAnalytics}
                onClose={() => {
                    setShowAnalytics(false);
                }}
                closable={false}
            >
                <SalesAnalytics />
            </Drawer>
        </PageContainer>
    );
};

export default SalesOpportunityList;
