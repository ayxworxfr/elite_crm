import {
    ModalForm,
    ProFormSelect,
    ProFormText,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React from 'react';
import { getRoleList, getDepartmentList } from '@/services/ant-design-pro/api';

export type FormValueType = {
    id: number;
    username?: string;
    name?: string;
    password?: string;
    email?: string;
    phone?: string;
    department_id?: number;
    role_ids?: number[];
    status?: number;
} & Partial<API.User>;

export type UpdateFormProps = {
    open: boolean;
    onOpenChange: (visible: boolean) => void;
    onFinish: (values: FormValueType) => Promise<boolean>;
    values: Partial<API.User>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
    const { open, onOpenChange, onFinish, values } = props;
    const intl = useIntl();

    // 状态管理选中的值
    const [selectedDepartmentId, setSelectedDepartmentId] = React.useState<number | undefined>();
    const [selectedRoleIds, setSelectedRoleIds] = React.useState<number[]>([]);

    // 处理初始值，User类型是扁平结构
    const initialValues = React.useMemo(() => {
        if (!values || !values.id) return {};

        return {
            id: values.id,
            username: values.username,
            name: values.name,
            email: values.email,
            phone: values.phone,
            department_id: values.department_id,
            role_ids: values.roles?.map(role => role.id).filter(Boolean) || [],
            status: values.status,
        };
    }, [values]);

    // 表单关闭时重置选中状态
    React.useEffect(() => {
        if (!open) {
            setSelectedDepartmentId(undefined);
            setSelectedRoleIds([]);
        }
    }, [open]);

    return (
        <ModalForm
            title={intl.formatMessage({ id: 'pages.user.edit.title' })}
            width="600px"
            open={open}
            onOpenChange={onOpenChange}
            onFinish={onFinish}
            modalProps={{
                destroyOnHidden: true,
                maskClosable: false,
            }}
            initialValues={initialValues}
            preserve={false}
            key={values?.id || 'new'}
        >
            <ProFormText
                name="id"
                hidden
            />

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
                    autoComplete: 'name'
                }}
            />

            <ProFormText.Password
                name="password"
                label={intl.formatMessage({ id: 'pages.user.field.password' })}
                placeholder={intl.formatMessage({ id: 'pages.user.placeholder.password' })}
                rules={[
                    { min: 6, message: intl.formatMessage({ id: 'pages.user.validation.passwordMin' }) },
                ]}
                fieldProps={{
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
                        const options = (res.data || []).map((dept: API.Department) => ({
                            label: dept.department_name,
                            value: dept.department_id,
                        }));

                        // 如果是编辑模式且有department信息，确保当前部门在选项中
                        if (values?.department_name && values.department_id) {
                            const existingOption = options.find(opt => opt.value === values.department_id);
                            if (!existingOption) {
                                options.unshift({
                                    label: values.department_name,
                                    value: values.department_id,
                                });
                            }
                        }

                        // 在request函数内设置选中值
                        const departmentId = values?.department_id;
                        if (departmentId && selectedDepartmentId !== departmentId) {
                            setSelectedDepartmentId(departmentId);
                        }

                        return options;
                    } catch (error) {
                        console.warn('Department API not available');

                        // 在fallback中也要设置选中值
                        const departmentId = values?.department_id;
                        if (departmentId && selectedDepartmentId !== departmentId) {
                            setSelectedDepartmentId(departmentId);
                        }

                        // API失败时的fallback处理
                        if (values?.department_name && values.department_id) {
                            return [{
                                label: values.department_name,
                                value: values.department_id,
                            }];
                        }
                        if (values?.department_id) {
                            return [{
                                label: `Department ID: ${values.department_id}`,
                                value: values.department_id,
                            }];
                        }
                        return [];
                    }
                }}
                params={{
                    departmentId: values?.department_id
                }}
                showSearch
                fieldProps={{
                    optionFilterProp: 'label',
                    value: selectedDepartmentId,
                    onChange: (value) => setSelectedDepartmentId(value),
                }}
            />

            <ProFormSelect
                name="role_ids"
                label={intl.formatMessage({ id: 'pages.user.field.roles' })}
                placeholder={intl.formatMessage({ id: 'pages.user.placeholder.roles' })}
                rules={[
                    { required: true, message: intl.formatMessage({ id: 'pages.user.validation.rolesRequired' }) },
                ]}
                request={async () => {
                    try {
                        const res = await getRoleList({ current: 1, pageSize: 200 });
                        const options = (res.data || []).map((role: API.Role) => ({
                            label: role.name,
                            value: role.id,
                        }));

                        // 如果是编辑模式且有roles关联信息，确保当前角色在选项中
                        if (values?.roles && Array.isArray(values.roles)) {
                            values.roles.forEach(role => {
                                if (role.name && role.id) {
                                    const existingOption = options.find(opt => opt.value === role.id);
                                    if (!existingOption) {
                                        options.push({
                                            label: role.name,
                                            value: role.id,
                                        });
                                    }
                                }
                            });
                        }

                        // 在request函数内设置选中值（多选）
                        const roleIds = values?.roles?.map(role => role.id).filter((id): id is number => typeof id === 'number') || [];
                        if (roleIds.length > 0 && JSON.stringify(selectedRoleIds) !== JSON.stringify(roleIds)) {
                            setSelectedRoleIds(roleIds);
                        }

                        return options;
                    } catch (error) {
                        console.error('Failed to load roles');

                        // 在fallback中也要设置选中值
                        const roleIds = values?.roles?.map(role => role.id).filter((id): id is number => typeof id === 'number') || [];
                        if (roleIds.length > 0 && JSON.stringify(selectedRoleIds) !== JSON.stringify(roleIds)) {
                            setSelectedRoleIds(roleIds);
                        }

                        // API失败时的fallback处理
                        if (values?.roles && Array.isArray(values.roles)) {
                            return values.roles.map(role => ({
                                label: role.name || `Role ID: ${role.id}`,
                                value: role.id,
                            })).filter(opt => opt.value);
                        }
                        return [];
                    }
                }}
                params={{
                    roleIds: values?.roles?.map(role => role.id).filter((id): id is number => typeof id === 'number')
                }}
                fieldProps={{
                    mode: 'multiple',
                    value: selectedRoleIds,
                    onChange: (value) => setSelectedRoleIds(value || []),
                }}
                showSearch
            />

            <ProFormSelect
                name="status"
                label={intl.formatMessage({ id: 'common.field.status' })}
                placeholder={intl.formatMessage({ id: 'pages.user.placeholder.status' })}
                options={[
                    { label: intl.formatMessage({ id: 'common.status.disabled' }), value: 0 },
                    { label: intl.formatMessage({ id: 'common.status.enabled' }), value: 1 },
                ]}
                rules={[
                    { required: true, message: intl.formatMessage({ id: 'pages.user.validation.statusRequired' }) },
                ]}
            />
        </ModalForm>
    );
};

export default UpdateForm;
