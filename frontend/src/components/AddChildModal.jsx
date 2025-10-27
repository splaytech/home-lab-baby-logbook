import { useState, useEffect } from 'react';
import { X, Baby, FileText, Activity, Stethoscope, ClipboardList, Heart } from 'lucide-react';

const TABS = [
  { id: 'basic', label: 'Basic Info', icon: Baby },
  { id: 'birth', label: 'Birth Details', icon: Heart },
  { id: 'pregnancy', label: 'Pregnancy', icon: Activity },
  { id: 'delivery', label: 'Delivery', icon: Stethoscope },
  { id: 'screening', label: 'Screening', icon: ClipboardList },
  { id: 'medical', label: 'Medical', icon: FileText },
];

const AddChildModal = ({ isOpen, onClose, onSave, editingChild = null }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    dateOfBirth: '',
    gender: '',
    bloodType: '',

    // Birth Details
    birthType: '',
    examiner: '',
    hospital: '',
    timeOfBirth: '',
    birthWeight: '',
    birthLength: '',
    headCircumference: '',
    estimatedGestation: '',
    apgarScore1: '',
    apgarScore5: '',

    // Pregnancy Details
    pregnancyComplications: '',
    maternalRubellaTitre: '',

    // Labour & Delivery
    labourType: '',
    deliveryType: '',

    // Screening
    bloodspotScreening: '',
    bloodspotScreeningDate: '',

    // Admission
    intensiveCare: false,
    intensiveCareDetails: '',
    specialCare: false,
    specialCareDetails: '',

    // Medical
    allergies: '',
    medicalNotes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingChild) {
      setFormData({
        name: editingChild.name || '',
        dateOfBirth: editingChild.dateOfBirth || '',
        gender: editingChild.gender || '',
        bloodType: editingChild.bloodType || '',
        birthType: editingChild.birthType || '',
        examiner: editingChild.examiner || '',
        hospital: editingChild.hospital || '',
        timeOfBirth: editingChild.timeOfBirth || '',
        birthWeight: editingChild.birthWeight || '',
        birthLength: editingChild.birthLength || '',
        headCircumference: editingChild.headCircumference || '',
        estimatedGestation: editingChild.estimatedGestation || '',
        apgarScore1: editingChild.apgarScore1 || '',
        apgarScore5: editingChild.apgarScore5 || '',
        pregnancyComplications: editingChild.pregnancyComplications || '',
        maternalRubellaTitre: editingChild.maternalRubellaTitre || '',
        labourType: editingChild.labourType || '',
        deliveryType: editingChild.deliveryType || '',
        bloodspotScreening: editingChild.bloodspotScreening || '',
        bloodspotScreeningDate: editingChild.bloodspotScreeningDate || '',
        intensiveCare: editingChild.intensiveCare || false,
        intensiveCareDetails: editingChild.intensiveCareDetails || '',
        specialCare: editingChild.specialCare || false,
        specialCareDetails: editingChild.specialCareDetails || '',
        allergies: editingChild.allergies || '',
        medicalNotes: editingChild.medicalNotes || '',
      });
    } else {
      setFormData({
        name: '',
        dateOfBirth: '',
        gender: '',
        bloodType: '',
        birthType: '',
        examiner: '',
        hospital: '',
        timeOfBirth: '',
        birthWeight: '',
        birthLength: '',
        headCircumference: '',
        estimatedGestation: '',
        apgarScore1: '',
        apgarScore5: '',
        pregnancyComplications: '',
        maternalRubellaTitre: '',
        labourType: '',
        deliveryType: '',
        bloodspotScreening: '',
        bloodspotScreeningDate: '',
        intensiveCare: false,
        intensiveCareDetails: '',
        specialCare: false,
        specialCareDetails: '',
        allergies: '',
        medicalNotes: '',
      });
    }
    setErrors({});
    setActiveTab('basic');
  }, [editingChild, isOpen]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length === 0) {
      newErrors.name = 'Name is required';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else if (new Date(formData.dateOfBirth) > new Date()) {
      newErrors.dateOfBirth = 'Date of birth cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      setActiveTab('basic');
      return;
    }

    // Convert numeric fields to numbers or null, and empty strings to null
    const dataToSave = {
      // Basic Info
      name: formData.name,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender || null,
      bloodType: formData.bloodType || null,
      allergies: formData.allergies || null,
      medicalNotes: formData.medicalNotes || null,

      // Birth Details
      birthType: formData.birthType || null,
      examiner: formData.examiner || null,
      hospital: formData.hospital || null,
      timeOfBirth: formData.timeOfBirth || null,
      birthWeight: formData.birthWeight ? parseFloat(formData.birthWeight) : null,
      birthLength: formData.birthLength ? parseFloat(formData.birthLength) : null,
      headCircumference: formData.headCircumference ? parseFloat(formData.headCircumference) : null,
      estimatedGestation: formData.estimatedGestation ? parseInt(formData.estimatedGestation) : null,
      apgarScore1: formData.apgarScore1 ? parseInt(formData.apgarScore1) : null,
      apgarScore5: formData.apgarScore5 ? parseInt(formData.apgarScore5) : null,

      // Pregnancy Details
      pregnancyComplications: formData.pregnancyComplications || null,
      maternalRubellaTitre: formData.maternalRubellaTitre || null,

      // Labour & Delivery
      labourType: formData.labourType || null,
      deliveryType: formData.deliveryType || null,

      // Screening
      bloodspotScreening: formData.bloodspotScreening || null,
      bloodspotScreeningDate: formData.bloodspotScreeningDate || null,

      // Admission
      intensiveCare: formData.intensiveCare,
      intensiveCareDetails: formData.intensiveCareDetails || null,
      specialCare: formData.specialCare,
      specialCareDetails: formData.specialCareDetails || null,
    };

    onSave(dataToSave);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-display font-bold text-gray-800">
            {editingChild ? 'Edit Child' : 'Add New Child'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-mint-500 text-mint-700'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Child's Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleChange('name')}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.name
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:border-mint-500 focus:ring-mint-200'
                    }`}
                    placeholder="Enter child's full name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange('dateOfBirth')}
                    max={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.dateOfBirth
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:border-mint-500 focus:ring-mint-200'
                    }`}
                  />
                  {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={handleChange('gender')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Type</label>
                  <select
                    value={formData.bloodType}
                    onChange={handleChange('bloodType')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200"
                  >
                    <option value="">Select blood type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
            )}

            {/* Birth Details Tab */}
            {activeTab === 'birth' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Birth Type</label>
                  <select
                    value={formData.birthType}
                    onChange={handleChange('birthType')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200"
                  >
                    <option value="">Select birth type</option>
                    <option value="hospital">Hospital</option>
                    <option value="home_birth">Home Birth</option>
                    <option value="bba">BBA (Born Before Arrival)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hospital/Facility</label>
                  <input
                    type="text"
                    value={formData.hospital}
                    onChange={handleChange('hospital')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200"
                    placeholder="Hospital or birth facility name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Examiner</label>
                  <input
                    type="text"
                    value={formData.examiner}
                    onChange={handleChange('examiner')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200"
                    placeholder="Doctor or midwife name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Time of Birth</label>
                  <input
                    type="time"
                    value={formData.timeOfBirth}
                    onChange={handleChange('timeOfBirth')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Birth Weight (kg)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.birthWeight}
                      onChange={handleChange('birthWeight')}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200"
                      placeholder="3.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Birth Length (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.birthLength}
                      onChange={handleChange('birthLength')}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200"
                      placeholder="50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Head Circumference (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.headCircumference}
                      onChange={handleChange('headCircumference')}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200"
                      placeholder="35"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Estimated Gestation (weeks)</label>
                  <input
                    type="number"
                    value={formData.estimatedGestation}
                    onChange={handleChange('estimatedGestation')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200"
                    placeholder="40"
                    min="20"
                    max="45"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Apgar Score (1 min)</label>
                    <input
                      type="number"
                      value={formData.apgarScore1}
                      onChange={handleChange('apgarScore1')}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200"
                      placeholder="0-10"
                      min="0"
                      max="10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Apgar Score (5 min)</label>
                    <input
                      type="number"
                      value={formData.apgarScore5}
                      onChange={handleChange('apgarScore5')}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200"
                      placeholder="0-10"
                      min="0"
                      max="10"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Pregnancy Tab */}
            {activeTab === 'pregnancy' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pregnancy Complications</label>
                  <textarea
                    value={formData.pregnancyComplications}
                    onChange={handleChange('pregnancyComplications')}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200 resize-none"
                    placeholder="Any complications during pregnancy"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Maternal Rubella Titre</label>
                  <input
                    type="text"
                    value={formData.maternalRubellaTitre}
                    onChange={handleChange('maternalRubellaTitre')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200"
                    placeholder="Rubella titre value"
                  />
                </div>
              </div>
            )}

            {/* Delivery Tab */}
            {activeTab === 'delivery' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Labour Type</label>
                  <select
                    value={formData.labourType}
                    onChange={handleChange('labourType')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200"
                  >
                    <option value="">Select labour type</option>
                    <option value="spontaneous">Spontaneous</option>
                    <option value="induced">Induced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Type</label>
                  <select
                    value={formData.deliveryType}
                    onChange={handleChange('deliveryType')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200"
                  >
                    <option value="">Select delivery type</option>
                    <option value="normal">Normal Vaginal Delivery</option>
                    <option value="breech">Breech</option>
                    <option value="caesarean">Caesarean Section</option>
                    <option value="vacuum_extraction">Vacuum Extraction</option>
                    <option value="forceps">Forceps Delivery</option>
                  </select>
                </div>

                <div className="bg-mint-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Admission Details</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.intensiveCare}
                          onChange={handleChange('intensiveCare')}
                          className="w-5 h-5 text-mint-600 rounded focus:ring-mint-500"
                        />
                        <span className="text-sm font-semibold text-gray-700">Intensive Care Unit (ICU)</span>
                      </label>
                      {formData.intensiveCare && (
                        <textarea
                          value={formData.intensiveCareDetails}
                          onChange={handleChange('intensiveCareDetails')}
                          rows={3}
                          className="w-full mt-2 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200 resize-none"
                          placeholder="ICU admission details and duration"
                        />
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.specialCare}
                          onChange={handleChange('specialCare')}
                          className="w-5 h-5 text-mint-600 rounded focus:ring-mint-500"
                        />
                        <span className="text-sm font-semibold text-gray-700">Special Care Unit (SCU)</span>
                      </label>
                      {formData.specialCare && (
                        <textarea
                          value={formData.specialCareDetails}
                          onChange={handleChange('specialCareDetails')}
                          rows={3}
                          className="w-full mt-2 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200 resize-none"
                          placeholder="Special care admission details and duration"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Screening Tab */}
            {activeTab === 'screening' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Newborn Bloodspot Screening</label>
                  <textarea
                    value={formData.bloodspotScreening}
                    onChange={handleChange('bloodspotScreening')}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200 resize-none"
                    placeholder="Newborn bloodspot screening results or notes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Screening Date</label>
                  <input
                    type="date"
                    value={formData.bloodspotScreeningDate}
                    onChange={handleChange('bloodspotScreeningDate')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200"
                  />
                </div>
              </div>
            )}

            {/* Medical Tab */}
            {activeTab === 'medical' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Allergies</label>
                  <textarea
                    value={formData.allergies}
                    onChange={handleChange('allergies')}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200 resize-none"
                    placeholder="List any known allergies"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Medical Notes</label>
                  <textarea
                    value={formData.medicalNotes}
                    onChange={handleChange('medicalNotes')}
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200 resize-none"
                    placeholder="Any additional medical information or notes"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-mint-500 hover:bg-mint-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {editingChild ? 'Update Child' : 'Add Child'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChildModal;
