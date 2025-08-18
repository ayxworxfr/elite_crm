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
            initialValues={{
                ...values,
                expected_close_date: formatDate(values.expected_close_date),
                next_action_date: formatDate(values.next_action_date),
            }}
        >
            <ProFormText
                name="opportunity_id"
                label={intl.formatMessage({ id: 'pages.salesOpportunity.field.opportunityName' })}
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

            <ProFormDigit
                name="customer_id"
                label={intl.formatMessage({ id: 'pages.salesOpportunity.field.customerId' })}
                placeholder={intl.formatMessage({ id: 'pages.salesOpportunity.placeholder.customerId' })}
                rules={[
                    { required: true, message: intl.formatMessage({ id: 'pages.salesOpportunity.validation.customerIdRequired' }) },
                    { type: 'number', min: 1, message: intl.formatMessage({ id: 'pages.salesOpportunity.validation.customerIdMin' }) },
                ]}
            />

            <ProFormDigit
                name="owner_id"
                label={intl.formatMessage({ id: 'pages.salesOpportunity.field.ownerId' })}
                placeholder={intl.formatMessage({ id: 'pages.salesOpportunity.placeholder.ownerId' })}
                rules={[
                    { required: true, message: intl.formatMessage({ id: 'pages.salesOpportunity.validation.ownerIdRequired' }) },
                    { type: 'number', min: 1, message: intl.formatMessage({ id: 'pages.salesOpportunity.validation.ownerIdMin' }) },
                ]}
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
                    formatter: (value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                    parser: (value) => parseFloat(value!.replace(/\¥\s?|(,*)/g, '')) || 0,
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
                    formatter: (value) => `${value}%`,
                    parser: (value) => parseFloat(value!.replace('%', '')) || 0,
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
                label={intl.formatMessage({ id: 'pages.salesOpportunity.field.status' })}
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
                label={intl.formatMessage({ id: 'pages.salesOpportunity.field.description' })}
                placeholder={intl.formatMessage({ id: 'pages.salesOpportunity.placeholder.description' })}
                rules={[
                    { max: 1000, message: intl.formatMessage({ id: 'pages.salesOpportunity.validation.descriptionMax' }) },
                ]}
                fieldProps={{
                    rows: 4,
                }}
            />
        </ModalForm>
    );
};

export default UpdateForm;
