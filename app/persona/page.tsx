"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function PersonaPage() {
  const [topic, setTopic] = useState("");
  const [model, setModel] = useState("");
  const [usedModel, setUsedModel] = useState(""); // <-- NEW
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setOutput(null);
    setUsedModel(""); // reset before generating

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, model }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to generate");
      } else {
        setOutput(data.data);
        setUsedModel(model); // <-- show only after success
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-12">
      <div className=" mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Persona Generator</h1>
        <p className="text-gray-400 text-center">
          Enter a company and generate a detailed business persona.
        </p>

        {/* Input */}
        <input
          type="text"
          placeholder="Enter company (ex: Tesla, Zomato, Nike)"
          className="w-full px-4 py-3 rounded bg-slate-800 border border-slate-700 
          focus:outline-none focus:border-blue-500"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        {/* Model Dropdown */}
        <div className="flex flex-col space-y-2 w-64">
          <label className="text-sm font-medium text-gray-300">
            Choose AI model
          </label>

          <select
            id="modelSelect"
            name="model"
            className="bg-slate-900 border border-slate-700 text-gray-200 
            text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 
            focus:border-blue-500 outline-none"
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="openai">OpenAI</option>
            <option value="gemini">Gemini</option>
          </select>
        </div>

        {/* Button */}
        <button
          onClick={handleGenerate}
          disabled={loading || !topic.trim()}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded 
          disabled:opacity-50 transition"
        >
          {loading ? "Generating..." : "Generate Persona"}
        </button>

        {/* Error */}
        {error && (
          <p className="text-red-500 bg-red-950 p-3 rounded text-sm">
            {error}
          </p>
        )}

        {/* Output */}
        {output && (
          <>
            {/* Show usedModel ONLY after success */}
            {usedModel && (
              <p className="text-gray-400 text-sm">
                Persona Generated with <span className="text-blue-400">{usedModel}</span>
              </p>
            )}

           <div
  className="
    mt-6 p-10 
    bg-slate-900/70 backdrop-blur 
    border border-slate-800/70 
    rounded-2xl shadow-xl 
    w-full 
    overflow-x-auto
  "
>
  <div className="
      prose prose-invert 
      max-w-none 
      text-lg 
      leading-7 
      whitespace-pre-line 
      [&>*]:max-w-none
  ">
    <ReactMarkdown>{output}</ReactMarkdown>
  </div>
</div>

          </>
        )}
      </div>
    </div>
  );
}
