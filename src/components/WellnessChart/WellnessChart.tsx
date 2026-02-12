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
    const colors = ["#82a1a6", "#c9b498", "#735c42", "#28504c"];

return (
    <section className="chart-section">
        <h3 className="chart-title">Évolution sur les 30 derniers jours</h3>
        <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={sortedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ dy: 10 }}
                        minTickGap={10}
                    />
                    <YAxis 
                        domain={[0, 10]} 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ dx: -10 }}
                    />
                    <Tooltip cursor={{ stroke: '#666', strokeWidth: 1 }} />
                    <Legend verticalAlign="top" height={36}/>
                    {categories.map((cat, index) => (
                        <Line 
                            key={`line-${cat}-${index}`}
                            type="monotone" 
                            dataKey={cat} 
                            stroke={colors[index % colors.length]} 
                            strokeWidth={2}
                            dot={{ r: 4, fill: colors[index % colors.length] }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                            connectNulls
                            strokeOpacity={0.8}
                            animationDuration={1000}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    </section>
);
};

export default WellnessChart;