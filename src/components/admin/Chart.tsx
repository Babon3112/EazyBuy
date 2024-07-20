import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartProps {
  title: string;
  data: any[];
  dataKey: string;
  grid?: boolean;
}

const Chart: React.FC<ChartProps> = ({ title, data, dataKey, grid }) => {
  return (
    <div className="m-5 p-5 shadow-md">
      <h3 className="mb-5 text-lg font-semibold">{title}</h3>
      <ResponsiveContainer width="100%" aspect={4 / 1}>
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#5550bd" />
          <Line type="monotone" dataKey={dataKey} stroke="#5550bd" />
          <Tooltip />
          {grid && <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
