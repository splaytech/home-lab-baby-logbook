import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  Calendar,
  Baby,
  Heart,
  TrendingUp,
  Syringe,
  Star,
  Plus,
  Edit2,
  Activity
} from 'lucide-react';
import { getBabyById, getAllMilestones, createMilestone, updateMilestone, deleteMilestone, getMilestoneTemplates, updateBaby } from '../services/api';
import { getFormattedAge, formatDate } from '../utils/age';
import AddMilestoneModal from '../components/AddMilestoneModal';
import AddChildModal from '../components/AddChildModal';

const ChildDetail = () => {
  const { childId } = useParams();
  const navigate = useNavigate();

  const [child, setChild] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddMilestoneModalOpen, setIsAddMilestoneModalOpen] = useState(false);
  const [isEditChildModalOpen, setIsEditChildModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [milestoneTemplates, setMilestoneTemplates] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchChildDetails();
    fetchMilestones();
    fetchMilestoneTemplates();
  }, [childId]);

  const fetchChildDetails = async () => {
    try {
      setLoading(true);
      const response = await getBabyById(childId);
      setChild(response.data);
    } catch (error) {
      console.error('Error fetching child details:', error);
      toast.error('Failed to load child details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchMilestones = async () => {
    try {
      const params = selectedCategory !== 'all' ? { category: selectedCategory } : {};
      const response = await getAllMilestones(childId, params);
      setMilestones(response.data || []);
    } catch (error) {
      console.error('Error fetching milestones:', error);
      toast.error('Failed to load milestones');
    }
  };

  const fetchMilestoneTemplates = async () => {
    try {
      const response = await getMilestoneTemplates();
      setMilestoneTemplates(response.data);
    } catch (error) {
      console.error('Error fetching milestone templates:', error);
    }
  };

  const handleAddMilestone = async (milestoneData) => {
    try {
      await createMilestone(milestoneData);
      toast.success('Milestone added successfully!');
      setIsAddMilestoneModalOpen(false);
      fetchMilestones();
    } catch (error) {
      console.error('Error adding milestone:', error);
      toast.error(error.response?.data?.message || 'Failed to add milestone');
    }
  };

  const handleEditMilestone = (milestone) => {
    setEditingMilestone(milestone);
    setIsAddMilestoneModalOpen(true);
  };

  const handleUpdateMilestone = async (milestoneData) => {
    try {
      await updateMilestone(editingMilestone.id, milestoneData);
      toast.success('Milestone updated successfully!');
      setIsAddMilestoneModalOpen(false);
      setEditingMilestone(null);
      fetchMilestones();
    } catch (error) {
      console.error('Error updating milestone:', error);
      toast.error(error.response?.data?.message || 'Failed to update milestone');
    }
  };

  const handleDeleteMilestone = async (milestoneId) => {
    if (!window.confirm('Are you sure you want to delete this milestone?')) {
      return;
    }

    try {
      await deleteMilestone(milestoneId);
      toast.success('Milestone deleted successfully');
      fetchMilestones();
    } catch (error) {
      console.error('Error deleting milestone:', error);
      toast.error(error.response?.data?.message || 'Failed to delete milestone');
    }
  };

  const handleCloseMilestoneModal = () => {
    setIsAddMilestoneModalOpen(false);
    setEditingMilestone(null);
  };

  const handleUpdateChild = async (childData) => {
    try {
      await updateBaby(childId, childData);
      toast.success('Child information updated successfully!');
      setIsEditChildModalOpen(false);
      fetchChildDetails();
    } catch (error) {
      console.error('Error updating child:', error);
      toast.error(error.response?.data?.message || 'Failed to update child information');
    }
  };

  useEffect(() => {
    if (activeTab === 'milestones') {
      fetchMilestones();
    }
  }, [selectedCategory, activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 via-mint-50 to-coral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🦕</div>
          <p className="text-gray-600">Loading child details...</p>
        </div>
      </div>
    );
  }

  if (!child) {
    return null;
  }

  // Group milestones by category for overview
  const milestonesByCategory = milestones.reduce((acc, m) => {
    acc[m.category] = (acc[m.category] || 0) + 1;
    return acc;
  }, {});

  const categoryIcons = {
    physical: Activity,
    communication: '💬',
    social: '👥',
    cognitive: '🧠',
    self_care: '🛁',
    health: Heart,
    other: Star,
  };

  const categoryColors = {
    physical: 'bg-blue-100 text-blue-800',
    communication: 'bg-purple-100 text-purple-800',
    social: 'bg-pink-100 text-pink-800',
    cognitive: 'bg-yellow-100 text-yellow-800',
    self_care: 'bg-green-100 text-green-800',
    health: 'bg-red-100 text-red-800',
    other: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-mint-50 to-coral-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-mint-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-display font-bold text-mint-700">
                {child.name}'s Profile
              </h1>
              <p className="text-sm text-gray-600">
                Born {formatDate(child.dateOfBirth)} • {getFormattedAge(child.dateOfBirth)}
              </p>
            </div>
            <button
              onClick={() => setIsEditChildModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-mint-500 text-white rounded-lg hover:bg-mint-600 transition-colors shadow-sm"
            >
              <Edit2 className="w-4 h-4" />
              Edit Details
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Child Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-mint-100 rounded-full flex items-center justify-center">
                <Baby className="w-6 h-6 text-mint-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Age</p>
                <p className="text-xl font-bold text-gray-900">{child.ageInDays} days</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-coral-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-coral-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Birthday</p>
                <p className="text-xl font-bold text-gray-900">{formatDate(child.dateOfBirth)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sunny-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-sunny-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Milestones</p>
                <p className="text-xl font-bold text-gray-900">{milestones.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-lavender-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-lavender-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Gender</p>
                <p className="text-xl font-bold text-gray-900 capitalize">
                  {child.gender || 'Not set'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-mint-500 text-mint-700'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('milestones')}
                className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'milestones'
                    ? 'border-b-2 border-mint-500 text-mint-700'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Milestones
              </button>
              <button
                onClick={() => setActiveTab('health')}
                className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'health'
                    ? 'border-b-2 border-mint-500 text-mint-700'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Health & Medical
              </button>
              <button
                onClick={() => setActiveTab('birth')}
                className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'birth'
                    ? 'border-b-2 border-mint-500 text-mint-700'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Birth Details
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Milestones
                  </h3>
                  {milestones.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Star className="mx-auto h-12 w-12 text-gray-300" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No milestones yet</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Start tracking {child.name}'s special moments!
                      </p>
                      <button
                        onClick={() => {
                          setActiveTab('milestones');
                          setIsAddMilestoneModalOpen(true);
                        }}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-mint-500 text-white rounded-lg hover:bg-mint-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add First Milestone
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {milestones.slice(0, 6).map((milestone) => (
                        <div
                          key={milestone.id}
                          className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-mint-300 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[milestone.category]}`}>
                              {milestone.category.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {formatDate(milestone.dateAchieved)} • {getFormattedAge(child.dateOfBirth, milestone.ageInDays)} old
                          </p>
                          {milestone.description && (
                            <p className="text-sm text-gray-700 line-clamp-2">{milestone.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Milestone Categories
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(milestonesByCategory).map(([category, count]) => (
                      <div
                        key={category}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center"
                      >
                        <div className="text-2xl mb-2">
                          {typeof categoryIcons[category] === 'string'
                            ? categoryIcons[category]
                            : '📌'}
                        </div>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {category.replace('_', ' ')}
                        </p>
                        <p className="text-2xl font-bold text-mint-600">{count}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Milestones Tab */}
            {activeTab === 'milestones' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">Filter:</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent"
                    >
                      <option value="all">All Categories</option>
                      <option value="physical">Physical</option>
                      <option value="communication">Communication</option>
                      <option value="social">Social</option>
                      <option value="cognitive">Cognitive</option>
                      <option value="self_care">Self Care</option>
                      <option value="health">Health</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setIsAddMilestoneModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-mint-500 text-white rounded-lg hover:bg-mint-600 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Milestone
                  </button>
                </div>

                {/* Milestones Timeline */}
                <div className="space-y-4">
                  {milestones.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Star className="mx-auto h-12 w-12 text-gray-300" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No milestones in this category</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Add a milestone to start tracking!
                      </p>
                    </div>
                  ) : (
                    milestones.map((milestone, index) => (
                      <div
                        key={milestone.id}
                        className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-0 last:pb-0"
                      >
                        <div className="absolute left-0 top-0 w-4 h-4 -ml-2 rounded-full bg-mint-500 border-4 border-white"></div>
                        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                                {milestone.isImportant && (
                                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                                <span>{formatDate(milestone.dateAchieved)}</span>
                                <span>•</span>
                                <span>{getFormattedAge(child.dateOfBirth, milestone.ageInDays)} old</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${categoryColors[milestone.category]}`}>
                                  {milestone.category.replace('_', ' ')}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditMilestone(milestone)}
                                className="p-1.5 text-gray-600 hover:text-mint-600 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {milestone.description && (
                            <p className="text-sm text-gray-700 mb-2">{milestone.description}</p>
                          )}

                          {(milestone.location || milestone.witnesses) && (
                            <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                              {milestone.location && (
                                <span>📍 {milestone.location}</span>
                              )}
                              {milestone.witnesses && (
                                <span>👥 {milestone.witnesses}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Health Info Tab */}
            {activeTab === 'health' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Blood Type</p>
                    <p className="text-lg font-medium text-gray-900">{child.bloodType || 'Not recorded'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Allergies</p>
                    <p className="text-lg font-medium text-gray-900">{child.allergies || 'None recorded'}</p>
                  </div>
                </div>

                {child.medicalNotes && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Medical Notes</p>
                    <p className="text-gray-900 whitespace-pre-wrap">{child.medicalNotes}</p>
                  </div>
                )}

                {/* Newborn Screening */}
                {(child.bloodspotScreening || child.bloodspotScreeningDate) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Newborn Screening</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {child.bloodspotScreening && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Bloodspot Screening Result</p>
                          <p className="text-gray-900">{child.bloodspotScreening}</p>
                        </div>
                      )}
                      {child.bloodspotScreeningDate && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Screening Date</p>
                          <p className="text-gray-900">{formatDate(child.bloodspotScreeningDate)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Admission Details */}
                {(child.intensiveCare || child.specialCare) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Admission Details</h3>
                    {child.intensiveCare && (
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200 mb-3">
                        <p className="text-sm font-medium text-red-900 mb-2">Intensive Care Unit (ICU)</p>
                        {child.intensiveCareDetails && (
                          <p className="text-sm text-red-800">{child.intensiveCareDetails}</p>
                        )}
                      </div>
                    )}
                    {child.specialCare && (
                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm font-medium text-yellow-900 mb-2">Special Care Unit (SCU)</p>
                        {child.specialCareDetails && (
                          <p className="text-sm text-yellow-800">{child.specialCareDetails}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Birth Details Tab */}
            {activeTab === 'birth' && (
              <div className="space-y-6">
                {/* Birth Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Birth Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {child.birthType && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Birth Type</p>
                        <p className="text-lg font-medium text-gray-900 capitalize">{child.birthType.replace('_', ' ')}</p>
                      </div>
                    )}
                    {child.hospital && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Hospital/Location</p>
                        <p className="text-lg font-medium text-gray-900">{child.hospital}</p>
                      </div>
                    )}
                    {child.examiner && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Examiner</p>
                        <p className="text-lg font-medium text-gray-900">{child.examiner}</p>
                      </div>
                    )}
                    {child.timeOfBirth && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Time of Birth</p>
                        <p className="text-lg font-medium text-gray-900">{child.timeOfBirth}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Baby's Measurements */}
                {(child.birthWeight || child.birthLength || child.headCircumference || child.estimatedGestation) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Baby's Measurements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {child.birthWeight && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Birth Weight</p>
                          <p className="text-2xl font-bold text-blue-900">{child.birthWeight} kg</p>
                        </div>
                      )}
                      {child.birthLength && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Birth Length</p>
                          <p className="text-2xl font-bold text-blue-900">{child.birthLength} cm</p>
                        </div>
                      )}
                      {child.headCircumference && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Head Circumference</p>
                          <p className="text-2xl font-bold text-blue-900">{child.headCircumference} cm</p>
                        </div>
                      )}
                      {child.estimatedGestation && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Estimated Gestation</p>
                          <p className="text-2xl font-bold text-blue-900">{child.estimatedGestation} weeks</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Apgar Scores */}
                {(child.apgarScore1 || child.apgarScore5) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Apgar Scores</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {child.apgarScore1 !== null && child.apgarScore1 !== undefined && (
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">1 Minute Score</p>
                          <p className="text-3xl font-bold text-green-900">{child.apgarScore1}/10</p>
                        </div>
                      )}
                      {child.apgarScore5 !== null && child.apgarScore5 !== undefined && (
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">5 Minutes Score</p>
                          <p className="text-3xl font-bold text-green-900">{child.apgarScore5}/10</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Pregnancy Details */}
                {(child.pregnancyComplications || child.maternalRubellaTitre) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Pregnancy Details</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {child.maternalRubellaTitre && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Maternal Rubella Titre</p>
                          <p className="text-gray-900">{child.maternalRubellaTitre}</p>
                        </div>
                      )}
                      {child.pregnancyComplications && (
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <p className="text-sm font-medium text-orange-900 mb-2">Pregnancy Complications</p>
                          <p className="text-sm text-orange-800 whitespace-pre-wrap">{child.pregnancyComplications}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Labour & Delivery */}
                {(child.labourType || child.deliveryType) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Labour & Delivery</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {child.labourType && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Labour Type</p>
                          <p className="text-lg font-medium text-gray-900 capitalize">{child.labourType}</p>
                        </div>
                      )}
                      {child.deliveryType && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Delivery Type</p>
                          <p className="text-lg font-medium text-gray-900 capitalize">{child.deliveryType.replace('_', ' ')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add/Edit Milestone Modal */}
      <AddMilestoneModal
        isOpen={isAddMilestoneModalOpen}
        onClose={handleCloseMilestoneModal}
        onSubmit={editingMilestone ? handleUpdateMilestone : handleAddMilestone}
        child={child}
        editingMilestone={editingMilestone}
        templates={milestoneTemplates}
      />

      {/* Edit Child Modal */}
      <AddChildModal
        isOpen={isEditChildModalOpen}
        onClose={() => setIsEditChildModalOpen(false)}
        onSave={handleUpdateChild}
        editingChild={child}
      />
    </div>
  );
};

export default ChildDetail;
