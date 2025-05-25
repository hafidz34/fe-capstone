import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell
} from 'recharts';

interface DataRow {
  No: number;
  Indikator: string;
  Unit: string;
  SBRC: number;
  'PS Sawit': number;
  PSSP: number;
  LRITM: number;
  CREATA: number;
  Biotech: number;
  BRAIN: number;
  Total: number;
  Target: number;
  Persentase: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6699', '#33CC99', '#FF6666', '#66CCFF', '#FF9933'];

const darkenColor = (color: string, amount: number) => {
  let usePound = false;
  if (color[0] === '#') {
    color = color.slice(1);
    usePound = true;
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) - amount * 255;
  let g = ((num >> 8) & 0x00FF) - amount * 255;
  let b = (num & 0x0000FF) - amount * 255;
  r = r < 0 ? 0 : r;
  g = g < 0 ? 0 : g;
  b = b < 0 ? 0 : b;
  const newColor = (r << 16) | (g << 8) | b;
  return (usePound ? '#' : '') + newColor.toString(16).padStart(6, '0');
};

const ExcelChart: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedYear = localStorage.getItem("selectedYear");
        const year = storedYear ? Number(storedYear) : new Date().getFullYear();

        if (isNaN(year)) {
          console.error("Invalid year from localStorage:", storedYear);
          return;
        }

        const res = await fetch(`http://localhost:8000/api/data/${year}`, {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        });

        if (!res.ok) {
          throw new Error(`Fetch failed with status ${res.status}`);
        }

        const json = await res.json();

        if (!Array.isArray(json) || !json[0] || !json[0].data) {
          console.error("Invalid response format:", json);
          return;
        }

        const sheet = json[0].data.find((s: any) => s.name === "KESELURUHAN (OTOMATIS)");

        if (!sheet) {
          console.error("Sheet 'KESELURUHAN (OTOMATIS)' not found in data.");
          return;
        }

        const formattedData = sheet.data.map((row: any) => ({
          ...row,
          Total: isNaN(Number(row.Total)) ? 0 : Number(row.Total),
          Target: isNaN(Number(row.Target)) ? 0 : Number(row.Target),
          Persentase: isNaN(Number(row.Persentase)) ? 0 : Number(row.Persentase),
        }));

        setData(formattedData);
        setFileName(`[${year}] REKAPITULASI.xlsx`);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, []);

  const pieData = [...data].sort((a, b) => b.Total - a.Total).map(item => ({
    name: item.Indikator,
    value: item.Total
  }));

  const onPieEnter = (_: any, index: number) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(null);
  const lastData = data.slice(0);
  const avgPercentage =
  lastData.reduce((sum, item) => sum + item.Persentase, 0) / lastData.length || 0;
  const historyData = avgPercentage

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 16, fontSize: '24px', fontWeight: 'bold' }}>Grafik Data</h2>
      {data.length > 0 && (
        <div style={{
          display: 'flex',
          gap: 40,
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          maxWidth: '100%'
        }}>
          <div style={{ flex: '1 1 350px', minWidth: 360, backgroundColor: 'white', borderRadius: 20, padding: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: 14, marginBottom: 6 ,color: '#4B32C3', fontFamily: 'Poppins, sans-serif', fontWeight: 'bold'}}>Total Pencapaian vs Target</h3>
            <BarChart width={350} height={350} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Indikator" tick={false} />
              <YAxis />
              <Tooltip wrapperStyle={{ fontSize: 10 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Total" fill="#8884d8" />
              <Bar dataKey="Target" fill="#82ca9d" />
            </BarChart>
          </div>

          <div style={{ flex: '0 0 350px', minWidth: 370, backgroundColor: 'white', borderRadius: 20, padding: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: 14, marginBottom: 6 ,color: '#4B32C3', fontFamily: 'Poppins, sans-serif', fontWeight: 'bold'}}>Pencapaian Semua Indikator</h3>
            <PieChart width={350} height={350}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={125}
                label={{ fontSize: 10 }}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
              >
                {pieData.map((_, index) => {
                  const isActive = index === activeIndex;
                  const fillColor = isActive
                    ? darkenColor(COLORS[index % COLORS.length], 0.2)
                    : COLORS[index % COLORS.length];
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={fillColor}
                      style={{
                        transition: 'fill 0.3s ease, transform 0.3s ease',
                        transform: `scale(${isActive ? 1.1 : 1})`,
                        transformOrigin: '50% 50%',
                        cursor: 'pointer'
                      }}
                    />
                  );
                })}
              </Pie>
              <Tooltip wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </div>

          <div style={{ flex: '1 1 350px', minWidth: 370, backgroundColor: 'white', borderRadius: 20, padding: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.1)'}}>
            <h3 style={{ fontSize: 14, marginBottom: 6 ,color: '#4B32C3', fontFamily: 'Poppins, sans-serif', fontWeight: 'bold'}}>Persentase Pencapaian</h3>
            <BarChart width={350} height={350} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Indikator" tick={false} />
              <YAxis tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} domain={[0, 1]} />
              <Tooltip formatter={(v: number) => `${(v * 100).toFixed(2)}%`} wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="Persentase" fill="#ffbb28" />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </BarChart>
          </div>
        </div>
      )}
      <h2 style={{ marginTop: 16, width : 250, backgroundColor: 'white', borderRadius: 20, padding: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
        Rata-rata Pencapaian : {(historyData * 100).toFixed(2)}%
      </h2>
    </div>
  );
};

export default ExcelChart;
