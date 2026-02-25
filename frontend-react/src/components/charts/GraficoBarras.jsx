import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// Componente personalizado para el tooltip
const CustomTooltipBarras = ({ active, payload, label }) => {
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

const GraficoBarras = ({ data, dataKey, xAxisKey, titulo, color = "#8884d8", colors = [] }) => {
  // Si se pasa un array de colores, usar uno diferente por barra
  const useMultipleColors = colors.length > 0;
  
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '300px' }}>
      {titulo && <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', textAlign: 'center' }}>{titulo}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          <Tooltip content={<CustomTooltipBarras />} />
          <Bar dataKey={dataKey} radius={[8, 8, 0, 0]}>
            {useMultipleColors ? (
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))
            ) : (
              <Cell fill={color} />
            )}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoBarras;

