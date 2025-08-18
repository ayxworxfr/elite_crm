import { getSalesAnalytics } from '@/services/ant-design-pro/api';
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Button, Card, Col, DatePicker, Row, Select, Space, Statistic, message } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

const { RangePicker } = DatePicker;
const { Option } = Select;

const SalesAnalytics: React.FC = () => {
    const intl = useIntl();
    const [loading, setLoading] = useState(false);
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [dateRange, setDateRange] = useState<[string, string]>([
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        new Date().toISOString().split('T')[0],
    ]);
    const [groupBy, setGroupBy] = useState<string>('month');

    // 获取分析数据
    const fetchAnalyticsData = async () => {
        setLoading(true);
        try {
            const params = {
                start_date: dateRange[0],
                end_date: dateRange[1],
                group_by: groupBy,
            };
            const data = await getSalesAnalytics(params);
            setAnalyticsData(data);
        } catch (error) {
            message.error(intl.formatMessage({ id: 'pages.salesOpportunity.analytics.fetchFailed' }));
            console.error('获取分析数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 导出数据
    const handleExport = () => {
        // 这里可以实现导出功能
        message.info(intl.formatMessage({ id: 'pages.salesOpportunity.analytics.exportDeveloping' }));
    };

    // 初始化数据
    useEffect(() => {
        fetchAnalyticsData();
    }, [dateRange, groupBy]);

    // 模拟数据（当后端接口不可用时使用）
    const mockData = {
        funnel: [
            { stage: intl.formatMessage({ id: 'pages.salesOpportunity.status.initial' }), count: 120, amount: 2400000, conversion_rate: 100 },
            { stage: intl.formatMessage({ id: 'pages.salesOpportunity.status.analysis' }), count: 85, amount: 1700000, conversion_rate: 70.8 },
            { stage: intl.formatMessage({ id: 'pages.salesOpportunity.status.proposal' }), count: 60, amount: 1200000, conversion_rate: 50 },
            { stage: intl.formatMessage({ id: 'pages.salesOpportunity.status.negotiate' }), count: 35, amount: 700000, conversion_rate: 29.2 },
            { stage: intl.formatMessage({ id: 'pages.salesOpportunity.status.won' }), count: 20, amount: 400000, conversion_rate: 16.7 },
        ],
        trend: [
            { date: '2024-01', opportunities: 25, won_amount: 80000, conversion_rate: 20 },
            { date: '2024-02', opportunities: 30, won_amount: 95000, conversion_rate: 25 },
            { date: '2024-03', opportunities: 28, won_amount: 88000, conversion_rate: 22 },
            { date: '2024-04', opportunities: 35, won_amount: 110000, conversion_rate: 28 },
            { date: '2024-05', opportunities: 32, won_amount: 102000, conversion_rate: 26 },
        ],
        ranking: [
            { rank: 1, id: 1, name: '张三', total_opportunities: 15, total_amount: 450000, won_opportunities: 8, won_amount: 280000, win_rate: 53.3, average_amount: 30000 },
            { rank: 2, id: 2, name: '李四', total_opportunities: 12, total_amount: 380000, won_opportunities: 6, won_amount: 220000, win_rate: 50, average_amount: 31667 },
            { rank: 3, id: 3, name: '王五', total_opportunities: 10, total_amount: 320000, won_opportunities: 5, won_amount: 180000, win_rate: 50, average_amount: 32000 },
        ],
        summary: {
            total_opportunities: 120,
            total_amount: 2400000,
            won_opportunities: 20,
            won_amount: 400000,
            active_opportunities: 100,
            expected_revenue: 1680000,
            conversion_rate: 16.7,
        },
    };

    const data = analyticsData || mockData;

    return (
        <div style={{ padding: '20px' }}>
            {/* 筛选条件 */}
            <Card style={{ marginBottom: 20 }}>
                <Row gutter={16} align="middle">
                    <Col>
                        <span>{intl.formatMessage({ id: 'pages.salesOpportunity.analytics.dateRange' })}：</span>
                        <RangePicker
                            value={[dayjs(dateRange[0]), dayjs(dateRange[1])]}
                            onChange={(dates) => {
                                if (dates && dates[0] && dates[1]) {
                                    setDateRange([
                                        dates[0].toISOString().split('T')[0],
                                        dates[1].toISOString().split('T')[0],
                                    ]);
                                }
                            }}
                        />
                    </Col>
                    <Col>
                        <span>{intl.formatMessage({ id: 'pages.salesOpportunity.analytics.groupBy' })}：</span>
                        <Select
                            value={groupBy}
                            onChange={setGroupBy}
                            style={{ width: 120 }}
                        >
                            <Option value="day">{intl.formatMessage({ id: 'pages.salesOpportunity.analytics.groupBy.day' })}</Option>
                            <Option value="week">{intl.formatMessage({ id: 'pages.salesOpportunity.analytics.groupBy.week' })}</Option>
                            <Option value="month">{intl.formatMessage({ id: 'pages.salesOpportunity.analytics.groupBy.month' })}</Option>
                            <Option value="quarter">{intl.formatMessage({ id: 'pages.salesOpportunity.analytics.groupBy.quarter' })}</Option>
                        </Select>
                    </Col>
                    <Col>
                        <Space>
                            <Button
                                type="primary"
                                icon={<ReloadOutlined />}
                                onClick={fetchAnalyticsData}
                                loading={loading}
                            >
                                {intl.formatMessage({ id: 'pages.salesOpportunity.analytics.refreshData' })}
                            </Button>
                            <Button
                                icon={<DownloadOutlined />}
                                onClick={handleExport}
                            >
                                {intl.formatMessage({ id: 'pages.salesOpportunity.analytics.exportReport' })}
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* 汇总统计 */}
            <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title={intl.formatMessage({ id: 'pages.salesOpportunity.analytics.totalOpportunities' })}
                            value={data.summary.total_opportunities}
                            suffix={intl.formatMessage({ id: 'pages.salesOpportunity.analytics.countSuffix' })}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title={intl.formatMessage({ id: 'pages.salesOpportunity.analytics.totalAmount' })}
                            value={data.summary.total_amount}
                            suffix={intl.formatMessage({ id: 'pages.salesOpportunity.analytics.currencySuffix' })}
                            precision={0}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title={intl.formatMessage({ id: 'pages.salesOpportunity.analytics.wonOpportunities' })}
                            value={data.summary.won_opportunities}
                            suffix={intl.formatMessage({ id: 'pages.salesOpportunity.analytics.countSuffix' })}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title={intl.formatMessage({ id: 'pages.salesOpportunity.analytics.conversionRate' })}
                            value={data.summary.conversion_rate}
                            suffix={intl.formatMessage({ id: 'pages.salesOpportunity.analytics.percentageSuffix' })}
                            precision={1}
                        />
                    </Card>
                </Col>
            </Row>

            {/* 销售漏斗 */}
            <ProCard title={intl.formatMessage({ id: 'pages.salesOpportunity.analytics.salesFunnel' })} style={{ marginBottom: 20 }}>
                <Row gutter={16}>
                    {data.funnel.map((item: any, index: number) => (
                        <Col span={4} key={index}>
                            <Card size="small">
                                <Statistic
                                    title={item.stage}
                                    value={item.count}
                                    suffix={intl.formatMessage({ id: 'pages.salesOpportunity.analytics.countSuffix' })}
                                />
                                <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                                    {intl.formatMessage({ id: 'pages.salesOpportunity.analytics.amount' })}: ¥{item.amount.toLocaleString()}
                                </div>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    {intl.formatMessage({ id: 'pages.salesOpportunity.analytics.conversionRate' })}: {item.conversion_rate}%
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </ProCard>

            {/* 趋势分析 */}
            <ProCard title={intl.formatMessage({ id: 'pages.salesOpportunity.analytics.trendAnalysis' })} style={{ marginBottom: 20 }}>
                <Row gutter={16}>
                    {data.trend.map((item: any, index: number) => (
                        <Col span={4} key={index}>
                            <Card size="small">
                                <Statistic
                                    title={item.date}
                                    value={item.opportunities}
                                    suffix={intl.formatMessage({ id: 'pages.salesOpportunity.analytics.countSuffix' })}
                                />
                                <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                                    {intl.formatMessage({ id: 'pages.salesOpportunity.analytics.wonAmount' })}: ¥{item.won_amount.toLocaleString()}
                                </div>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    {intl.formatMessage({ id: 'pages.salesOpportunity.analytics.conversionRate' })}: {item.conversion_rate}%
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </ProCard>

            {/* 销售排行 */}
            <ProCard title={intl.formatMessage({ id: 'pages.salesOpportunity.analytics.salesRanking' })} style={{ marginBottom: 20 }}>
                <Row gutter={16}>
                    {data.ranking.map((item: any) => (
                        <Col span={8} key={item.id}>
                            <Card size="small">
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        backgroundColor: item.rank === 1 ? '#FFD700' : item.rank === 2 ? '#C0C0C0' : '#CD7F32',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        marginRight: '8px'
                                    }}>
                                        {item.rank}
                                    </span>
                                    <span style={{ fontWeight: 'bold' }}>{item.name}</span>
                                </div>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    {intl.formatMessage({ id: 'pages.salesOpportunity.analytics.totalOpportunities' })}: {item.total_opportunities}{intl.formatMessage({ id: 'pages.salesOpportunity.analytics.countSuffix' })}
                                </div>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    {intl.formatMessage({ id: 'pages.salesOpportunity.analytics.totalAmount' })}: ¥{item.total_amount.toLocaleString()}
                                </div>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    {intl.formatMessage({ id: 'pages.salesOpportunity.analytics.winRate' })}: {item.win_rate}%
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </ProCard>

            {/* 预期收入 */}
            <ProCard title={intl.formatMessage({ id: 'pages.salesOpportunity.analytics.expectedRevenueAnalysis' })}>
                <Row gutter={16}>
                    <Col span={8}>
                        <Card size="small">
                            <Statistic
                                title={intl.formatMessage({ id: 'pages.salesOpportunity.analytics.activeOpportunities' })}
                                value={data.summary.active_opportunities}
                                suffix={intl.formatMessage({ id: 'pages.salesOpportunity.analytics.countSuffix' })}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card size="small">
                            <Statistic
                                title={intl.formatMessage({ id: 'pages.salesOpportunity.analytics.expectedRevenue' })}
                                value={data.summary.expected_revenue}
                                suffix={intl.formatMessage({ id: 'pages.salesOpportunity.analytics.currencySuffix' })}
                                precision={0}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card size="small">
                            <Statistic
                                title={intl.formatMessage({ id: 'pages.salesOpportunity.analytics.averageOpportunityAmount' })}
                                value={data.summary.total_amount / data.summary.total_opportunities}
                                suffix={intl.formatMessage({ id: 'pages.salesOpportunity.analytics.currencySuffix' })}
                                precision={0}
                            />
                        </Card>
                    </Col>
                </Row>
            </ProCard>
        </div>
    );
};

export default SalesAnalytics;
