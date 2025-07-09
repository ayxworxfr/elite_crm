import { getPermissionList, getRolePermissionList } from '@/services/ant-design-pro/api';
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

export type FormValueType = {
  permission_ids?: number[];
} & Partial<API.Role>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<API.Role>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();

  // 用于标记权限数据是否正在加载
  const [loading, setLoading] = React.useState(false);
  // 用于存储从接口获取到的权限数据
  const [permissionData, setPermissionData] = React.useState<API.Permission[]>([]);
  const [allPermissions, setAllPermissions] = React.useState<API.Permission[]>([]);

  // 在组件挂载时获取权限数据
  React.useEffect(() => {
    const fetchAllPermissions = async () => {
      setLoading(true);
      try {
        const params = {
          pageSize: 1000,
          current: 1,
        };
        const result = await getPermissionList(params);
        setAllPermissions(result.data || []);
      } catch (error) {
        console.error('获取权限列表失败', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllPermissions();
  }, []);

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
              id: 'pages.searchTable.updateForm.roleConfig',
              defaultMessage: '角色配置',
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
          code: props.values.code,
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
            id: 'pages.searchTable.updateForm.role.nameLabel',
            defaultMessage: '角色名称',
          })}
          width="md"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.updateForm.role.namePlaceholder"
                  defaultMessage="请输入角色名称！"
                />
              ),
            },
          ]}
        />
        <ProFormText
          name="code"
          label={intl.formatMessage({
            id: 'pages.searchTable.updateForm.role.codeLabel',
            defaultMessage: '角色编码',
          })}
          width="md"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.updateForm.role.codePlaceholder"
                  defaultMessage="请输入角色名称！"
                />
              ),
            },
          ]}
        />
        <ProFormTextArea
          name="description"
          width="md"
          label={intl.formatMessage({
            id: 'pages.searchTable.updateForm.roleDesc.descLabel',
            defaultMessage: '角色描述',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.searchTable.updateForm.roleDesc.descPlaceholder',
            defaultMessage: '请输入至少五个字符',
          })}
          roles={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.updateForm.roleDesc.descroles"
                  defaultMessage="请输入至少五个字符的角色描述！"
                />
              ),
              min: 5,
            },
          ]}
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          status: props.values.status,
          permission_ids: props.values.permissions?.map((permission) => permission.id) || [],
        }}
        title={intl.formatMessage({
          id: 'pages.searchTable.updateForm.roleProps.title',
          defaultMessage: '配置角色属性',
        })}
      >
        <ProFormRadio.Group
          name="status"
          label={intl.formatMessage({
            id: 'pages.searchTable.updateForm.roleProps.statusLabel',
            defaultMessage: '角色状态',
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
        <ProFormSelect
            name="permission_ids"
            width="md"
            label={intl.formatMessage({
              id: 'pages.searchTable.updateForm.roleProps.permissionsLabel',
              defaultMessage: '权限列表',
            })}
            disabled={loading}
            request={async () => {
              setLoading(true);
              try {
                const params = {
                  pageSize: 1000,
                  current: 1,
                  role_id: props.values.id,
                };
                // 已经选择的列表
                const result = await getRolePermissionList(params);
                setPermissionData(result);
                // 修改permission_ids
                const ids = result.map((permission) => permission.id);

              } catch (error) {
                console.error('获取权限数据失败', error);
              } finally {
                setLoading(false);
              }
              return allPermissions.map(({ id, name }) => ({ value: id, label: name }));
            }}
            mode="multiple" // 设置为多选模式
            placeholder={intl.formatMessage({
              id: 'pages.searchTable.updateForm.roleProps.permissionsPlaceholder',
              defaultMessage: '请选择权限',
            })}
            rules={[
              {
                required: true,
                message: (intl.formatMessage({
                    id: 'pages.searchTable.updateForm.roleProps.permissionsRequired',
                    defaultMessage: '请至少选择一项权限！',
                  })
                ),
              },
            ]}
          />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateForm;
