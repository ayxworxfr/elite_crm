import {
    ModalForm,
    ProFormDatePicker,
    ProFormDigit,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React, { useEffect } from 'react';
import { getCustomerList, getUserList, getSalesOpportunityList } from '@/services/ant-design-pro/api';

export type FormValueType = {
    contract_id: number;
    contract_no?: string;
    contract_name?: string;
    customer_id?: number;
    opportunity_id?: number;
    owner_id?: number;
    amount?: number;
    start_date?: string;
    end_date?: string;
    status?: number;
    signing_date?: string;
    contract_type?: string;
    payment_terms?: string;
    description?: string;
    file_url?: string;
} & Partial<API.Contract>;

export type UpdateFormProps = {
    onFinish: (values: FormValueType) => Promise<boolean>;
    onOpenChange: (open: boolean) => void;
    open: boolean;
    values?: Partial<API.Contract>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
    const { open, onOpenChange, onFinish, values } = props;
    const intl = useIntl();

    // 状态管理选中的值，确保ProFormSelect能正确显示
    const [selectedCustomerId, setSelectedCustomerId] = React.useState<number | undefined>();
    const [selectedOwnerId, setSelectedOwnerId] = React.useState<number | undefined>();
    const [selectedOpportunityId, setSelectedOpportunityId] = React.useState<number | undefined>();

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

    // 格式化日期
    const formatDate = (dateString?: string) => {
        if (!dateString) return undefined;
        try {
            // 处理不同的日期格式
            const dateStr = dateString.includes('T') ? dateString.split('T')[0] : dateString;
            // 验证日期格式是否正确 (YYYY-MM-DD)
            if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                console.warn('Invalid date format:', dateString);
                return undefined;
            }
            return dateStr;
        } catch (error) {
            console.warn('Error formatting date:', dateString, error);
            return undefined;
        }
    };

    // 处理初始值，从嵌套对象中正确提取ID字段
    const initialValues = React.useMemo(() => {
        if (!values || !values.contract_id) return {};

        return {
            contract_id: values.contract_id,
            contract_no: values.contract_no,
            contract_name: values.contract_name,
            // 从嵌套对象中提取正确的ID字段
            customer_id: values.customer?.customer_id,
            opportunity_id: values.opportunity?.opportunity_id,
            owner_id: values.owner?.id,
            // 确保金额为数值类型
            amount: values.amount ? Number(values.amount) : undefined,
            start_date: formatDate(values.start_date),
            end_date: formatDate(values.end_date),
            status: values.status,
            signing_date: formatDate(values.signing_date),
            contract_type: values.contract_type,
            payment_terms: values.payment_terms,
            description: values.description,
            file_url: values.file_url,
        };
    }, [values]);

    // 表单关闭时重置选中状态
    React.useEffect(() => {
        if (!open) {
            setSelectedCustomerId(undefined);
            setSelectedOwnerId(undefined);
            setSelectedOpportunityId(undefined);
        }
    }, [open]);

    return (
        <ModalForm
            title={intl.formatMessage({ id: 'pages.contract.edit.title' })}
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
            key={values?.contract_id || 'new'}
        >
            <ProFormText
                name="contract_id"
                hidden
            />
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
            <ProFormSelect
                name="customer_id"
                label={intl.formatMessage({ id: 'pages.contract.field.customer' })}
                placeholder={intl.formatMessage({ id: 'pages.contract.placeholder.customer' })}
                rules={[
                    { required: true, message: intl.formatMessage({ id: 'pages.contract.validation.customerIdRequired' }) },
                ]}
                request={async (params) => {
                    try {
                        const res = await getCustomerList({ current: 1, pageSize: 200 });
                        const options = (res.data || []).map((customer: API.Customer) => ({
                            label: customer.customer_name,
                            value: customer.customer_id,
                        }));

                        // 如果是编辑模式且有customer关联信息，确保当前客户在选项中
                        if (values?.customer?.customer_name && values.customer?.customer_id) {
                            const existingOption = options.find(opt => opt.value === values?.customer?.customer_id);
                            if (!existingOption) {
                                options.unshift({
                                    label: values.customer.customer_name,
                                    value: values.customer.customer_id,
                                });
                            }
                        }

                        // 在request函数内设置选中值
                        const customerId = values?.customer?.customer_id;
                        if (customerId && selectedCustomerId !== customerId) {
                            setSelectedCustomerId(customerId);
                        }

                        return options;
                    } catch (error) {
                        console.warn('Customer API not available, using fallback');

                        // 在fallback中也要设置选中值
                        const customerId = values?.customer?.customer_id;
                        if (customerId && selectedCustomerId !== customerId) {
                            setSelectedCustomerId(customerId);
                        }

                        // API失败时的fallback处理
                        if (values?.customer?.customer_name && values.customer?.customer_id) {
                            return [{
                                label: values.customer.customer_name,
                                value: values.customer.customer_id,
                            }];
                        }
                        if (values?.customer?.customer_id) {
                            return [{
                                label: `Customer ID: ${values.customer.customer_id}`,
                                value: values.customer.customer_id,
                            }];
                        }
                        return [];
                    }
                }}
                params={{
                    customerId: values?.customer?.customer_id
                }}
                showSearch
                fieldProps={{
                    optionFilterProp: 'label',
                    value: selectedCustomerId,
                    onChange: (value) => setSelectedCustomerId(value),
                }}
            />
            <ProFormSelect
                name="opportunity_id"
                label={intl.formatMessage({ id: 'pages.contract.field.opportunity' })}
                placeholder={intl.formatMessage({ id: 'pages.contract.placeholder.opportunity' })}
                request={async (params) => {
                    try {
                        const res = await getSalesOpportunityList({ current: 1, pageSize: 200 });
                        const options = (res.data || []).map((opportunity: API.SalesOpportunity) => ({
                            label: opportunity.opportunity_name,
                            value: opportunity.opportunity_id,
                        }));

                        // 如果是编辑模式且有opportunity关联信息，确保当前销售机会在选项中
                        if (values?.opportunity?.opportunity_name && values.opportunity?.opportunity_id) {
                            const existingOption = options.find(opt => opt.value === values?.opportunity?.opportunity_id);
                            if (!existingOption) {
                                options.unshift({
                                    label: values.opportunity.opportunity_name,
                                    value: values.opportunity.opportunity_id,
                                });
                            }
                        }

                        // 在request函数内设置选中值
                        const opportunityId = values?.opportunity?.opportunity_id;
                        if (opportunityId && selectedOpportunityId !== opportunityId) {
                            setSelectedOpportunityId(opportunityId);
                        }

                        return options;
                    } catch (error) {
                        console.warn('SalesOpportunity API not available, using fallback');

                        // 在fallback中也要设置选中值
                        const opportunityId = values?.opportunity?.opportunity_id;
                        if (opportunityId && selectedOpportunityId !== opportunityId) {
                            setSelectedOpportunityId(opportunityId);
                        }

                        // API失败时的fallback处理
                        if (values?.opportunity?.opportunity_name && values.opportunity?.opportunity_id) {
                            return [{
                                label: values.opportunity.opportunity_name,
                                value: values.opportunity.opportunity_id,
                            }];
                        }
                        if (values?.opportunity?.opportunity_id) {
                            return [{
                                label: `Opportunity ID: ${values.opportunity.opportunity_id}`,
                                value: values.opportunity.opportunity_id,
                            }];
                        }
                        return [];
                    }
                }}
                params={{
                    opportunityId: values?.opportunity?.opportunity_id
                }}
                showSearch
                fieldProps={{
                    optionFilterProp: 'label',
                    value: selectedOpportunityId,
                    onChange: (value) => setSelectedOpportunityId(value),
                }}
            />
            <ProFormSelect
                name="owner_id"
                label={intl.formatMessage({ id: 'pages.contract.field.owner' })}
                placeholder={intl.formatMessage({ id: 'pages.contract.placeholder.owner' })}
                rules={[
                    { required: true, message: intl.formatMessage({ id: 'pages.contract.validation.ownerIdRequired' }) },
                ]}
                request={async (params) => {
                    try {
                        const res = await getUserList({ current: 1, pageSize: 200 });
                        const options = (res.data || []).map((user: API.User) => ({
                            label: user.name || user.username,
                            value: user.id,
                        }));

                        // 如果是编辑模式且有owner关联信息，确保当前负责人在选项中
                        if (values?.owner?.username && values.owner?.id) {
                            const existingOption = options.find(opt => opt.value === values?.owner?.id);
                            if (!existingOption) {
                                options.unshift({
                                    label: values.owner.username,
                                    value: values.owner.id,
                                });
                            }
                        }

                        // 在request函数内设置选中值
                        const ownerId = values?.owner?.id;
                        if (ownerId && selectedOwnerId !== ownerId) {
                            setSelectedOwnerId(ownerId);
                        }

                        return options;
                    } catch (error) {
                        console.error('Failed to load users:', error);

                        // 在fallback中也要设置选中值
                        const ownerId = values?.owner?.id;
                        if (ownerId && selectedOwnerId !== ownerId) {
                            setSelectedOwnerId(ownerId);
                        }

                        // API失败时的fallback处理
                        if (values?.owner?.username && values.owner?.id) {
                            return [{
                                label: values.owner.username,
                                value: values.owner.id,
                            }];
                        }
                        if (values?.owner?.id) {
                            return [{
                                label: `User ID: ${values.owner.id}`,
                                value: values.owner.id,
                            }];
                        }
                        return [];
                    }
                }}
                params={{
                    ownerId: values?.owner?.id
                }}
                showSearch
                fieldProps={{
                    optionFilterProp: 'label',
                    value: selectedOwnerId,
                    onChange: (value) => setSelectedOwnerId(value),
                }}
            />
            <ProFormDigit
                name="amount"
                label={intl.formatMessage({ id: 'pages.contract.field.amount' })}
                placeholder={intl.formatMessage({ id: 'pages.contract.placeholder.amount' })}
                rules={[
                    { required: true, message: intl.formatMessage({ id: 'pages.contract.validation.amountRequired' }) },
                    { type: 'number', min: 0.01, message: intl.formatMessage({ id: 'pages.contract.validation.amountMin' }) },
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
            <ProFormDatePicker
                name="start_date"
                label={intl.formatMessage({ id: 'pages.contract.field.startDate' })}
                placeholder={intl.formatMessage({ id: 'pages.contract.placeholder.startDate' })}
                rules={[
                    { required: true, message: intl.formatMessage({ id: 'pages.contract.validation.startDateRequired' }) },
                ]}
                width="md"
            />
            <ProFormDatePicker
                name="end_date"
                label={intl.formatMessage({ id: 'pages.contract.field.endDate' })}
                placeholder={intl.formatMessage({ id: 'pages.contract.placeholder.endDate' })}
                width="md"
                fieldProps={{
                    disabledDate: (current: any) => {
                        if (!values?.start_date) return false;
                        return current && current < new Date(values.start_date);
                    },
                }}
            />
            <ProFormSelect
                label={intl.formatMessage({ id: 'common.field.status' })}
                width="md"
                name="status"
                options={contractStatusOptions}
            />
            <ProFormDatePicker
                name="signing_date"
                label={intl.formatMessage({ id: 'pages.contract.field.signingDate' })}
                placeholder={intl.formatMessage({ id: 'pages.contract.placeholder.signingDate' })}
                width="md"
                fieldProps={{
                    // 签署日期不应该晚于今天，但可以是过去的任何日期
                    disabledDate: (current: any) => {
                        const today = new Date();
                        today.setHours(23, 59, 59, 999); // 设置为当天的最后一刻
                        return current && current > today;
                    },
                }}
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
            <ProFormText
                label={intl.formatMessage({ id: 'pages.contract.field.fileUrl' })}
                width="md"
                name="file_url"
            />
        </ModalForm>
    );
};

export default UpdateForm;
