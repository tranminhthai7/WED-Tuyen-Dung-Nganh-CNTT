const applications = [
  { name: 'Frontend Developer', company: 'FPT Software', status: 'Đang xét' },
  { name: 'Backend Engineer', company: 'Viettel', status: 'Phỏng vấn' },
  { name: 'UI/UX Designer', company: 'NashTech', status: 'Đã nhận' },
];

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow-small">Dashboard</p>
          <h1>Quản lý ứng tuyển</h1>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-panel">
          <strong>28</strong>
          <span>Đơn đã nộp</span>
        </div>
        <div className="stat-panel">
          <strong>12</strong>
          <span>Đang xét</span>
        </div>
        <div className="stat-panel">
          <strong>06</strong>
          <span>Phỏng vấn</span>
        </div>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Vị trí</th>
              <th>Công ty</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((item) => (
              <tr key={item.name}>
                <td>{item.name}</td>
                <td>{item.company}</td>
                <td><span className="status-pill">{item.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
