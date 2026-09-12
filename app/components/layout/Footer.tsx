export function Footer() {
  return (
    <footer className="w-full border-t border-rule py-6 text-sm text-ink-muted">
      <div className="mx-auto max-w-2xl px-4">
        <span className="mr-2">© {new Date().getFullYear()} AIgument</span>
      </div>
    </footer>
  );
}
