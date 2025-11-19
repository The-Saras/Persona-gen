import ReactMarkdown from "react-markdown";

export default function PersonaDisplay({ content }: { content: any }) {
  return (
    <div className="prose prose-invert max-w-none mt-6">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
