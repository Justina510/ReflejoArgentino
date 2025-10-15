import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import "./Treemap.css";

const AGE_COLORS = {
  "18-29": "var(--amarillo)",
  "30-39": "var(--celeste)",
  "40-49": "var(--Azul)",
  "50-70": "var(--naranja)",
};

const CHILD_COLORS = {
  "Formal": "rgba(255, 255, 255, 0.15)",
  "Informal": "rgba(255, 255, 255, 0.38)",
  "Desocupado": "rgba(255, 255, 255, 0.51)",
};

const CustomizedContent = ({ x, y, width, height, depth, name }) => {
  const isParent = depth === 1;
  const fill = isParent
    ? AGE_COLORS[name] || "#ccc"
    : CHILD_COLORS[name] || "#eee";

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill,
          stroke: "#fff",
          strokeWidth: isParent ? 2 : 1,
        }}
      />

      {isParent && width > 50 && height > 30 && (
        <text
          x={x + 5}
          y={y + 20}
          fill="#000"
          fontSize={14}
          fontWeight="bold"
        >
          Grupo {name} años
        </text>
      )}

      {!isParent && width > 40 && height > 20 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#393636"
          fontSize={12}
        >
          {name}
        </text>
      )}
    </g>
  );
};

export default function TreemapRecharts({ data, title }) {
  return (
    <div className="treemap-container">
      <h3 className="treemap-title">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <Treemap
          data={data}
          dataKey="size"
          content={<CustomizedContent />}
          isAnimationActive={false}
        >
          <Tooltip
            isAnimationActive={false}
            formatter={(value) =>
              value ? Number(value).toLocaleString("es-AR") : ""
            }
          />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
}