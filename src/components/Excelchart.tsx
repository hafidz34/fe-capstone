import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line
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
  const [year, setYear] = useState(() =>
    localStorage.getItem("selectedYear") || new Date().getFullYear().toString()
  );
  const [availableYears, setAvailableYears] = useState<{ year: string }[]>([]);
  const [historyChartData, setHistoryChartData] = useState<{ year: string, avg: number }[]>([]);

  useEffect(() => {
    const fetchAvailableYears = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/data", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        const years = await res.json();
        console.log("Available years:", years);

        if (!Array.isArray(years)) {
          throw new Error("Response is not an array");
        }
        
        setAvailableYears(years);

        // Tambahan: Ambil semua rata-rata untuk line chart
        const list = [];
        for (const y of years) {
          const yearVal = y.year || y;
          const res = await fetch(`http://localhost:8000/api/data/${yearVal}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}`,},
        });
        const json = await res.json();
        const sheet = json[0]?.data.find((s: any) => s.name === "KESELURUHAN (OTOMATIS)");
        if (!sheet) continue;
        const avg = sheet.data.reduce((sum: number, row: any) => sum + Number(row.Persentase || 0), 0) / sheet.data.length;
        list.push({ year: String(yearVal), avg });
      }
      setHistoryChartData(list);
    } catch (err) {
      console.error("Error fetching years or averages:", err);
    }
  };

  fetchAvailableYears();
}, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/data/${year}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json = await res.json();

        console.log("Data response:", json);

        const sheet = json[0]?.data.find((s: any) => s.name === "KESELURUHAN (OTOMATIS)");
        if (!sheet) return;

        const formattedData = sheet.data.map((row: any) => ({
          ...row,
          Total: Number(row.Total) || 0,
          Target: Number(row.Target) || 0,
          Persentase: Number(row.Persentase) || 0,
        }));

        setData(formattedData);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, [year]);

  const pieData = [...data].sort((a, b) => b.Total - a.Total).map(item => ({
    name: item.Indikator,
    value: item.Total
  }));

  const onPieEnter = (_: any, index: number) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(null);

  return (
    <div style={{ padding: 20 }}>
      {/* Judul + Dropdown Tahun */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        flexWrap: 'wrap',
        gap: 8
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Grafik Data</h2>
        <div>
          <label htmlFor="yearSelect" style={{ marginRight: 8 }}>Pilih Tahun:</label>
          <select
            id="yearSelect"
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              localStorage.setItem("selectedYear", e.target.value);
            }}
          >
            {availableYears.map((yobj) => (
              <option key={yobj.year} value={yobj.year}>
                {yobj.year}
                </option>
            ))}
          </select>
        </div>
      </div>

      {data.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 25,
          justifyContent: 'center',
          paddingBottom: 12,
          marginBottom: 20
        }}>
          {/* BarChart Total vs Target */}
          <div style={{ flex: '1 1 350px', maxWidth: 330, backgroundColor: 'white', borderRadius: 20, padding: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: 14, marginBottom: 6, color: '#4B32C3', fontFamily: 'Poppins, sans-serif', fontWeight: 'bold' }}>Total Pencapaian vs Target</h3>
            <BarChart width={300} height={300} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Indikator" tick={false} />
              <YAxis />
              <Tooltip wrapperStyle={{ fontSize: 10 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Total" fill="#8884d8" />
              <Bar dataKey="Target" fill="#82ca9d" />
            </BarChart>
          </div>

          {/* Pie Chart */}
          <div style={{ flex: '0 0 350px', maxWidth: 330, backgroundColor: 'white', borderRadius: 20, padding: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: 14, marginBottom: 6, color: '#4B32C3', fontFamily: 'Poppins, sans-serif', fontWeight: 'bold' }}>Pencapaian Semua Indikator</h3>
            <PieChart width={300} height={300}>
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

          {/* BarChart Persentase */}
          <div style={{ flex: '1 1 350px', maxWidth: 330, backgroundColor: 'white', borderRadius: 20, padding: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: 14, marginBottom: 6, color: '#4B32C3', fontFamily: 'Poppins, sans-serif', fontWeight: 'bold' }}>Persentase Pencapaian</h3>
            <BarChart width={300} height={300} data={data}>
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

      {/* Line Chart Riwayat Rata-rata */}
      <div style={{
        marginTop: 40,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 16,
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        width: 680
      }}>
        <h3 style={{
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: 8,
          fontFamily: 'Poppins, sans-serif',
          color: '#4B32C3'
        }}>Riwayat Rata-rata Pencapaian</h3>
        <LineChart width={600} height={300} data={historyChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
          <Tooltip formatter={(v: number) => `${(v * 100).toFixed(2)}%`} />
          <Legend />
          <Line type="monotone" dataKey="avg" stroke="#4B32C3" strokeWidth={2} />
        </LineChart>
      </div>
    </div>
  );
};

export default ExcelChart;
