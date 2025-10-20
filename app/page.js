"use client";
import React from "react";

const luckyQuotes = [
  "💫 好运藏在坚持里。",
  "🍀 今天的选择,也许就是明天的奇迹。",
  "🔥 幸运总会眷顾认真生活的人。",
  "🌈 下一注,也许就是你的故事开始。",
  "💎 有信念的号码,才最闪光。",
  "✨ 别忘了微笑,宇宙会听见你的心愿。",
];

// 🎯 三组选项模板
const aiCombos = [
  {
    name: "组合 A · 热号延续",
    reds: [1, 2, 5, 7, 13, 30],
    blue: "09",
    desc: "保留近期热号 + 拉开跨度,稳健型策略。",
  },
  {
    name: "组合 B · 混合平衡",
    reds: [3, 6, 12, 19, 24, 32],
    blue: "11",
    desc: "低中高分布均衡,冷热结合,中性策略。",
  },
  {
    name: "组合 C · 反转搏冷",
    reds: [4, 8, 15, 21, 26, 33],
    blue: "06",
    desc: "冷号插入 + 偏高位分布,激进型策略。",
  },
];

export default function SsqFusionApp() {
  const [predictions, setPredictions] = React.useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ssq_predictions");
      return saved ? JSON.parse(saved) : [{ reds: "", blue: "" }];
    }
    return [{ reds: "", blue: "" }];
  });

  const [result, setResult] = React.useState(null);
  const [quote, setQuote] = React.useState("");

  const saveToLocal = (data) => {
    localStorage.setItem("ssq_predictions", JSON.stringify(data));
  };

  const handleChange = (index, field, value) => {
    const newData = [...predictions];
    newData[index][field] = value;
    setPredictions(newData);
    saveToLocal(newData);
  };

  const addGroup = () => {
    const newData = [...predictions, { reds: "", blue: "" }];
    setPredictions(newData);
    saveToLocal(newData);
  };

  const clearAll = () => {
    setPredictions([{ reds: "", blue: "" }]);
    setResult(null);
    setQuote("");
    localStorage.removeItem("ssq_predictions");
  };

  // 🧠 智能融合函数（区间平衡策略）
  const fuse = () => {
    // 1️⃣ 统计频率
    const redCount = {};
    const blueCount = {};
    predictions.forEach((p) => {
      const reds = p.reds.split(/[ ,，]+/).map(Number).filter(Boolean);
      reds.forEach((r) => (redCount[r] = (redCount[r] || 0) + 1));
      if (p.blue) blueCount[p.blue] = (blueCount[p.blue] || 0) + 1;
    });

    // 2️⃣ 按红球区间划分（1-11, 12-22, 23-33）
    const getRange = (n) => (n <= 11 ? 0 : n <= 22 ? 1 : 2);
    const rangeBuckets = [[], [], []];
    Object.entries(redCount).forEach(([r, c]) => {
      rangeBuckets[getRange(Number(r))].push([Number(r), c]);
    });

    // 3️⃣ 每段取最多的2个号码
    const reds = rangeBuckets
      .flatMap((bucket) =>
        bucket
          .sort((a, b) => b[1] - a[1] || a[0] - b[0])
          .slice(0, 2)
          .map(([r]) => r)
      )
      .sort((a, b) => a - b);

    // 4️⃣ 蓝球选出现最多的
    const blues = Object.entries(blueCount).sort((a, b) => b[1] - a[1]);
    const finalBlue = blues.length ? blues[0][0] : "";

    // 5️⃣ 更新结果
    setResult({ reds, blue: finalBlue });
    setQuote(luckyQuotes[Math.floor(Math.random() * luckyQuotes.length)]);
  };

  // 🎯 一键选用 AI 三组选项
  const useAiCombo = (combo) => {
    setResult({ reds: combo.reds, blue: combo.blue });
    setQuote(combo.desc);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-blue-50 py-10 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        🎯 AI 双色球融合预测器 v3.0
      </h1>

      <div className="space-y-4 w-80">
        {predictions.map((p, i) => (
          <div key={i} className="p-4 bg-white shadow rounded-xl">
            <p className="font-semibold mb-2 text-gray-700">预测组 {i + 1}</p>
            <input
              type="text"
              placeholder="红球（6个）"
              className="w-full border p-2 rounded mb-2"
              value={p.reds}
              onChange={(e) => handleChange(i, "reds", e.target.value)}
            />
            <input
              type="text"
              placeholder="蓝球"
              className="w-full border p-2 rounded"
              value={p.blue}
              onChange={(e) => handleChange(i, "blue", e.target.value)}
            />
          </div>
        ))}

        <div className="flex gap-2">
          <button
            onClick={addGroup}
            className="flex-1 bg-green-500 text-white py-2 rounded-xl"
          >
            ➕ 增加一组
          </button>
          <button
            onClick={clearAll}
            className="flex-1 bg-gray-400 text-white py-2 rounded-xl"
          >
            🧹 清空
          </button>
        </div>

        <button
          onClick={fuse}
          className="w-full bg-blue-600 text-white py-2 rounded-xl text-lg mt-2"
        >
          🚀 生成智能融合结果
        </button>

        {/* AI 三组选项 */}
        <div className="mt-6 bg-white rounded-xl shadow p-4">
          <p className="font-bold text-center text-gray-800 mb-3">
            🤖 AI 三选一推荐
          </p>
          {aiCombos.map((c, i) => (
            <button
              key={i}
              onClick={() => useAiCombo(c)}
              className="w-full mb-2 bg-gradient-to-r from-red-400 to-blue-400 text-white py-2 rounded-xl"
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* 显示结果 */}
        {result && (
          <div className="mt-6 p-4 bg-white shadow rounded-xl text-center">
            <p className="font-bold mb-2 text-lg">✨ 融合预测结果</p>
            <p className="text-lg">
              红球：
              {result.reds.map((n, i) => (
                <span
                  key={i}
                  className="mx-1 text-red-500 font-bold text-xl"
                >
                  {n.toString().padStart(2, "0")}
                </span>
              ))}
            </p>
            <p className="mt-2 text-lg">
              蓝球：
              <span className="text-blue-600 font-bold text-2xl">
                {result.blue}
              </span>
            </p>
            <p className="mt-4 text-gray-600 italic">{quote}</p>
          </div>
        )}
      </div>
    </div>
  );
}
