"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Settings } from "lucide-react";

export default function PersonaPage() {
  const [topic, setTopic] = useState("");
  const [model, setModel] = useState("");
  const [usedModel, setUsedModel] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [openSettings, setOpenSettings] = useState(false);
  const[instructions,setInstructions]=useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setOutput(null);
    setUsedModel("");

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, model,inst:instructions }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to generate");
      } else {
        setOutput(data.data);
        setUsedModel(model);
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-12 relative">
      
      {/* SETTINGS BUTTON */}
      <button
        onClick={() => setOpenSettings(true)}
        className="
          absolute top-4 right-4 
          p-2 rounded-full 
          bg-slate-800/60 hover:bg-slate-700 
          border border-slate-700 
          transition
        "
      >
        <Settings className="w-5 h-5 text-gray-300" />
      </button>

      <div className="mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Persona Generator</h1>
        <p className="text-gray-400 text-center">
          Enter a company and generate a detailed business persona.
        </p>

        <input
          type="text"
          placeholder="Enter company (ex: Tesla, Zomato, Nike)"
          className="w-full px-4 py-3 rounded bg-slate-800 border border-slate-700 
          focus:outline-none focus:border-blue-500"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

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

        <button
          onClick={handleGenerate}
          disabled={loading || !topic.trim()}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded 
          disabled:opacity-50 transition"
        >
          {loading ? "Generating..." : "Generate Persona"}
        </button>

        {error && (
          <p className="text-red-500 bg-red-950 p-3 rounded text-sm">
            {error}
          </p>
        )}

        {output && (
          <>
            {usedModel && (
              <p className="text-gray-400 text-sm">
                Persona Generated with{" "}
                <span className="text-blue-400">{usedModel}</span>
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
              <div
                className="
                  prose prose-invert 
                  max-w-none 
                  text-lg 
                  leading-7 
                  whitespace-pre-line 
                  [&>*]:max-w-none
                "
              >
                <ReactMarkdown>{output}</ReactMarkdown>
              </div>
            </div>
          </>
        )}
      </div>

      {/* SETTINGS MODAL */}
      {openSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl w-80 space-y-4">
            <h2 className="text-xl font-semibold">Settings</h2>

            <p className="text-gray-400 text-sm">{}</p>
            <textarea
  className="w-full h-32 bg-slate-800 border border-slate-700 rounded-lg p-3 
             text-sm text-gray-200 focus:outline-none focus:border-blue-500"
  placeholder="Add extra instructions (optional)..."
  value={instructions}
  onChange={(e) => setInstructions(e.target.value)}
/>

            <button
              onClick={() => setOpenSettings(false)}
              className="w-full py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
