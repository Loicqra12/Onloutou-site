export function LegalMissingInformationNotice({ children }: { children: React.ReactNode }) {
  return (
    <p className="leg-pending">
      <strong>Information en attente de validation.</strong> {children}
    </p>
  );
}
