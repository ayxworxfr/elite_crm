import {
    ModalForm,
    ProFormSelect,
    ProFormTextArea,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React from 'react';

export type StageAdvanceFormProps = {
    open: boolean;
    onOpenChange: (visible: boolean) => void;
    onFinish: (values: any) => Promise<boolean>;
    currentStatus?: number;
};

const StageAdvanceForm: React.FC<StageAdvanceFormProps> = (props) => {
    const { open, onOpenChange, onFinish, currentStatus } = props;
    const intl = useIntl();

    // 获取可推进的状态选项
    const getAdvanceableStatusOptions = () => {
        const allStatusOptions = [
            { value: 0, label: intl.formatMessage({ id: 'pages.salesOpportunity.status.initial' }) },
            { value: 1, label: intl.formatMessage({ id: 'pages.salesOpportunity.status.analysis' }) },
            { value: 2, label: intl.formatMessage({ id: 'pages.salesOpportunity.status.proposal' }) },
            { value: 3, label: intl.formatMessage({ id: 'pages.salesOpportunity.status.negotiate' }) },
            { value: 4, label: intl.formatMessage({ id: 'pages.salesOpportunity.status.won' }) },
            { value: 5, label: intl.formatMessage({ id: 'pages.salesOpportunity.status.lost' }) },
        ];

        // 根据当前状态过滤可推进的状态
        if (currentStatus === undefined) return allStatusOptions;

        // 如果当前是失败状态，可以重新激活
        if (currentStatus === 5) {
            return [
                { value: 0, label: intl.formatMessage({ id: 'pages.salesOpportunity.stageAdvance.reactivate' }) },
            ];
        }

        // 如果已经成交，不能再推进
        if (currentStatus === 4) {
            return [
                { value: 5, label: intl.formatMessage({ id: 'pages.salesOpportunity.status.lost' }) },
            ];
        }

        // 正常推进流程
        const nextStatus = currentStatus + 1;
        if (nextStatus <= 4) {
            return [
                { value: nextStatus, label: allStatusOptions[nextStatus].label },
                { value: 5, label: intl.formatMessage({ id: 'pages.salesOpportunity.status.lost' }) },
            ];
        }

        return [];
    };

    const statusOptions = getAdvanceableStatusOptions();

    return (
        <ModalForm
            title={intl.formatMessage({ id: 'pages.salesOpportunity.stageAdvance.title' })}
            width="500px"
            open={open}
            onOpenChange={onOpenChange}
            onFinish={onFinish}
            modalProps={{
                destroyOnHidden: true,
                maskClosable: false,
            }}
        >
            <ProFormSelect
                name="new_status"
                label={intl.formatMessage({ id: 'pages.salesOpportunity.stageAdvance.newStatus' })}
                placeholder={intl.formatMessage({ id: 'pages.salesOpportunity.placeholder.newStatus' })}
                options={statusOptions}
                rules={[
                    { required: true, message: intl.formatMessage({ id: 'pages.salesOpportunity.validation.newStatusRequired' }) },
                ]}
                help={intl.formatMessage({ id: 'pages.salesOpportunity.stageAdvance.help' })}
            />

            <ProFormTextArea
                name="reason"
                label={intl.formatMessage({ id: 'pages.salesOpportunity.stageAdvance.reason' })}
                placeholder={intl.formatMessage({ id: 'pages.salesOpportunity.placeholder.advanceReason' })}
                rules={[
                    { max: 500, message: intl.formatMessage({ id: 'pages.salesOpportunity.validation.reasonMaxLength' }) },
                ]}
                fieldProps={{
                    rows: 4,
                }}
            />
        </ModalForm>
    );
};

export default StageAdvanceForm;
