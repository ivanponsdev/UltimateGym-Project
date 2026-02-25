import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Componente personalizado para el tooltip
const CustomTooltipLineal = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: '#1a1a2e',
        border: '2px solid #00BFFF',
        borderRadius: '8px',
        padding: '10px 15px',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '13px',
        boxShadow: '0 0 10px rgba(0, 191, 255, 0.5)'
      }}>
        <p style={{ margin: '0 0 5px 0', color: '#fff' }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ margin: '0', color: '#fff' }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const GraficoLineal = ({ data, dataKeys, xAxisKey, titulo, colors = ["#8884d8", "#82ca9d", "#ffc658"] }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '300px' }}>
      {titulo && <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', textAlign: 'center' }}>{titulo}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey={xAxisKey} 
            stroke="#9ca3af"
            style={{ fontSize: '0.875rem' }}
          />
          <YAxis 
            stroke="#9ca3af"
            style={{ fontSize: '0.875rem' }}
          />
          <Tooltip content={<CustomTooltipLineal />} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          {dataKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              activeDot={{ r: 8 }}
              dot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoLineal;

