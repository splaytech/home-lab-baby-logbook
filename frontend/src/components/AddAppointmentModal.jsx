import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AddAppointmentModal = ({ isOpen, onClose, onSave, children, editingAppointment = null }) => {
  const [formData, setFormData] = useState({
    babyId: '',
    title: '',
    description: '',
    appointmentDate: '',
    appointmentTime: '',
    location: '',
    doctorName: '',
    appointmentType: 'checkup',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingAppointment) {
      // Parse the appointment date
      const dateObj = new Date(editingAppointment.appointmentDate);
      const date = dateObj.toISOString().split('T')[0];
      const time = dateObj.toTimeString().slice(0, 5);

      setFormData({
        babyId: editingAppointment.babyId || '',
        title: editingAppointment.title || '',
        description: editingAppointment.description || '',
        appointmentDate: date,
        appointmentTime: time,
        location: editingAppointment.location || '',
        doctorName: editingAppointment.doctorName || '',
        appointmentType: editingAppointment.appointmentType || 'checkup',
        notes: editingAppointment.notes || '',
      });
    } else {
      setFormData({
        babyId: '',
        title: '',
        description: '',
        appointmentDate: '',
        appointmentTime: '',
        location: '',
        doctorName: '',
        appointmentType: 'checkup',
        notes: '',
      });
    }
    setErrors({});
  }, [editingAppointment, isOpen]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.babyId) {
      newErrors.babyId = 'Please select a child';
    }

    if (!formData.title || formData.title.trim().length === 0) {
      newErrors.title = 'Title is required';
    }

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Appointment date is required';
    }

    if (!formData.appointmentTime) {
      newErrors.appointmentTime = 'Appointment time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Combine date and time into ISO string
    const appointmentDateTime = new Date(
      `${formData.appointmentDate}T${formData.appointmentTime}`
    ).toISOString();

    const dataToSave = {
      babyId: formData.babyId,
      title: formData.title,
      description: formData.description,
      appointmentDate: appointmentDateTime,
      location: formData.location,
      doctorName: formData.doctorName,
      appointmentType: formData.appointmentType,
      notes: formData.notes,
    };

    onSave(dataToSave);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-display font-bold text-gray-800">
            {editingAppointment ? 'Edit Appointment' : 'Add New Appointment'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Select Child */}
          <div>
            <label htmlFor="babyId" className="block text-sm font-semibold text-gray-700 mb-2">
              Select Child <span className="text-red-500">*</span>
            </label>
            <select
              id="babyId"
              value={formData.babyId}
              onChange={handleChange('babyId')}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.babyId
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-300 focus:border-mint-500 focus:ring-mint-200'
              }`}
            >
              <option value="">Choose a child</option>
              {children && children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </select>
            {errors.babyId && <p className="mt-1 text-sm text-red-600">{errors.babyId}</p>}
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Appointment Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleChange('title')}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.title
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-300 focus:border-mint-500 focus:ring-mint-200'
              }`}
              placeholder="e.g., 6-month checkup, Vaccination"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Appointment Type */}
          <div>
            <label htmlFor="appointmentType" className="block text-sm font-semibold text-gray-700 mb-2">
              Appointment Type
            </label>
            <select
              id="appointmentType"
              value={formData.appointmentType}
              onChange={handleChange('appointmentType')}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200 transition-colors"
            >
              <option value="checkup">Regular Checkup</option>
              <option value="vaccination">Vaccination</option>
              <option value="sick_visit">Sick Visit</option>
              <option value="specialist">Specialist</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="appointmentDate" className="block text-sm font-semibold text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange('appointmentDate')}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.appointmentDate
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:border-mint-500 focus:ring-mint-200'
                }`}
              />
              {errors.appointmentDate && <p className="mt-1 text-sm text-red-600">{errors.appointmentDate}</p>}
            </div>

            <div>
              <label htmlFor="appointmentTime" className="block text-sm font-semibold text-gray-700 mb-2">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                id="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange('appointmentTime')}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.appointmentTime
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:border-mint-500 focus:ring-mint-200'
                }`}
              />
              {errors.appointmentTime && <p className="mt-1 text-sm text-red-600">{errors.appointmentTime}</p>}
            </div>
          </div>

          {/* Doctor Name */}
          <div>
            <label htmlFor="doctorName" className="block text-sm font-semibold text-gray-700 mb-2">
              Doctor/Provider Name
            </label>
            <input
              type="text"
              id="doctorName"
              value={formData.doctorName}
              onChange={handleChange('doctorName')}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200 transition-colors"
              placeholder="Dr. Smith"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={handleChange('location')}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200 transition-colors"
              placeholder="Clinic name or address"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Brief Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange('description')}
              rows={2}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200 transition-colors resize-none"
              placeholder="Brief description of the appointment"
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={handleChange('notes')}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-200 transition-colors resize-none"
              placeholder="Any additional notes or reminders"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
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
              {editingAppointment ? 'Update Appointment' : 'Add Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAppointmentModal;
