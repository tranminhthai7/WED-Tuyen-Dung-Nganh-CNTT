export default function StatCard({ item }) {
  return (
    <div className="stat-box">
      <strong>{item.value}</strong>
      <span>{item.label}</span>
    </div>
  );
}
