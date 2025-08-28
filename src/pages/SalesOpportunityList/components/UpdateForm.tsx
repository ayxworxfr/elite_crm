import {
    ModalForm,
    ProFormDatePicker,
    ProFormDigit,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React from 'react';
import { getCustomerList, getUserList } from '@/services/ant-design-pro/api';

export type FormValueType = {
    opportunity_name: string;
    customer_id: number;
    owner_id: number;
    amount: number;
    probability: number;
    expected_close_date: string;
    status: number;
    stage: string;
} & Partial<API.SalesOpportunity>;

export type UpdateFormProps = {
    open: boolean;
    onOpenChange: (visible: boolean) => void;
    onFinish: (values: FormValueType) => Promise<boolean>;
    values: Partial<API.SalesOpportunity>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
    const { open, onOpenChange, onFinish, values } = props;
    const intl = useIntl();

    // 销售机会状态选项
    const statusOptions = [
        { value: 0, label: intl.formatMessage({ id: 'pages.salesOpportunity.status.initial' }) },
        { value: 1, label: intl.formatMessage({ id: 'pages.salesOpportunity.status.analysis' }) },
        { value: 2, label: intl.formatMessage({ id: 'pages.salesOpportunity.status.proposal' }) },
        { value: 3, label: intl.formatMessage({ id: 'pages.salesOpportunity.status.negotiate' }) },
        { value: 4, label: intl.formatMessage({ id: 'pages.salesOpportunity.status.won' }) },
        { value: 5, label: intl.formatMessage({ id: 'pages.salesOpportunity.status.lost' }) },
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

    // 格式化日期
    const formatDate = (dateString?: string) => {
        if (!dateString) return undefined;
        return dateString.split('T')[0]; // 只取日期部分
    };

    // 处理初始值，确保数据正确映射
    const initialValues = React.useMemo(() => {
        if (!values || !values.opportunity_id) return {};

        // 添加调试信息
        console.log('UpdateForm values:', values);
        console.log('Customer info:', values.customer);
        console.log('Owner info:', values.owner);

        return {
            opportunity_id: values.opportunity_id,
            opportunity_name: values.opportunity_name,
            customer_id: values.customer_id,
            owner_id: values.owner_id,
            // 确保金额为数值类型
            amount: values.amount ? Number(values.amount) : undefined,
            // 确保概率为数值类型
            probability: values.probability ? Number(values.probability) : undefined,
            expected_close_date: formatDate(values.expected_close_date),
            status: values.status,
            stage: values.stage,
            source_id: values.source_id,
            next_action: values.next_action,
            next_action_date: formatDate(values.next_action_date),
            description: values.description,
        };
    }, [values]);

    return (
        <ModalForm
            title={intl.formatMessage({ id: 'pages.salesOpportunity.edit.title' })}
            width="800px"
            open={open}
            onOpenChange={onOpenChange}
            onFinish={onFinish}
            modalProps={{
                destroyOnHidden: true,
                maskClosable: false,
            }}
            initialValues={initialValues}
            // 确保每次打开时都重新初始化
            preserve={false}
            // 当values变化时重置表单
            key={values?.opportunity_id || 'new'}
        >
            <ProFormText
                name="opportunity_id"
                hidden
            />

            <ProFormText
                name="opportunity_name"
                label={intl.formatMessage({ id: 'pages.salesOpportunity.field.opportunityName' })}
                placeholder={intl.formatMessage({ id: 'pages.salesOpportunity.placeholder.opportunityName' })}
                rules={[
                    { required: true, message: intl.formatMessage({ id: 'pages.salesOpportunity.validation.opportunityNameRequired' }) },
                    { max: 100, message: intl.formatMessage({ id: 'pages.salesOpportunity.validation.opportunityNameMax' }) },
                ]}
            />

            <ProFormSelect
                name="customer_id"
                label={intl.formatMessage({ id: 'pages.salesOpportunity.table.customer' })}
                placeholder={intl.formatMessage({ id: 'pages.salesOpportunity.placeholder.customer' })}
                rules={[
                    { required: true, message: intl.formatMessage({ id: 'pages.salesOpportunity.validation.customerIdRequired' }) },
                ]}
                request={async (params) => {
                    try {
                        const res = await getCustomerList({ current: 1, pageSize: 200 });
                        const options = (res.data || []).map((customer: API.Customer) => ({
                            label: customer.customer_name,
                            value: customer.customer_id,
                        }));

                        // 如果是编辑模式但没有完整的customer信息，尝试从options中找到对应的客户
                        if (values?.customer_id && !values?.customer) {
                            const currentCustomer = options.find(opt => opt.value === values.customer_id);
                            if (currentCustomer) {
                                console.log('Found customer in options:', currentCustomer);
                            }
                        }

                        // 如果是编辑模式且有customer关联信息，确保当前客户在选项中
                        if (values?.customer && values.customer_id) {
                            const existingOption = options.find(opt => opt.value === values.customer_id);
                            if (!existingOption) {
                                options.unshift({
                                    label: values.customer.customer_name,
                                    value: values.customer_id,
                                });
                            }
                        }

                        return options;
                    } catch (error) {
                        // 如果客户API不存在，使用fallback
                        console.warn('Customer API not available, using fallback');
                        if (values?.customer && values.customer_id) {
                            return [{
                                label: values.customer.customer_name,
                                value: values.customer_id,
                            }];
                        }
                        // 如果只有customer_id没有完整信息，至少显示ID
                        if (values?.customer_id) {
                            return [{
                                label: `Customer ID: ${values.customer_id}`,
                                value: values.customer_id,
                            }];
                        }
                        return [];
                    }
                }}
                params={{
                    // 传递当前值作为参数，确保request能感知到变化
                    customerId: values?.customer_id
                }}
                showSearch
                fieldProps={{
                    optionFilterProp: 'label',
                }}
            />

            <ProFormSelect
                name="owner_id"
                label={intl.formatMessage({ id: 'pages.salesOpportunity.table.owner' })}
                placeholder={intl.formatMessage({ id: 'pages.salesOpportunity.placeholder.owner' })}
                rules={[
                    { required: true, message: intl.formatMessage({ id: 'pages.salesOpportunity.validation.ownerIdRequired' }) },
                ]}
                request={async (params) => {
                    try {
                        const res = await getUserList({ current: 1, pageSize: 200 });
                        const options = (res.data || []).map((user: API.User) => ({
                            label: user.username,  // 优先使用name，如果没有则使用username
                            value: user.id,
                        }));

                        // 如果是编辑模式但没有完整的owner信息，尝试从options中找到对应的负责人
                        if (values?.owner_id && !values?.owner) {
                            const currentOwner = options.find(opt => opt.value === values.owner_id);
                            if (currentOwner) {
                                console.log('Found owner in options:', currentOwner);
                            }
                        }

                        // 如果是编辑模式且有owner关联信息，确保当前负责人在选项中
                        if (values?.owner && values.owner_id) {
                            const existingOption = options.find(opt => opt.value === values.owner_id);
                            if (!existingOption) {
                                options.unshift({
                                    label: values.owner.username,
                                    value: values.owner_id,
                                });
                            }
                        }

                        return options;
                    } catch (error) {
                        console.error('Failed to load users:', error);
                        // 如果API失败，但有当前负责人信息，至少显示当前的
                        if (values?.owner && values.owner_id) {
                            return [{
                                label: values.owner.username,
                                value: values.owner_id,
                            }];
                        }
                        // 如果只有owner_id没有完整信息，至少显示ID
                        if (values?.owner_id) {
                            return [{
                                label: `User ID: ${values.owner_id}`,
                                value: values.owner_id,
                            }];
                        }
                        return [];
                    }
                }}
                params={{
                    // 传递当前值作为参数，确保request能感知到变化
                    ownerId: values?.owner_id
                }}
                showSearch
                fieldProps={{
                    optionFilterProp: 'label',
                }}
            />

            <ProFormDigit
                name="amount"
                label={intl.formatMessage({ id: 'pages.salesOpportunity.field.amount' })}
                placeholder={intl.formatMessage({ id: 'pages.salesOpportunity.placeholder.amount' })}
                rules={[
                    { required: true, message: intl.formatMessage({ id: 'pages.salesOpportunity.validation.amountRequired' }) },
                    { type: 'number', min: 0.01, message: intl.formatMessage({ id: 'pages.salesOpportunity.validation.amountMin' }) },
                ]}
                fieldProps={{
                    precision: 2,
                    formatter: (value) => {
                        if (!value && value !== 0) return '';
                        return `¥ ${Number(value).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                    },
                    parser: (value) => {
                        if (!value) return 0;
                        return parseFloat(value.replace(/¥\s?|,/g, '')) || 0;
                    },
                }}
            />

            <ProFormDigit
                name="probability"
                label={intl.formatMessage({ id: 'pages.salesOpportunity.field.probability' })}
                placeholder={intl.formatMessage({ id: 'pages.salesOpportunity.placeholder.probability' })}
                rules={[
                    { required: true, message: intl.formatMessage({ id: 'pages.salesOpportunity.validation.probabilityRequired' }) },
                    { type: 'number', min: 0, max: 100, message: intl.formatMessage({ id: 'pages.salesOpportunity.validation.probabilityRange' }) },
                ]}
                fieldProps={{
                    precision: 2,
                    formatter: (value) => {
                        if (!value && value !== 0) return '';
                        return `${Number(value).toFixed(2)}%`;
                    },
                    parser: (value) => {
                        if (!value) return 0;
                        return parseFloat(value.replace('%', '')) || 0;
                    },
                }}
            />

            <ProFormDatePicker
                name="expected_close_date"
                label={intl.formatMessage({ id: 'pages.salesOpportunity.field.expectedCloseDate' })}
                placeholder={intl.formatMessage({ id: 'pages.salesOpportunity.placeholder.expectedCloseDate' })}
                rules={[
                    { required: true, message: intl.formatMessage({ id: 'pages.salesOpportunity.validation.expectedCloseDateRequired' }) },
                ]}
                fieldProps={{
                    disabledDate: (current: any) => current && current < new Date(),
                }}
            />

            <ProFormSelect
                name="status"
                label={intl.formatMessage({ id: 'common.field.status' })}
                placeholder={intl.formatMessage({ id: 'pages.salesOpportunity.placeholder.status' })}
                options={statusOptions}
                rules={[
                    { required: true, message: intl.formatMessage({ id: 'pages.salesOpportunity.validation.statusRequired' }) },
                ]}
            />

            <ProFormText
                name="stage"
                label={intl.formatMessage({ id: 'pages.salesOpportunity.field.stage' })}
                placeholder={intl.formatMessage({ id: 'pages.salesOpportunity.placeholder.stage' })}
                rules={[
                    { max: 20, message: intl.formatMessage({ id: 'pages.salesOpportunity.validation.stageMax' }) },
                ]}
            />

            <ProFormDigit
                name="source_id"
                label={intl.formatMessage({ id: 'pages.salesOpportunity.field.sourceId' })}
                placeholder={intl.formatMessage({ id: 'pages.salesOpportunity.placeholder.sourceId' })}
                rules={[
                    { type: 'number', min: 1, message: intl.formatMessage({ id: 'pages.salesOpportunity.validation.sourceIdMin' }) },
                ]}
            />

            <ProFormText
                name="next_action"
                label={intl.formatMessage({ id: 'pages.salesOpportunity.field.nextAction' })}
                placeholder={intl.formatMessage({ id: 'pages.salesOpportunity.placeholder.nextAction' })}
                rules={[
                    { max: 255, message: intl.formatMessage({ id: 'pages.salesOpportunity.validation.nextActionMax' }) },
                ]}
            />

            <ProFormDatePicker
                name="next_action_date"
                label={intl.formatMessage({ id: 'pages.salesOpportunity.field.nextActionDate' })}
                placeholder={intl.formatMessage({ id: 'pages.salesOpportunity.placeholder.nextActionDate' })}
                fieldProps={{
                    disabledDate: (current: any) => current && current < new Date(),
                }}
            />

            <ProFormTextArea
                name="description"
                label={intl.formatMessage({ id: 'common.field.description' })}
                placeholder={intl.formatMessage({ id: 'common.placeholder.description' })}
                rules={[
                    { max: 200, message: intl.formatMessage({ id: 'common.validation.descriptionMax' }) },
                ]}
                fieldProps={{
                    rows: 4,
                }}
            />
        </ModalForm>
    );
};

export default UpdateForm;
