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

    useEffect(() => {
        // 可以在这里处理表单初始化逻辑
    }, [values]);

    return (
        <ModalForm
            title={intl.formatMessage({ id: 'pages.contract.edit.title' })}
            width="800px"
            open={open}
            onOpenChange={onOpenChange}
            onFinish={onFinish}
            initialValues={values}
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
            <ProFormDigit
                label={intl.formatMessage({ id: 'pages.contract.field.customerId' })}
                width="md"
                name="customer_id"
            />
            <ProFormDigit
                label={intl.formatMessage({ id: 'pages.contract.field.opportunityId' })}
                width="md"
                name="opportunity_id"
            />
            <ProFormDigit
                label={intl.formatMessage({ id: 'pages.contract.field.ownerId' })}
                width="md"
                name="owner_id"
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
                label={intl.formatMessage({ id: 'common.field.status' })}
                width="md"
                name="status"
                options={contractStatusOptions}
            />
            <ProFormDatePicker
                label={intl.formatMessage({ id: 'pages.contract.field.signingDate' })}
                width="md"
                name="signing_date"
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
