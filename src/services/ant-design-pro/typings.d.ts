// @ts-ignore
/* eslint-disable */

declare namespace API {
  type APIResult<T> = {
    code: number;
    data: T;
    message: string;
  };

  type PageResult<T> = {
    code: number;
    data: {
      total: number;
      records: T[];
    };
    message: string;
  };

  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
    access_token?: string;
    refresh_token?: string
    expires_at?: number
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  type RolePageParams = {
    offset?: number;
    limit?: number;
    flag?: number;
    name?: string;
    code?: string;
  }

  type Role = {
    id?: number;
    name?: string;
    code?: string;
    description?: string;
    status?: number;
    create_time?: string;
    update_time?: string;
    permissions?: Permission[];
  }

  type Permission = {
    id?: number; 
    name?: string;
    code?: string; 
    description?: string;
    parent_id?: number;
    type?: number;
    path?: string;
    method?: string;
    status?: number;
    create_time?: string;
    update_time?: string;
  }

  type PermissionPageParams = {
    current?: number;
    pageSize?: number;
    keyword?: string;
    status?: number;
  }

  /** 用户 */
  type User = {
    id?: number;
    username: string;
    password?: string;
    email?: string;
    phone?: string;
    avatar_url?: string;
    department_id?: number;
    department_name?: string;
    roles?: Role[];
    role_ids?: number[];
    status?: number;
    create_time?: string;
    update_time?: string;
  }

  type UserPageParams = {
    current?: number;
    pageSize?: number;
    username?: string;
    email?: string;
    phone?: string;
    department_id?: number;
    role_id?: number;
    status?: number;
  }

  /** 销售机会相关类型定义 */
  
  /** 销售机会 */
  type SalesOpportunity = {
    opportunity_id?: number;
    opportunity_name: string;
    customer_id: number;
    customer?: Customer;
    owner_id: number;
    owner?: User;
    amount: number;
    probability: number;
    expected_close_date: string;
    status: number;
    stage: string;
    source_id?: number;
    source?: CustomerSource;
    next_action?: string;
    next_action_date?: string;
    description?: string;
    create_by?: number;
    create_by_user?: User;
    create_time?: string;
    update_time?: string;
    timeline?: OpportunityTimeline[];
  };

  /** 销售机会时间线 */
  type OpportunityTimeline = {
    timeline_id?: number;
    opportunity_id: number;
    opportunity_title?: string;
    customer_name?: string;
    action_type: string;
    action_type_display?: string;
    action_date: string;
    description: string;
    is_recent?: boolean;
    create_by?: number;
    create_by_user?: User;
    create_time?: string;
  };

  /** 客户 */
  type Customer = {
    customer_id?: number;
    customer_name: string;
    company?: string;
    phone?: string;
    email?: string;
    address?: string;
    status?: number;
    create_time?: string;
    update_time?: string;
  };

  /** 客户来源 */
  type CustomerSource = {
    source_id?: number;
    source_name: string;
    description?: string;
  };

  /** 销售机会状态 */
  type OpportunityStatus = {
    value: number;
    label: string;
    color: string;
  };

  /** 活动类型 */
  type ActionType = {
    value: string;
    label: string;
    icon: string;
  };

  /** 销售分析数据 */
  type SalesAnalytics = {
    funnel: FunnelData[];
    trend: TrendData[];
    ranking: RankingData[];
    summary: SummaryData;
  };

  /** 漏斗数据 */
  type FunnelData = {
    stage: string;
    count: number;
    amount: number;
    conversion_rate: number;
  };

  /** 趋势数据 */
  type TrendData = {
    date: string;
    opportunities: number;
    won_amount: number;
    conversion_rate: number;
  };

  /** 排行数据 */
  type RankingData = {
    rank: number;
    id: number;
    name: string;
    total_opportunities: number;
    total_amount: number;
    won_opportunities: number;
    won_amount: number;
    win_rate: number;
    average_amount: number;
  };

  /** 汇总数据 */
  type SummaryData = {
    total_opportunities: number;
    total_amount: number;
    won_opportunities: number;
    won_amount: number;
    active_opportunities: number;
    expected_revenue: number;
    conversion_rate: number;
  };

  /** 刷新Token响应结果 */
  export type RefreshTokenResult = {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
  };

  /** 合同模型 */
  export type Contract = {
    contract_id: number;
    contract_no: string;
    contract_name: string;
    customer_id: number;
    opportunity_id?: number;
    owner_id: number;
    amount: number;
    start_date: string;
    end_date?: string;
    status: number; // 0=草稿,1=审批中,2=已签署,3=已终止
    signing_date?: string;
    contract_type?: string;
    payment_terms?: string;
    description?: string;
    file_url?: string;
    create_by: number;
    create_time: string;
    update_time: string;
  };

  /** 合同项目条目模型 */
  export type ContractItem = {
    item_id: number;
    contract_id: number;
    product_id?: number;
    item_name: string;
    specification?: string;
    quantity: number;
    unit_price: number;
    discount: number;
    amount: number;
    description?: string;
    create_by: number;
    create_time: string;
    update_time: string;
  };

  /** 创建合同请求 */
  export type CreateContractRequest = {
    contract_no: string;
    contract_name: string;
    customer_id: number;
    opportunity_id?: number;
    owner_id: number;
    amount: number;
    start_date: string;
    end_date?: string;
    status?: number;
    signing_date?: string;
    contract_type?: string;
    payment_terms?: string;
    description?: string;
    file_url?: string;
  };

  /** 更新合同请求 */
  export type UpdateContractRequest = {
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
  };

  /** 合同列表查询请求 */
  export type GetContractListRequest = {
    current?: number;
    pageSize?: number;
    contract_no?: string;
    contract_name?: string;
    customer_id?: number;
    owner_id?: number;
    min_amount?: number;
    max_amount?: number;
    status?: number;
    contract_type?: string;
    start_start_date?: string;
    end_start_date?: string;
  };
}
