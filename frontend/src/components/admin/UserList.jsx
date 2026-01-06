import { useState, useEffect } from 'react';
import { FaSearch, FaSort, FaSortUp, FaSortDown, FaUserEdit, FaTrash } from 'react-icons/fa';

function UserList() {
  // Mock user data since we don't have a users endpoint
  const [users, setUsers] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  useEffect(() => {
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/users', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      // Map createdAt to created_at for compatibility with existing code
      const formattedData = data.map(user => ({
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.createdAt
      }));

      setUsers(formattedData);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, []);


  useEffect(() => {
    // Filter users based on search term
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Sort users
    const sortedUsers = [...filtered].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredUsers(sortedUsers);
  }, [searchTerm, users, sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort className="sort-icon" />;
    }
    return sortConfig.direction === 'asc' ? 
      <FaSortUp className="sort-icon active" /> : 
      <FaSortDown className="sort-icon active" />;
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // In a real app, you'd call an API here
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <>
    <style>{`

    body {
  background: #f7f7f7;
  color: #333;
  font-family: 'Segoe UI', sans-serif;
}

    .admin-toolbar {
  margin-bottom: 1rem;
}

.search-box {
  position: relative;
  max-width: 300px;
  margin-bottom: 1rem;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: #777;
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.6rem 0.75rem 0.6rem 2.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
  outline: none;
  transition: border 0.2s ease;
}

.search-input:focus {
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
}

/* Table styling */

.users-table table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.users-table th, .users-table td {
  padding: 0.85rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e9e9e9;
}

.users-table th {
  background: #f9fafc;
  font-weight: 600;
  color: #333;
  user-select: none;
  cursor: pointer;
}

.users-table th.sortable:hover {
  background: #f1f5f9;
}

.users-table tbody tr:hover {
  background: #f6fafd;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.actions-cell .btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.6rem;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  border: 1px solid #ccc;
  background: #fff;
  transition: all 0.2s ease;
}

.actions-cell .btn:hover {
  background: #f1f5f9;
}

.edit-btn {
  color: #1976d2;
  border-color: #1976d2;
}

.edit-btn:hover {
  background: #e3f2fd;
}

.delete-btn {
  color: #d32f2f;
  border-color: #d32f2f;
}

.delete-btn:hover {
  background: #ffebee;
}

/* Role badge pill styling */

.role-badge {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  text-transform: capitalize;
}

.role-badge.admin {
  background: #1976d2;
}

.role-badge.user {
  background: #43a047;
}

.role-badge.manager {
  background: #ff9800;
}

/* Empty state styling */

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #555;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
}

.empty-state p {
  margin-bottom: 1rem;
}

.empty-state .btn-primary {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background: #1976d2;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
}

.empty-state .btn-primary:hover {
  background: #1565c0;
}

    `}</style>
    <div className="user-list-admin">
      <div className="admin-toolbar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users by name, email or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      {filteredUsers.length === 0 ? (
        <div className="empty-state">
          <h3>No users found</h3>
          <p>Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th className="sortable" onClick={() => handleSort('id')}>
                  ID {getSortIcon('id')}
                </th>
                <th className="sortable" onClick={() => handleSort('name')}>
                  Name {getSortIcon('name')}
                </th>
                <th className="sortable" onClick={() => handleSort('email')}>
                  Email {getSortIcon('email')}
                </th>
                <th className="sortable" onClick={() => handleSort('role')}>
                  Role {getSortIcon('role')}
                </th>
                <th className="sortable" onClick={() => handleSort('created_at')}>
                  Joined Date {getSortIcon('created_at')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button 
                      className="btn btn-sm btn-outline edit-btn"
                    >
                      <FaUserEdit /> Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="btn btn-sm btn-outline delete-btn"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
}

export default UserList;