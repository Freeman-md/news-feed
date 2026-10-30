export function Avatar({ name, large = false }: { name: string; large?: boolean }) {
  const initials = name.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join("");
  return (
    <div className={`avatar${large ? " avatar-large" : ""}`} aria-hidden="true">
      {initials}
    </div>
  );
}
