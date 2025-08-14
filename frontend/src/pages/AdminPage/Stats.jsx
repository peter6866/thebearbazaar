import React, { useEffect, useState, useMemo } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { useAuth } from "../../context/AuthContext";

function Stats() {
  const { authToken } = useAuth();

  const [weeklyUserStats, setWeeklyUserStats] = useState([]);

  useEffect(() => {
    const fetchWeeklyUserStats = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/v1/users/stats/weekly`,
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
  }, [authToken]);

  const lineChartData = useMemo(() => {
    return weeklyUserStats.map((stat, index) => ({
      x: index,
      y: stat.numUsers,
    }));
  }, [weeklyUserStats]);

  const x = lineChartData.map((data) => `Week\n${data.x}`);
  const y = lineChartData.map((data) => +data.y);

  const cusumY = useMemo(() => {
    let result = [];
    let runningTotal = 0;

    for (let i = 0; i < y.length; i++) {
      runningTotal += +y[i];
      result.push(runningTotal);
    }

    return result;
  }, [y]);

  const newUserIncreasePercentage = useMemo(() => {
    if (cusumY.length < 2) return 0;
    const increase = ((cusumY.at(-1) - cusumY.at(-2)) / cusumY.at(-2)) * 100;
    return +increase.toFixed(1);
  }, [cusumY]);

  const newUserIncrease = useMemo(() => {
    if (cusumY.length < 2) return 0;
    return cusumY.at(-1) - cusumY.at(-2);
  }, [cusumY]);

  const newRegistersChange = useMemo(() => {
    if (y.length < 2) return 0;
    return y.at(-1) - y.at(-2);
  }, [y]);

  const newRegistersChangePercentage = useMemo(() => {
    if (y.length < 2) return 0;
    const changePercentage = (newRegistersChange / y.at(-2)) * 100;
    return +changePercentage.toFixed(1);
  }, [y, newRegistersChange]);

  return (
    <div className="flex flex-col" data-theme="light">
      <div className="stats border border-gray-200 shadow mb-2">
        <div className="stat place-items-center">
          <div className="stat-title">Current Users</div>
          <div className="stat-value text-secondary">{cusumY.at(-1)}</div>
          <div className="stat-desc text-secondary">
            ↗︎ {`${newUserIncrease} (${newUserIncreasePercentage}%)`}
          </div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">New Registers</div>
          <div className="stat-value">{y.at(-1)}</div>
          <div className="stat-desc">
            {newRegistersChange >= 0 ? "↗︎" : "↘︎"}{" "}
            {`${Math.abs(newRegistersChange)} (${Math.abs(
              newRegistersChangePercentage
            )}%)`}
          </div>
        </div>
      </div>
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
            label: "New Weekly Registers",
            color: "#BA0C2F",
            curve: "linear",
          },
        ]}
        margin={{ top: 45, right: 25, bottom: 35, left: 30 }}
        height={380}
        sx={{ "& .MuiChartsAxis-tickLabel tspan": { fontSize: 14 } }}
        grid={{ horizontal: true }}
      />
    </div>
  );
}

export default Stats;
