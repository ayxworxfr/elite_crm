import { getRolePermissionList } from '@/services/ant-design-pro/api';
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

// 模拟权限数据，实际中应该从接口获取等方式得到
const permissionData = [
  { id: 1, name: '权限一' },
  { id: 2, name: '权限二' },
  { id: 3, name: '权限三' },
  { id: 4, name: '权限四' },
];

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  permissions?: number[];
} & Partial<API.Role>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<API.Role>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();


  // 用于存储从接口获取到的权限数据
  const [permissionData, setPermissionData] = React.useState<API.Permission[]>([]);

  // 用于标记权限数据是否正在加载
  const [loading, setLoading] = React.useState(false);

  // 在组件挂载时获取权限数据
  React.useEffect(() => {
    const fetchPermissionData = async () => {
      setLoading(true);
      try {
        const params = {
          pageSize: 100,
          current: 1,
          role_id: props.values.id,
          flags: 3,
        };
        const result = await getRolePermissionList(params);
        setPermissionData(Array.from(result)); // 转换为普通数组
      } catch (error) {
        console.error('获取权限数据失败', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPermissionData();
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
            id: 'pages.searchTable.updateForm.roleName.nameLabel',
            defaultMessage: '角色名称',
          })}
          width="md"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.updateForm.roleName.nameroles"
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
          target: '0',
          template: '0',
        }}
        title={intl.formatMessage({
          id: 'pages.searchTable.updateForm.roleProps.title',
          defaultMessage: '配置角色属性',
        })}
      >
        <ProFormSelect
          name="target"
          width="md"
          label={intl.formatMessage({
            id: 'pages.searchTable.updateForm.object',
            defaultMessage: '监控对象',
          })}
          valueEnum={{
            0: '表一',
            1: '表二',
          }}
        />
        <ProFormSelect
          name="template"
          width="md"
          label={intl.formatMessage({
            id: 'pages.searchTable.updateForm.roleProps.templateLabel',
            defaultMessage: '角色模板',
          })}
          valueEnum={{
            0: '角色模板一',
            1: '角色模板二',
          }}
        />
        <ProFormRadio.Group
          name="status"
          label={intl.formatMessage({
            id: 'pages.searchTable.updateForm.roleProps.statusLabel',
            defaultMessage: '角色状态',
          })}
          options={[
            {
              value: '1',
              label: '启用中',
            },
            {
              value: '2',
              label: '已禁用',
            },
          ]}
        />
        <ProFormSelect
            name="permissions"
            width="md"
            label={intl.formatMessage({
              id: 'pages.searchTable.updateForm.roleProps.permissionsLabel',
              defaultMessage: '权限列表',
            })}
            disabled={loading}
            request={async () => {
              return permissionData.map(({ id, name }) => ({ value: id, label: name }));
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
