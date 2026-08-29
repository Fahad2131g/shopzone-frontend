import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  getAllUsersApi,
  updateUserRoleApi,
  deleteUserApi,
  type AdminUser,
} from '../api/userApi'
import {
  FiRefreshCw,
  FiSearch,
  FiUser,
  FiShield,
  FiTrash2,
  FiMail,
} from 'react-icons/fi';

const ADMIN_EMAIL = 'test@gmail.com';

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsersApi();
      setUsers(data || []);
    } catch {
      toast.error('Could not load users from server');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (user: AdminUser) => {
    if (user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      toast.error("You can't change the primary admin account's role");
      return;
    }
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    const confirmed = window.confirm(
      `Change ${user.name}'s role from ${user.role} to ${newRole}?`
    );
    if (!confirmed) return;

    setUpdatingId(user.id);
    try {
      const updated = await updateUserRoleApi(user.id, newRole);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
      toast.success(`${user.name} is now ${newRole}`);
    } catch {
      toast.error('Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (user: AdminUser) => {
    if (user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      toast.error("You can't delete the primary admin account");
      return;
    }
    if (!window.confirm(`Delete ${user.name} (${user.email}) permanently?`)) return;

    try {
      await deleteUserApi(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      toast.success(`${user.name} deleted`);
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const adminCount = users.filter((u) => u.role === 'ADMIN').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-amber-200/60 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-amber-950 tracking-tight">
            Registered Users
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Manage user accounts and permission roles.
          </p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-amber-200 hover:bg-amber-50 text-amber-950 font-bold text-xs shadow-sm"
        >
          <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Users
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-amber-200/70 p-4">
          <p className="text-xs text-stone-500 font-semibold">Total Users</p>
          <p className="text-2xl font-extrabold text-amber-950 mt-1">{users.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-amber-200/70 p-4">
          <p className="text-xs text-stone-500 font-semibold">Admins</p>
          <p className="text-2xl font-extrabold text-orange-700 mt-1">{adminCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-amber-200/70 p-4">
          <p className="text-xs text-stone-500 font-semibold">Regular Users</p>
          <p className="text-2xl font-extrabold text-stone-700 mt-1">{users.length - adminCount}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-3.5 top-3 text-stone-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F3] border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
        />
      </div>

      {/* Users List */}
      {loading ? (
        <div className="text-center py-16 text-stone-400 text-sm">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-16 text-stone-400 text-sm bg-white rounded-3xl border border-amber-200/70">
          No users found.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-amber-200/70 shadow-sm overflow-hidden">
          <div className="divide-y divide-amber-100">
            {filteredUsers.map((user) => {
              const isPrimaryAdmin = user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
              return (
                <div
                  key={user.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-amber-50/40 transition"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center font-extrabold text-sm shrink-0 ${
                        user.role === 'ADMIN'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-stone-900 text-sm truncate">{user.name}</h3>
                        {isPrimaryAdmin && (
                          <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                            Primary Admin
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                        <FiMail className="w-3 h-3" />
                        <span className="truncate">{user.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                        user.role === 'ADMIN'
                          ? 'bg-orange-50 text-orange-800 border-orange-200'
                          : 'bg-stone-100 text-stone-700 border-stone-300'
                      }`}
                    >
                      {user.role === 'ADMIN' ? (
                        <FiShield className="w-3.5 h-3.5" />
                      ) : (
                        <FiUser className="w-3.5 h-3.5" />
                      )}
                      {user.role}
                    </span>

                    <button
                      onClick={() => handleRoleToggle(user)}
                      disabled={updatingId === user.id || isPrimaryAdmin}
                      className="px-3 py-2 rounded-xl bg-[#FAF8F3] border border-amber-200 text-amber-950 text-xs font-bold hover:bg-amber-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                      title={isPrimaryAdmin ? "Can't change primary admin" : 'Toggle role'}
                    >
                      {user.role === 'ADMIN' ? 'Make User' : 'Make Admin'}
                    </button>

                    <button
                      onClick={() => handleDelete(user)}
                      disabled={isPrimaryAdmin}
                      className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                      title={isPrimaryAdmin ? "Can't delete primary admin" : 'Delete user'}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}