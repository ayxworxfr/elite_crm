import { addUser, getRoleList, getDepartmentList, getUserList, removeUser, updateUser } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { FooterToolbar, ModalForm, PageContainer, ProDescriptions, ProFormSelect, ProFormText, ProTable } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Button, Drawer, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';

const UserList: React.FC = () => {
    const intl = useIntl();
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [currentRow, setCurrentRow] = useState<API.User | undefined>();
    const [selectedRowsState, setSelectedRows] = useState<API.User[]>([]);
    const actionRef = useRef<ActionType | null>(null);

    const handleAdd = async (fields: API.User) => {
        const hide = message.loading(intl.formatMessage({ id: 'pages.user.message.adding' }));
        try {
            await addUser(fields);
            hide();
            message.success(intl.formatMessage({ id: 'pages.user.message.addSuccess' }));
            return true;
        } catch (e) {
            hide();
            message.error(intl.formatMessage({ id: 'pages.user.message.addFailed' }));
            return false;
        }
    };

    const handleUpdate = async (fields: FormValueType) => {
        const hide = message.loading(intl.formatMessage({ id: 'pages.user.message.updating' }));
        try {
            await updateUser({ ...fields, id: currentRow?.id } as API.User);
            hide();
            message.success(intl.formatMessage({ id: 'pages.user.message.updateSuccess' }));
            return true;
        } catch (e) {
            hide();
            message.error(intl.formatMessage({ id: 'pages.user.message.updateFailed' }));
            return false;
        }
    };

    const handleRemove = async (rows: API.User[]) => {
        const hide = message.loading(intl.formatMessage({ id: 'pages.user.message.deleting' }));
        try {
            await removeUser({ ids: rows.map((r) => r.id || 0) });
            hide();
            message.success(intl.formatMessage({ id: 'pages.user.message.deleteSuccess' }));
            return true;
        } catch (e) {
            hide();
            message.error(intl.formatMessage({ id: 'pages.user.message.deleteFailed' }));
            return false;
        }
    };

    const handleEdit = (record: API.User) => {
        setCurrentRow(record);
        setUpdateModalOpen(true);
    };

    const handleDelete = async (record: API.User) => {
        await handleRemove([record]);
        actionRef.current?.reload();
    };

    const columns: ProColumns<API.User>[] = [
        {
            title: intl.formatMessage({ id: 'pages.user.field.username' }),
            dataIndex: 'username',
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
            title: intl.formatMessage({ id: 'pages.user.field.name' }),
            dataIndex: 'name',
            render: (_, record) => {
                return record.name || record.username;
            },
        },
        {
            title: intl.formatMessage({ id: 'pages.user.field.email' }),
            dataIndex: 'email',
            ellipsis: true,
        },
        {
            title: intl.formatMessage({ id: 'pages.user.field.phone' }),
            dataIndex: 'phone',
        },
        {
            title: intl.formatMessage({ id: 'pages.user.field.department' }),
            dataIndex: 'department_name',
        },
        {
            title: intl.formatMessage({ id: 'pages.user.field.roles' }),
            dataIndex: 'roles',
            renderText: (_, record) => (record.roles || []).map((r) => r.name).join(', '),
            search: false,
        },
        {
            title: intl.formatMessage({ id: 'common.field.status' }),
            dataIndex: 'status',
            valueEnum: {
                0: { text: intl.formatMessage({ id: 'common.status.disabled' }), status: 'Default' },
                1: { text: intl.formatMessage({ id: 'common.status.enabled' }), status: 'Success' },
            },
        },
        {
            title: intl.formatMessage({ id: 'common.action.actions' }),
            valueType: 'option',
            render: (_, record) => [
                <Button
                    key="edit"
                    type="link"
                    size="small"
                    onClick={() => handleEdit(record)}
                >
                    {intl.formatMessage({ id: 'common.action.edit' })}
                </Button>,
                <Popconfirm
                    key="delete"
                    title={intl.formatMessage({ id: 'common.message.deleteConfirm' })}
                    onConfirm={() => handleDelete(record)}
                    okText={intl.formatMessage({ id: 'common.action.confirm' })}
                    cancelText={intl.formatMessage({ id: 'common.action.cancel' })}
                >
                    <Button type="link" size="small" danger>
                        {intl.formatMessage({ id: 'common.action.delete' })}
                    </Button>
                </Popconfirm>,
            ],
        },
    ];

    return (
        <PageContainer>
            <ProTable<API.User, API.UserPageParams>
                headerTitle={intl.formatMessage({ id: 'pages.user.list.title' })}
                actionRef={actionRef}
                rowKey="id"
                request={getUserList}
                columns={columns}
                rowSelection={{
                    onChange: (_, rows) => setSelectedRows(rows),
                }}
                toolBarRender={() => [
                    <Button type="primary" key="primary" onClick={() => { setCurrentRow(undefined); setCreateModalOpen(true); }}>
                        <PlusOutlined /> {intl.formatMessage({ id: 'pages.user.create.title' })}
                    </Button>
                ]}
            />

            {selectedRowsState?.length > 0 && (
                <FooterToolbar
                    extra={
                        <div>
                            {intl.formatMessage({ id: 'common.count.selected' })} <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> {intl.formatMessage({ id: 'common.count.items' })}
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

            <ModalForm<API.User>
                title={intl.formatMessage({ id: 'pages.user.create.title' })}
                width={520}
                open={createModalOpen}
                onOpenChange={(open) => { if (!open) { setCreateModalOpen(false); } }}
                initialValues={currentRow}
                modalProps={{ destroyOnHidden: true, maskClosable: false }}
                onFinish={async (value) => {
                    const success = await handleAdd(value);
                    if (success) {
                        setCreateModalOpen(false);
                        actionRef.current?.reload();
                    }
                    return success;
                }}
            >
                <ProFormText
                    name="username"
                    label={intl.formatMessage({ id: 'pages.user.field.username' })}
                    placeholder={intl.formatMessage({ id: 'pages.user.placeholder.username' })}
                    rules={[
                        { required: true, message: intl.formatMessage({ id: 'pages.user.validation.usernameRequired' }) },
                        { max: 50, message: intl.formatMessage({ id: 'pages.user.validation.usernameMax' }) },
                        { min: 3, message: intl.formatMessage({ id: 'pages.user.validation.usernameMin' }) },
                    ]}
                    fieldProps={{
                        id: 'create-username',
                        autoComplete: 'username'
                    }}
                />

                <ProFormText
                    name="name"
                    label={intl.formatMessage({ id: 'pages.user.field.name' })}
                    placeholder={intl.formatMessage({ id: 'pages.user.placeholder.name' })}
                    rules={[
                        { max: 50, message: intl.formatMessage({ id: 'pages.user.validation.nameMax' }) },
                    ]}
                    fieldProps={{
                        id: 'create-name',
                        autoComplete: 'name'
                    }}
                />

                <ProFormText.Password
                    name="password"
                    label={intl.formatMessage({ id: 'pages.user.field.password' })}
                    placeholder={intl.formatMessage({ id: 'pages.user.placeholder.password' })}
                    rules={[
                        { required: true, message: intl.formatMessage({ id: 'pages.user.validation.passwordRequired' }) },
                        { min: 6, message: intl.formatMessage({ id: 'pages.user.validation.passwordMin' }) },
                    ]}
                    fieldProps={{
                        id: 'create-password',
                        autoComplete: 'new-password'
                    }}
                />

                <ProFormText
                    name="email"
                    label={intl.formatMessage({ id: 'pages.user.field.email' })}
                    placeholder={intl.formatMessage({ id: 'pages.user.placeholder.email' })}
                    rules={[
                        { required: true, message: intl.formatMessage({ id: 'pages.user.validation.emailRequired' }) },
                        { type: 'email', message: intl.formatMessage({ id: 'pages.user.validation.emailFormat' }) },
                    ]}
                    fieldProps={{
                        id: 'create-email',
                        autoComplete: 'email'
                    }}
                />

                <ProFormText
                    name="phone"
                    label={intl.formatMessage({ id: 'pages.user.field.phone' })}
                    placeholder={intl.formatMessage({ id: 'pages.user.placeholder.phone' })}
                    rules={[
                        { pattern: /^1[3-9]\d{9}$/, message: intl.formatMessage({ id: 'pages.user.validation.phoneFormat' }) },
                    ]}
                    fieldProps={{
                        id: 'create-phone',
                        autoComplete: 'tel'
                    }}
                />

                <ProFormSelect
                    name="department_id"
                    label={intl.formatMessage({ id: 'pages.user.field.department' })}
                    placeholder={intl.formatMessage({ id: 'pages.user.placeholder.department' })}
                    request={async () => {
                        try {
                            const res = await getDepartmentList({ current: 1, pageSize: 200 });
                            return (res.data || []).map((dept: API.Department) => ({
                                label: dept.department_name,
                                value: dept.department_id,
                            }));
                        } catch (error) {
                            console.warn('Department API not available');
                            return [];
                        }
                    }}
                    showSearch
                    fieldProps={{
                        optionFilterProp: 'label',
                    }}
                />

                <ProFormSelect
                    name="role_ids"
                    label={intl.formatMessage({ id: 'pages.user.field.roles' })}
                    placeholder={intl.formatMessage({ id: 'pages.user.placeholder.roles' })}
                    rules={[{ required: true, message: intl.formatMessage({ id: 'pages.user.validation.rolesRequired' }) }]}
                    fieldProps={{
                        id: 'create-role-ids',
                        mode: 'multiple'
                    }}
                    request={async () => {
                        const res = await getRoleList({ current: 1, pageSize: 200 });
                        return (res.data || []).map((r: any) => ({ label: r.name, value: r.id }));
                    }}
                    showSearch
                />

                <ProFormSelect
                    name="status"
                    label={intl.formatMessage({ id: 'common.field.status' })}
                    placeholder={intl.formatMessage({ id: 'pages.user.placeholder.status' })}
                    initialValue={1}
                    options={[
                        { label: intl.formatMessage({ id: 'common.status.disabled' }), value: 0 },
                        { label: intl.formatMessage({ id: 'common.status.enabled' }), value: 1 },
                    ]}
                    rules={[
                        { required: true, message: intl.formatMessage({ id: 'pages.user.validation.statusRequired' }) },
                    ]}
                />
            </ModalForm>

            <UpdateForm
                open={updateModalOpen}
                onOpenChange={setUpdateModalOpen}
                onFinish={async (value) => {
                    const success = await handleUpdate(value);
                    if (success) {
                        setUpdateModalOpen(false);
                        setCurrentRow(undefined);
                        actionRef.current?.reload();
                    }
                    return success;
                }}
                values={currentRow || {}}
            />

            {/* 用户详情抽屉 */}
            <Drawer
                width={600}
                open={showDetail}
                onClose={() => {
                    setCurrentRow(undefined);
                    setShowDetail(false);
                }}
                closable={false}
            >
                {currentRow?.username && (
                    <>
                        <ProDescriptions<API.User>
                            column={2}
                            title={currentRow?.name || currentRow?.username}
                            request={async () => ({
                                data: currentRow || {},
                            })}
                            params={{
                                id: currentRow?.id,
                            }}
                            columns={columns as ProDescriptionsItemProps<API.User>[]}
                        />
                    </>
                )}
            </Drawer>
        </PageContainer>
    );
};

export default UserList;


