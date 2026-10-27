import { HighlightedText } from "@/components/ui/HighlightedText";

export function MarkedPhrase({ text, highlight }: { text: string; highlight: string }) {
  const index = highlight ? text.indexOf(highlight) : -1;
  if (index < 0) return <>{text}</>;

  return (
    <>
      {text.slice(0, index)}
      <HighlightedText variant="marker" className="sales-marker">
        {highlight}
      </HighlightedText>
      {text.slice(index + highlight.length)}
    </>
  );
}
