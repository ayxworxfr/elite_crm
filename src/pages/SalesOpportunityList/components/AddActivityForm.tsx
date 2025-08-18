import {
    ModalForm,
    ProFormDatePicker,
    ProFormSelect,
    ProFormTextArea
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React from 'react';

export type AddActivityFormProps = {
    open: boolean;
    onOpenChange: (visible: boolean) => void;
    onFinish: (values: any) => Promise<boolean>;
    opportunityId?: number;
};

const AddActivityForm: React.FC<AddActivityFormProps> = (props) => {
    const { open, onOpenChange, onFinish, opportunityId } = props;
    const intl = useIntl();

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

    return (
        <ModalForm
            title={intl.formatMessage({ id: 'pages.salesOpportunity.activity.addTitle' })}
            width="600px"
            open={open}
            onOpenChange={onOpenChange}
            onFinish={onFinish}
            modalProps={{
                destroyOnHidden: true,
                maskClosable: false,
            }}
        >
            <ProFormSelect
                name="action_type"
                label={intl.formatMessage({ id: 'pages.salesOpportunity.activity.actionType' })}
                placeholder={intl.formatMessage({ id: 'pages.salesOpportunity.placeholder.actionType' })}
                options={actionTypeOptions}
                rules={[
                    { required: true, message: intl.formatMessage({ id: 'pages.salesOpportunity.validation.actionTypeRequired' }) },
                ]}
            />

            <ProFormDatePicker
                name="action_date"
                label={intl.formatMessage({ id: 'pages.salesOpportunity.activity.actionDate' })}
                placeholder={intl.formatMessage({ id: 'pages.salesOpportunity.placeholder.actionDate' })}
                rules={[
                    { required: true, message: intl.formatMessage({ id: 'pages.salesOpportunity.validation.actionDateRequired' }) },
                ]}
                initialValue={new Date()}
            />

            <ProFormTextArea
                name="description"
                label={intl.formatMessage({ id: 'pages.salesOpportunity.activity.description' })}
                placeholder={intl.formatMessage({ id: 'pages.salesOpportunity.placeholder.activityDescription' })}
                rules={[
                    { required: true, message: intl.formatMessage({ id: 'pages.salesOpportunity.validation.descriptionRequired' }) },
                    { max: 1000, message: intl.formatMessage({ id: 'pages.salesOpportunity.validation.descriptionMaxLength' }) },
                ]}
                fieldProps={{
                    rows: 6,
                }}
            />
        </ModalForm>
    );
};

export default AddActivityForm;
