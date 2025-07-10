import {
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Modal } from 'antd';
import React from 'react';

export type FormValueType = {} & Partial<API.Permission>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<API.Permission>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();
  return (
    <StepsForm
      stepsProps={{
        size: 'small',
      }}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            width={640}
            styles={{
              body: {
                padding: '32px 40px 48px',
              },
            }}
            destroyOnHidden
            title={intl.formatMessage({
              id: 'pages.searchTable.updateForm.permissionConfig',
              defaultMessage: '权限配置',
            })}
            open={props.updateModalOpen}
            footer={submitter}
            onCancel={() => {
              props.onCancel();
            }}
          >
            {dom}
          </Modal>
        );
      }}
      onFinish={props.onSubmit}
    >
      <StepsForm.StepForm
        initialValues={{
          name: props.values.name,
          description: props.values.description,
        }}
        title={intl.formatMessage({
          id: 'pages.searchTable.updateForm.basicConfig',
          defaultMessage: '基本信息',
        })}
      >
        <ProFormText
          name="name"
          label={intl.formatMessage({
            id: 'pages.searchTable.updateForm.permissionName.nameLabel',
            defaultMessage: '权限名称',
          })}
          width="md"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.updateForm.permissionName.namepermissions"
                  defaultMessage="请输入权限名称！"
                />
              ),
            },
          ]}
        />
        <ProFormTextArea
          name="description"
          width="md"
          label={intl.formatMessage({
            id: 'pages.searchTable.updateForm.permissionDesc.descLabel',
            defaultMessage: '权限描述',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.searchTable.updateForm.permissionDesc.descPlaceholder',
            defaultMessage: '请输入至少五个字符',
          })}
          permissions={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.updateForm.permissionDesc.descpermissions"
                  defaultMessage="请输入至少五个字符的权限描述！"
                />
              ),
              min: 5,
            },
          ]}
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          method: props.values.method,
          parent_id: props.values.parent_id,
          type: props.values.type,
          path: props.values.path,
          status: props.values.status,
        }}
        title={intl.formatMessage({
          id: 'pages.searchTable.updateForm.permissionProps.title',
          defaultMessage: '配置权限属性',
        })}
      >
        <ProFormSelect
          name="method"
          width="md"
          label={intl.formatMessage({
            id: 'pages.searchTable.updateForm.permission.methodLabel',
            defaultMessage: '请求方法',
          })}
          valueEnum={{
            '*': '*',
            GET: 'GET',
            POST: 'POST',
            PUT: 'PUT',
            DELETE: 'DELETE',
          }}
        />
        <ProFormSelect
          name="template"
          width="md"
          label={intl.formatMessage({
            id: 'pages.searchTable.updateForm.permissionProps.templateLabel',
            defaultMessage: '权限模板',
          })}
          valueEnum={{
            0: '权限模板一',
            1: '权限模板二',
          }}
        />
        <ProFormRadio.Group
          name="status"
          label={intl.formatMessage({
            id: 'pages.searchTable.updateForm.permissionProps.statusLabel',
            defaultMessage: '权限状态',
          })}
          options={[
            {
              value: 0,
              label: '启用中',
            },
            {
              value: 1,
              label: '已禁用',
            },
          ]}
        />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateForm;
