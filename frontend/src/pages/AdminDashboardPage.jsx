const stats = [
  { label: 'Ứng viên', value: '4520' },
  { label: 'Công ty', value: '320' },
  { label: 'Tin tuyển dụng', value: '1840' },
  { label: 'Đơn ứng tuyển', value: '9680' },
];

export default function AdminDashboardPage() {
  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <p className="eyebrow-small">Admin</p>
          <h1>Dashboard quản trị</h1>
        </div>
      </div>

      <div className="admin-grid">
        {stats.map((item) => (
          <div className="stat-panel" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Danh mục</th>
              <th>Số lượng</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Tin mới chờ duyệt</td>
              <td>24</td>
              <td><span className="status-pill">Chờ duyệt</span></td>
            </tr>
            <tr>
              <td>Công ty chưa xác thực</td>
              <td>17</td>
              <td><span className="status-pill">Cần kiểm tra</span></td>
            </tr>
            <tr>
              <td>Hồ sơ ứng viên</td>
              <td>146</td>
              <td><span className="status-pill">Hoạt động</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
