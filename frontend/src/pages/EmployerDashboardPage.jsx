const postings = [
  { title: 'Senior Frontend Engineer', applicants: 18, status: 'Đang tuyển' },
  { title: 'Backend Developer', applicants: 12, status: 'Đang tuyển' },
  { title: 'Product Designer', applicants: 8, status: 'Dừng nhận' },
];

export default function EmployerDashboardPage() {
  return (
    <div className="employer-page">
      <div className="page-header">
        <div>
          <p className="eyebrow-small">Nhà tuyển dụng</p>
          <h1>Dashboard doanh nghiệp</h1>
        </div>
        <button className="primary-button" type="button">+ Đăng tin mới</button>
      </div>

      <div className="stats-grid">
        <div className="stat-panel">
          <strong>14</strong>
          <span>Tin đang mở</span>
        </div>
        <div className="stat-panel">
          <strong>236</strong>
          <span>Ứng viên nộp</span>
        </div>
        <div className="stat-panel">
          <strong>08</strong>
          <span>Phỏng vấn</span>
        </div>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Vị trí</th>
              <th>Ứng viên</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {postings.map((item) => (
              <tr key={item.title}>
                <td>{item.title}</td>
                <td>{item.applicants}</td>
                <td><span className="status-pill">{item.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
