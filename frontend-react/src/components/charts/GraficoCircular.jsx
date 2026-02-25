import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Colores neón vibrantes y distintos
const COLORS = ['#00BFFF', '#FF1493', '#FFFF00', '#9400D3', '#00FF00', '#FF073A'];

// Componente personalizado para el tooltip
const CustomTooltip = ({ active, payload }) => {
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
        {payload[0].name}
      </div>
    );
  }
  return null;
};

const GraficoCircular = ({ data, dataKey, nameKey, titulo }) => {
  // Calcular el total para porcentajes reales
  const total = data.reduce((sum, item) => sum + (item[dataKey] || 0), 0);
  
  // Transformar datos para mostrar nombre + porcentaje en leyenda
  const dataWithPercent = data.map((item, index) => ({
    ...item,
    displayName: `${item[nameKey]}: ${total > 0 ? Math.round((item[dataKey] / total) * 100) : 0}%`
  }));

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '500px' }}>
      {titulo && <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', textAlign: 'center' }}>{titulo}</h3>}
      <ResponsiveContainer width="100%" height={350}>
        <PieChart margin={{ top: 20, right: 20, bottom: 80, left: 20 }}>
          <Pie
            data={dataWithPercent}
            cx="50%"
            cy="45%"
            labelLine={false}
            label={false}
            outerRadius={85}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey="displayName"
          >
            {dataWithPercent.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: entry.color, fontWeight: 'bold', fontSize: '12px' }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoCircular;

