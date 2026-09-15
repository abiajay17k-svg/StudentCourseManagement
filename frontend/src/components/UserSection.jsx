import { useState } from 'react';
import { createUser } from '../services/api';

export default function UserSection({ users, onUserAdded, showNotification }) {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName.trim()) {
      showNotification('User name cannot be empty', 'error');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }

    setLoading(true);
    try {
      const newUser = await createUser({
        userName: userName.trim(),
        email: email.trim(),
      });
      showNotification(`User "${newUser.userName}" created successfully! (ID: ${newUser.userId})`, 'success');
      setUserName('');
      setEmail('');
      if (onUserAdded) onUserAdded();
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>👤 User Management</h2>
        <p className="section-description">Register new participants and manage system users.</p>
      </div>

      <div className="grid-two-columns">
        {/* Add User Form Card */}
        <div className="card">
          <div className="card-header">
            <h3>Add New User</h3>
          </div>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="userName">User Name *</label>
              <input
                id="userName"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Alice Smith"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. alice@example.com"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : '+ Add User'}
            </button>
          </form>
        </div>

        {/* Users List Card */}
        <div className="card">
          <div className="card-header flex-between">
            <h3>Registered Users</h3>
            <span className="badge badge-info">{users.length} {users.length === 1 ? 'user' : 'users'}</span>
          </div>

          {users.length === 0 ? (
            <div className="empty-state">
              <p>No users registered yet.</p>
              <span className="hint">Use the form to add your first user.</span>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.userId}>
                      <td><span className="id-badge">#{user.userId}</span></td>
                      <td className="font-semibold">{user.userName}</td>
                      <td className="text-muted">{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
