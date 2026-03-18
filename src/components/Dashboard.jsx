import React, { useEffect, useState } from 'react';
import { fetchSheetData } from '../utils/googleSheetFetcher';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Wallet, Percent, Calendar } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const Card = ({ title, value, subValue, icon: Icon, trend }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
        <Icon size={24} />
      </div>
      {trend && (
        <span className={`flex items-center text-sm font-medium ${trend.isPositive ? 'text-red-500' : 'text-blue-500'}`}>
          {trend.isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
          {trend.value}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <div className="mt-1 flex flex-col">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {subValue && <span className="text-xs text-gray-400 mt-1">{subValue}</span>}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchSheetData();
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-height-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!data) return (
    <div className="text-center p-20 bg-gray-50 min-height-screen">
      <p className="text-xl text-gray-500">데이터를 불러오지 못했습니다.</p>
    </div>
  );

  const summary = data.summary[0] || {};
  const holdings = data.holdings || [];

  // Parse numeric values
  const parseNum = (val) => {
    if (!val) return 0;
    return parseFloat(val.toString().replace(/[^0-9.-]/g, ''));
  };

  const pieData = holdings
    .filter(h => parseNum(h['비중(%)']) > 0)
    .map(h => ({
      name: h['종목명'],
      value: parseNum(h['비중(%)'])
    }));

  const barData = holdings
    .filter(h => h['종목명'] !== '합계')
    .map(h => ({
      name: h['종목명'],
      yield: parseNum(h['수익률(%)'])
    }))
    .sort((a, b) => b.yield - a.yield);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Portfolio Dashboard</h1>
        <p className="text-gray-500">Google Sheet 실시간 자산 현황</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card 
          title="총 평가금" 
          value={summary['총 평가금'] || '0'} 
          icon={Wallet}
        />
        <Card 
          title="총 투자금" 
          value={summary['총 투자금'] || '0'} 
          icon={DollarSign}
        />
        <Card 
          title="수익률" 
          value={summary['수익률'] || '0%'} 
          icon={Percent}
          trend={{ 
            isPositive: parseNum(summary['수익률']) >= 0, 
            value: summary['수익률'] 
          }}
        />
        <Card 
          title="일 변화액" 
          value={summary['일 변화액'] || '0'} 
          subValue={`변화율: ${summary['일 변화율'] || '0%'}`}
          icon={Calendar}
          trend={{ 
            isPositive: parseNum(summary['일 변화액']) >= 0, 
            value: summary['일 변화율'] 
          }}
        />
      </div>

      {/* Details Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-sm">
        <div className="bg-blue-100 p-3 rounded-lg flex flex-col items-center justify-center">
            <span className="text-blue-600 font-semibold">국내 1일</span>
            <span className={`font-bold ${parseNum(summary['국내 1일 변화액']) >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                {summary['국내 1일 변화액']} ({summary['국내 1일 변화율']})
            </span>
        </div>
        <div className="bg-green-100 p-3 rounded-lg flex flex-col items-center justify-center">
            <span className="text-green-600 font-semibold">국외 1일</span>
            <span className={`font-bold ${parseNum(summary['국외 1일 변화액']) >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                {summary['국외 1일 변화액']} ({summary['국외 1일 변화율']})
            </span>
        </div>
        <div className="bg-purple-100 p-3 rounded-lg flex flex-col items-center justify-center">
            <span className="text-purple-600 font-semibold">총 배당금</span>
            <span className="font-bold text-purple-800">{summary['배당금']}</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">자산 비중 (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">종목별 수익률 (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="yield" name="수익률">
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.yield >= 0 ? '#ef4444' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">상세 보유 종목</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs font-medium uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">종목명</th>
                <th className="px-6 py-4">보유수량</th>
                <th className="px-6 py-4">평가금액</th>
                <th className="px-6 py-4">수익률</th>
                <th className="px-6 py-4">비중</th>
                <th className="px-6 py-4">일변동</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {holdings.filter(h => h['종목명'] !== '합계').map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{item['종목명']}</td>
                  <td className="px-6 py-4 text-gray-500">{item['총 수량']}</td>
                  <td className="px-6 py-4 text-gray-900 font-semibold">{item['평가금액(원)']}</td>
                  <td className={`px-6 py-4 font-bold ${parseNum(item['수익률(%)']) >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                    {item['수익률(%)']}%
                  </td>
                  <td className="px-6 py-4 text-gray-500">{item['비중(%)']}%</td>
                  <td className={`px-6 py-4 font-medium ${parseNum(item['일간 변동율(%)']) >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                    {item['일간 변동율(%)']}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
