import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { computeBarRectangles } from "recharts/types/cartesian/Bar";


interface HistoryData {
    DATE: string;
    category: string;
    score: number;
}

interface FormatedDay {
    date: string;
    [categoryName: string]: string | number;
}

const WellnessChart = ({ rawData }: {rawData: HistoryData[]}) => {
    const dataMap: Record<string, FormatedDay> = {};
    
    rawData.forEach(item => {
        if (!dataMap[item.DATE]) {
            dataMap[item.DATE] = { date: item.DATE };
        }
        dataMap[item.DATE][item.category] = item.score;
    });

  const sortedData = Object.values(dataMap).sort((a, b) => {
    const currentYear = 2026;
    const [dayA, monthA] = a.date.split('/').map(Number);
    const [dayB, monthB] = b.date.split('/').map(Number);

    const dateA = new Date(currentYear, monthA - 1, dayA).getTime();
    const dateB = new Date(currentYear, monthB - 1, dayB).getTime();

    return dateA - dateB;
  });

    const categories = Array.from(new Set(rawData.map(item => item.category)));
    const colors = ["#FEB780", "#FB756C", "#7D8EA8", "#579393"];

return (
    <section className="chart-section">
        <h3 className="chart-title">Évolution sur les 30 derniers jours</h3>
        <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={sortedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false}
                    stroke="rgba(255, 255, 255, 0.1)"
                    />
                    <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ dy: 10, fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
                        minTickGap={15}
                    />
                    <YAxis 
                        domain={[0, 10]} 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ dx: -10, fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
                    />
                    <Tooltip cursor={{ stroke: 'rgba(255, 255, 255, 0.2)', strokeWidth: 1 }}
                    contentStyle={{ 
                            backgroundColor: 'rgba(169, 88, 98, 0.9)', 
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '12px',
                            color: '#f4f1ea' }}
                        itemStyle={{ color: '#f4f1ea' }}
                    />
                    <Legend 
                    verticalAlign="top" 
                    height={45}
                    iconType="circle"
                    wrapperStyle={{ paddingTop: '0px' }}
                    />
                    {categories.map((cat, index) => (
                        <Line 
                            key={`line-${cat}-${index}`}
                            type="monotone" 
                            dataKey={cat} 
                            stroke={colors[index % colors.length]} 
                            strokeWidth={3}
                            dot={{ r: 4, fill: colors[index % colors.length], strokeWidth: 2, stroke: '#A95862' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                            connectNulls
                            strokeOpacity={0.9}
                            animationDuration={1500}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    </section>
);
};

export default WellnessChart;