import { PlusOutlined } from '@ant-design/icons';
import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, Input, message } from 'antd';
import React, { useRef, useState } from 'react';
import {
  addRole,
  getRoleList,
  removeRole,
  updateRole,
} from '@/services/ant-design-pro/api';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';

const RoleList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType | null>(null);
  const [currentRow, setCurrentRow] = useState<API.Role>();
  const [selectedRowsState, setSelectedRows] = useState<API.Role[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  /**
   * @en-US Add node
   * @zh-CN 添加节点
   * @param fields
   */
  const handleAdd = async (fields: API.Role) => {
    const hide = message.loading(intl.formatMessage({ id: 'common.message.adding' }));
    try {
      await addRole({ ...fields });
      hide();
      message.success(intl.formatMessage({ id: 'common.message.addSuccess' }));
      return true;
    } catch (error) {
      hide();
      message.error(intl.formatMessage({ id: 'common.message.addFailed' }));
      return false;
    }
  };

  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param fields
   */
  const handleUpdate = async (fields: FormValueType) => {
    const hide = message.loading(intl.formatMessage({ id: 'common.message.updating' }));
    try {
      await updateRole(fields);
      hide();

      message.success(intl.formatMessage({ id: 'common.message.updateSuccess' }));
      return true;
    } catch (error) {
      hide();
      message.error(intl.formatMessage({ id: 'common.message.updateFailed' }));
      return false;
    }
  };

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param selectedRows
   */
  const handleRemove = async (selectedRows: API.Role[]) => {
    const hide = message.loading(intl.formatMessage({ id: 'common.message.deleting' }));
    if (!selectedRows) return true;
    try {
      await removeRole({
        ids: selectedRows.map((row) => (row.id ? row.id : 0)),
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

  const columns: ProColumns<API.Role>[] = [
    {
      title: intl.formatMessage({ id: 'common.field.name' }),
      dataIndex: 'name',
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
      title: intl.formatMessage({ id: 'common.field.code' }),
      dataIndex: 'code',
      valueType: 'textarea',
    },
    {
      title: intl.formatMessage({ id: 'common.field.description' }),
      dataIndex: 'description',
      valueType: 'textarea',
    },
    {
      title: intl.formatMessage({ id: 'common.field.status' }),
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: { text: intl.formatMessage({ id: 'common.status.disabled' }), status: 'Default' },
        1: { text: intl.formatMessage({ id: 'common.status.enabled' }), status: 'Success' },
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.searchTable.titleUpdatedAt' }),
      sorter: true,
      dataIndex: 'update_time',
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '3') {
          return (
            <Input
              {...rest}
              placeholder={intl.formatMessage({
                id: 'pages.searchTable.exception',
              })}
            />
          );
        }
        return defaultRender(item);
      },
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
        <a key="delete" onClick={() => handleRemove([record])}>
          {intl.formatMessage({ id: 'common.action.delete' })}
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.Role, API.PageParams>
        headerTitle={intl.formatMessage({ id: 'pages.role.list.title' })}
        actionRef={actionRef}
        rowKey="id"
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
            <PlusOutlined />{' '}
            {intl.formatMessage({ id: 'pages.role.create.title' })}
          </Button>,
        ]}
        request={getRoleList}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage
                id="pages.searchTable.chosen"
                defaultMessage="Chosen"
              />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage
                id="pages.searchTable.item"
                defaultMessage="项"
              />
              &nbsp;&nbsp;
              <span>
                {intl.formatMessage({ id: 'common.count.selected' })} {selectedRowsState.length} {intl.formatMessage({ id: 'common.count.items' })}
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            {intl.formatMessage({ id: 'common.action.batchDelete' })}
          </Button>
        </FooterToolbar>
      )}
      <ModalForm
        title={intl.formatMessage({ id: 'pages.role.create.title' })}
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.Role);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          label={intl.formatMessage({ id: 'common.field.name' })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'common.validation.nameRequired' }),
            },
            {
              max: 50,
              message: intl.formatMessage({ id: 'common.validation.nameMax' }),
            },
          ]}
          width="md"
          name="name"
          placeholder={intl.formatMessage({ id: 'common.placeholder.name' })}
        />
        <ProFormText
          label={intl.formatMessage({ id: 'common.field.code' })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'common.validation.codeRequired' }),
            },
            {
              max: 50,
              message: intl.formatMessage({ id: 'common.validation.codeMax' }),
            },
          ]}
          width="md"
          name="code"
          placeholder={intl.formatMessage({ id: 'common.placeholder.code' })}
        />
        <ProFormTextArea
          label={intl.formatMessage({ id: 'common.field.description' })}
          width="md"
          name="description"
          placeholder={intl.formatMessage({ id: 'common.placeholder.description' })}
          rules={[
            {
              max: 200,
              message: intl.formatMessage({ id: 'common.validation.descriptionMax' }),
            },
          ]}
        />
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          value.id = currentRow?.id;
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalOpen={updateModalOpen}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.Role>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.Role>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default RoleList;
