import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Plus, Users, LogOut, Baby, CalendarPlus, TrendingUp, Settings } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import ChildrenTable from '../components/ChildrenTable';
import AddChildModal from '../components/AddChildModal';
import AddParentModal from '../components/AddParentModal';
import AddAppointmentModal from '../components/AddAppointmentModal';
import AppointmentsTable from '../components/AppointmentsTable';
import GrowthTable from '../components/GrowthTable';
import AddGrowthModal from '../components/AddGrowthModal';
import { getAllBabies, createBaby, updateBaby, deleteBaby, createUser, logout, getAllAppointments, createAppointment, updateAppointment, deleteAppointment, getAllGrowthRecords, createGrowthRecord, updateGrowthRecord, deleteGrowthRecord } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout: logoutUser } = useAppStore();

  const [children, setChildren] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [growthRecords, setGrowthRecords] = useState([]);
  const [selectedBabyForGrowth, setSelectedBabyForGrowth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
  const [isAddParentModalOpen, setIsAddParentModalOpen] = useState(false);
  const [isAddAppointmentModalOpen, setIsAddAppointmentModalOpen] = useState(false);
  const [isAddGrowthModalOpen, setIsAddGrowthModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editingGrowthRecord, setEditingGrowthRecord] = useState(null);

  // Fetch children and appointments on mount
  useEffect(() => {
    fetchChildren();
    fetchAppointments();
  }, []);

  // Fetch growth records when a baby is selected
  useEffect(() => {
    if (selectedBabyForGrowth) {
      fetchGrowthRecords(selectedBabyForGrowth);
    } else if (children.length > 0) {
      // Default to first child if none selected
      setSelectedBabyForGrowth(children[0].id);
    }
  }, [selectedBabyForGrowth, children]);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const response = await getAllBabies();
      setChildren(response.data || []);
    } catch (error) {
      console.error('Error fetching children:', error);
      toast.error('Failed to load children');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await getAllAppointments({ upcoming: 'true' });
      setAppointments(response.data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    }
  };

  const fetchGrowthRecords = async (babyId) => {
    try {
      const response = await getAllGrowthRecords(babyId);
      setGrowthRecords(response.data || []);
    } catch (error) {
      console.error('Error fetching growth records:', error);
      toast.error('Failed to load growth records');
    }
  };

  const handleAddChild = async (childData) => {
    try {
      await createBaby(childData);
      toast.success('Child added successfully!');
      setIsAddChildModalOpen(false);
      fetchChildren();
    } catch (error) {
      console.error('Error adding child:', error);
      toast.error(error.response?.data?.message || 'Failed to add child');
    }
  };

  const handleEditChild = (child) => {
    setEditingChild(child);
    setIsAddChildModalOpen(true);
  };

  const handleUpdateChild = async (childData) => {
    try {
      await updateBaby(editingChild.id, childData);
      toast.success('Child updated successfully!');
      setIsAddChildModalOpen(false);
      setEditingChild(null);
      fetchChildren();
    } catch (error) {
      console.error('Error updating child:', error);
      toast.error(error.response?.data?.message || 'Failed to update child');
    }
  };

  const handleDeleteChild = async (child) => {
    if (!window.confirm(`Are you sure you want to delete ${child.name}'s record?`)) {
      return;
    }

    try {
      await deleteBaby(child.id);
      toast.success('Child deleted successfully');
      fetchChildren();
    } catch (error) {
      console.error('Error deleting child:', error);
      toast.error(error.response?.data?.message || 'Failed to delete child');
    }
  };

  const handleAddParent = async (parentData) => {
    try {
      await createUser(parentData);
      toast.success('Parent/caregiver added successfully!');
      setIsAddParentModalOpen(false);
    } catch (error) {
      console.error('Error adding parent:', error);
      toast.error(error.response?.data?.message || 'Failed to add parent');
    }
  };

  const handleAddAppointment = async (appointmentData) => {
    try {
      await createAppointment(appointmentData);
      toast.success('Appointment added successfully!');
      setIsAddAppointmentModalOpen(false);
      fetchAppointments();
      fetchChildren(); // Refresh to update next appointment
    } catch (error) {
      console.error('Error adding appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to add appointment');
    }
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setIsAddAppointmentModalOpen(true);
  };

  const handleUpdateAppointment = async (appointmentData) => {
    try {
      await updateAppointment(editingAppointment.id, appointmentData);
      toast.success('Appointment updated successfully!');
      setIsAddAppointmentModalOpen(false);
      setEditingAppointment(null);
      fetchAppointments();
      fetchChildren();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to update appointment');
    }
  };

  const handleDeleteAppointment = async (appointment) => {
    if (!window.confirm(`Are you sure you want to delete this appointment: ${appointment.title}?`)) {
      return;
    }

    try {
      await deleteAppointment(appointment.id);
      toast.success('Appointment deleted successfully');
      fetchAppointments();
      fetchChildren();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to delete appointment');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      logoutUser();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      logoutUser();
      navigate('/login');
    }
  };

  const handleCloseChildModal = () => {
    setIsAddChildModalOpen(false);
    setEditingChild(null);
  };

  const handleCloseAppointmentModal = () => {
    setIsAddAppointmentModalOpen(false);
    setEditingAppointment(null);
  };

  const handleAddGrowthRecord = async (growthData) => {
    try {
      await createGrowthRecord(growthData);
      toast.success('Growth record added successfully!');
      setIsAddGrowthModalOpen(false);
      if (selectedBabyForGrowth) {
        fetchGrowthRecords(selectedBabyForGrowth);
      }
    } catch (error) {
      console.error('Error adding growth record:', error);
      toast.error(error.response?.data?.message || 'Failed to add growth record');
    }
  };

  const handleEditGrowthRecord = (record) => {
    setEditingGrowthRecord(record);
    setIsAddGrowthModalOpen(true);
  };

  const handleUpdateGrowthRecord = async (growthData) => {
    try {
      await updateGrowthRecord(editingGrowthRecord.id, growthData);
      toast.success('Growth record updated successfully!');
      setIsAddGrowthModalOpen(false);
      setEditingGrowthRecord(null);
      if (selectedBabyForGrowth) {
        fetchGrowthRecords(selectedBabyForGrowth);
      }
    } catch (error) {
      console.error('Error updating growth record:', error);
      toast.error(error.response?.data?.message || 'Failed to update growth record');
    }
  };

  const handleDeleteGrowthRecord = async (recordId) => {
    if (!window.confirm('Are you sure you want to delete this growth record?')) {
      return;
    }

    try {
      await deleteGrowthRecord(recordId);
      toast.success('Growth record deleted successfully');
      if (selectedBabyForGrowth) {
        fetchGrowthRecords(selectedBabyForGrowth);
      }
    } catch (error) {
      console.error('Error deleting growth record:', error);
      toast.error(error.response?.data?.message || 'Failed to delete growth record');
    }
  };

  const handleCloseGrowthModal = () => {
    setIsAddGrowthModalOpen(false);
    setEditingGrowthRecord(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-mint-50 to-coral-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-mint-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🦕</div>
              <div>
                <h1 className="text-2xl font-display font-bold text-mint-700">
                  Baby Logbook
                </h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.displayName || 'User'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 hidden sm:inline">
                Role: <span className="font-semibold capitalize">{user?.role || 'User'}</span>
              </span>
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Profile Settings"
              >
                <Settings className="w-5 h-5" />
                <span className="hidden sm:inline">Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => setIsAddChildModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-mint-500 hover:bg-mint-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Baby className="w-5 h-5" />
            Add Child
          </button>

          <button
            onClick={() => setIsAddAppointmentModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <CalendarPlus className="w-5 h-5" />
            Add Appointment
          </button>

          <button
            onClick={() => setIsAddGrowthModalOpen(true)}
            disabled={children.length === 0}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-lavender-500 hover:bg-lavender-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TrendingUp className="w-5 h-5" />
            Add Growth Record
          </button>

          {user?.role === 'admin' && (
            <button
              onClick={() => setIsAddParentModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-coral-500 hover:bg-coral-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Users className="w-5 h-5" />
              Add Parent/Caregiver
            </button>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-mint-100 rounded-full flex items-center justify-center">
                <Baby className="w-6 h-6 text-mint-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Children</p>
                <p className="text-3xl font-bold text-gray-900">{children.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-coral-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Upcoming Appointments</p>
                <p className="text-3xl font-bold text-gray-900">
                  {children.filter((c) => c.nextAppointment).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sunny-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">With Allergies</p>
                <p className="text-3xl font-bold text-gray-900">
                  {children.filter((c) => c.allergies).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold text-gray-800 mb-4">Upcoming Appointments</h2>
          <AppointmentsTable
            appointments={appointments}
            onEdit={handleEditAppointment}
            onDelete={handleDeleteAppointment}
          />
        </div>

        {/* Growth Tracking */}
        {children.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-display font-bold text-gray-800">Growth Tracking</h2>
              <div className="flex items-center gap-3">
                <label htmlFor="babySelector" className="text-sm font-medium text-gray-700">
                  Select Child:
                </label>
                <select
                  id="babySelector"
                  value={selectedBabyForGrowth || ''}
                  onChange={(e) => setSelectedBabyForGrowth(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent transition-colors"
                >
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <GrowthTable
              growthRecords={growthRecords}
              onEdit={handleEditGrowthRecord}
              onDelete={handleDeleteGrowthRecord}
            />
          </div>
        )}

        {/* Children Table */}
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold text-gray-800 mb-4">Children</h2>
          {loading ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="text-4xl mb-4 animate-bounce">🦕</div>
              <p className="text-gray-600">Loading children...</p>
            </div>
          ) : (
            <ChildrenTable
              children={children}
              onEdit={handleEditChild}
              onDelete={handleDeleteChild}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <AddChildModal
        isOpen={isAddChildModalOpen}
        onClose={handleCloseChildModal}
        onSave={editingChild ? handleUpdateChild : handleAddChild}
        editingChild={editingChild}
      />

      <AddParentModal
        isOpen={isAddParentModalOpen}
        onClose={() => setIsAddParentModalOpen(false)}
        onSave={handleAddParent}
      />

      <AddAppointmentModal
        isOpen={isAddAppointmentModalOpen}
        onClose={handleCloseAppointmentModal}
        onSave={editingAppointment ? handleUpdateAppointment : handleAddAppointment}
        children={children}
        editingAppointment={editingAppointment}
      />

      <AddGrowthModal
        isOpen={isAddGrowthModalOpen}
        onClose={handleCloseGrowthModal}
        onSubmit={editingGrowthRecord ? handleUpdateGrowthRecord : handleAddGrowthRecord}
        children={children}
        editingRecord={editingGrowthRecord}
      />
    </div>
  );
};

export default Dashboard;
