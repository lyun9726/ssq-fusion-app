"use client";
import React from "react";

const luckyQuotes = [
  "💫 好运藏在坚持里。",
  "🍀 今天的选择，也许就是明天的奇迹。",
  "🔥 幸运总会眷顾认真生活的人。",
  "🌈 下一注，也许就是你的故事开始。",
  "💎 有信念的号码,才最闪光。",
  "✨ 别忘了微笑，宇宙会听见你的心愿。",
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

  const fuse = () => {
    const redCount = {};
    const blueCount = {};

    predictions.forEach((p) => {
      const reds = p.reds.split(/[ ,，]+/).map(Number).filter(Boolean);
      reds.forEach((r) => (redCount[r] = (redCount[r] || 0) + 1));
      if (p.blue) blueCount[p.blue] = (blueCount[p.blue] || 0) + 1;
    });

    const reds = Object.entries(redCount)
      .sort((a, b) => b[1] - a[1] || a[0] - b[0])
      .slice(0, 6)
      .map(([r]) => parseInt(r))
      .sort((a, b) => a - b);

    const blue = Object.entries(blueCount).sort((a, b) => b[1] - a[1]);
    const finalBlue = blue.length ? blue[0][0] : "";

    setResult({ reds, blue: finalBlue });
    setQuote(luckyQuotes[Math.floor(Math.random() * luckyQuotes.length)]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-blue-50 py-10 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        🎯 AI 双色球融合预测器 v2.0
      </h1>

      <div className="space-y-4 w-80">
        {predictions.map((p, i) => (
          <div key={i} className="p-4 bg-white shadow rounded-xl">
            <p className="font-semibold mb-2 text-gray-700">
              预测组 {i + 1}
            </p>
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
          🚀 生成融合预测
        </button>

        {result && (
          <div className="mt-6 p-4 bg-white shadow rounded-xl text-center">
            <p className="font-bold mb-2 text-lg">✨ 本期融合预测结果</p>
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
