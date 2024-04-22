import React, { useEffect, useState, useMemo } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { useConfig } from "../../context/ConfigContext";
import { useAuth } from "../../context/AuthContext";

function Stats() {
  const config = useConfig();
  const { authToken } = useAuth();

  const [weeklyUserStats, setWeeklyUserStats] = useState([]);

  useEffect(() => {
    const fetchWeeklyUserStats = async () => {
      try {
        const response = await fetch(
          `${config.REACT_APP_API_URL}/v1/users/weekly-stats`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const data = await response.json();
        setWeeklyUserStats(data.data.weeklyStats);
      } catch (error) {}
    };
    fetchWeeklyUserStats();
  }, []);

  const lineChartData = useMemo(() => {
    return weeklyUserStats.map((stat, index) => ({
      x: index,
      y: stat.numUsers,
    }));
  }, [weeklyUserStats]);

  const x = lineChartData.map((data) => data.x);
  const y = lineChartData.map((data) => data.y);

  return (
    <div>
      <LineChart
        xAxis={[
          {
            scaleType: "point",
            data: x.length > 12 ? x.slice(-12) : x,
          },
        ]}
        series={[
          {
            data: y.length > 12 ? y.slice(-12) : y,
            label: "New User Weekly Signups",
            color: "#a51417",
          },
        ]}
        margin={{ top: 40, right: 25, bottom: 20, left: 25 }}
        height={400}
        sx={{ "& .MuiChartsAxis-tickLabel tspan": { fontSize: 14 } }}
      />
    </div>
  );
}

export default Stats;
