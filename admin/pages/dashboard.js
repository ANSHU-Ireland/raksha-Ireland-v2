import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function Dashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('admin');
    
    if (!token || !adminData) {
      router.push('/');
      return;
    }

    setAdmin(JSON.parse(adminData));
    loadData();
  }, []);

  const loadData = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const [pendingRes, usersRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/pending-users`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setPendingUsers(pendingRes.data.users);
      setAllUsers(usersRes.data.users);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Load data error:', error);
      if (error.response?.status === 401) {
        router.push('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    if (!confirm('Approve this user?')) return;

    const token = localStorage.getItem('adminToken');
    try {
      await axios.post(
        `${API_URL}/admin/approve-user/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('User approved! Email sent.');
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to approve user');
    }
  };

  const handleReject = async (userId) => {
    const reason = prompt('Rejection reason (optional):');
    if (reason === null) return;

    const token = localStorage.getItem('adminToken');
    try {
      await axios.post(
        `${API_URL}/admin/reject-user/${userId}`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('User rejected! Email sent.');
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to reject user');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  const usersToShow = activeTab === 'pending' ? pendingUsers : allUsers;

  return (
    <>
      <Head>
        <title>Raksha Admin - Dashboard</title>
      </Head>
      <div className="container">
        <header className="header">
          <div>
            <h1 className="title">Raksha Ireland</h1>
            <p className="subtitle">Admin Dashboard</p>
          </div>
          <div className="header-actions">
            <span className="admin-name">{admin?.name}</span>
            <button onClick={handleLogout} className="button-secondary">
              Logout
            </button>
          </div>
        </header>

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.totalUsers}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.pendingUsers}</div>
              <div className="stat-label">Pending Approval</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.totalAlerts}</div>
              <div className="stat-label">Total SOS Alerts</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.todayAlerts}</div>
              <div className="stat-label">Today's Alerts</div>
            </div>
          </div>
        )}

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'pending' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending ({pendingUsers.length})
          </button>
          <button
            className={`tab ${activeTab === 'all' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Users ({allUsers.length})
          </button>
        </div>

        <div className="users-list">
          {usersToShow.length === 0 ? (
            <div className="empty-state">No users found</div>
          ) : (
            usersToShow.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="user-details">
                    {user.age} years, {user.sex} • {user.county}
                  </div>
                  <div className="user-email">{user.email}</div>
                  <div className="user-date">
                    Registered: {new Date(user.created_at).toLocaleDateString()}
                  </div>
                  {user.status && (
                    <div className={`user-status user-status-${user.status}`}>
                      {user.status}
                    </div>
                  )}
                </div>
                {user.status === 'pending' && (
                  <div className="user-actions">
                    <button
                      onClick={() => handleApprove(user.id)}
                      className="button-approve"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(user.id)}
                      className="button-reject"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

