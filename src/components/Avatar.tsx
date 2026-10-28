export function Avatar({ initials, large = false }: { initials: string; large?: boolean }) {
  return (
    <div className={`avatar${large ? " avatar-large" : ""}`} aria-hidden="true">
      {initials}
    </div>
  );
}
