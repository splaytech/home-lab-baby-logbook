import React, { useState, useEffect } from 'react';
import { X, Star, Calendar } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

const AddMilestoneModal = ({ isOpen, onClose, onSubmit, child, editingMilestone, templates }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'physical',
    dateAchieved: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    location: '',
    witnesses: '',
    notes: '',
    isImportant: false,
  });

  const [errors, setErrors] = useState({});
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    if (editingMilestone) {
      setFormData({
        title: editingMilestone.title || '',
        category: editingMilestone.category || 'physical',
        dateAchieved: editingMilestone.dateAchieved || format(new Date(), 'yyyy-MM-dd'),
        description: editingMilestone.description || '',
        location: editingMilestone.location || '',
        witnesses: editingMilestone.witnesses || '',
        notes: editingMilestone.notes || '',
        isImportant: editingMilestone.isImportant || false,
      });
    } else {
      setFormData({
        title: '',
        category: 'physical',
        dateAchieved: format(new Date(), 'yyyy-MM-dd'),
        description: '',
        location: '',
        witnesses: '',
        notes: '',
        isImportant: false,
      });
    }
  }, [editingMilestone, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleTemplateSelect = (templateTitle) => {
    setFormData((prev) => ({ ...prev, title: templateTitle }));
    setShowTemplates(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title || formData.title.trim().length === 0) {
      newErrors.title = 'Title is required';
    }

    if (!formData.dateAchieved) {
      newErrors.dateAchieved = 'Date is required';
    } else if (new Date(formData.dateAchieved) > new Date()) {
      newErrors.dateAchieved = 'Date cannot be in the future';
    } else if (new Date(formData.dateAchieved) < new Date(child.dateOfBirth)) {
      newErrors.dateAchieved = 'Date cannot be before birth date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Calculate age in days
    const ageInDays = differenceInDays(
      new Date(formData.dateAchieved),
      new Date(child.dateOfBirth)
    );

    const dataToSave = {
      babyId: child.id,
      title: formData.title,
      category: formData.category,
      dateAchieved: formData.dateAchieved,
      ageInDays,
      description: formData.description || null,
      location: formData.location || null,
      witnesses: formData.witnesses || null,
      notes: formData.notes || null,
      isImportant: formData.isImportant,
    };

    try {
      await onSubmit(dataToSave);
      handleClose();
    } catch (error) {
      console.error('Failed to save milestone:', error);
      setErrors({ submit: 'Failed to save milestone. Please try again.' });
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      category: 'physical',
      dateAchieved: format(new Date(), 'yyyy-MM-dd'),
      description: '',
      location: '',
      witnesses: '',
      notes: '',
      isImportant: false,
    });
    setErrors({});
    setShowTemplates(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-mint-500 to-mint-600 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <Star className="h-6 w-6" />
            <h2 className="text-xl font-bold">
              {editingMilestone ? 'Edit Milestone' : 'Add Milestone'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title with Template Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Milestone Title *
              </label>
              {templates && !showTemplates && (
                <button
                  type="button"
                  onClick={() => setShowTemplates(true)}
                  className="text-sm text-mint-600 hover:text-mint-700 font-medium"
                >
                  Choose from templates
                </button>
              )}
            </div>

            {showTemplates && templates ? (
              <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto mb-2">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-700">Select a template:</p>
                  <button
                    type="button"
                    onClick={() => setShowTemplates(false)}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Close
                  </button>
                </div>
                {Object.entries(templates).map(([category, items]) => (
                  <div key={category} className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      {category.replace('_', ' ')}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {items.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => handleTemplateSelect(item)}
                          className="text-left px-3 py-2 text-sm bg-gray-50 hover:bg-mint-50 hover:text-mint-700 rounded-lg transition-colors"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., First Steps, First Word"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent transition-colors ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Category and Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent transition-colors"
                required
              >
                <option value="physical">Physical</option>
                <option value="communication">Communication</option>
                <option value="social">Social</option>
                <option value="cognitive">Cognitive</option>
                <option value="self_care">Self Care</option>
                <option value="health">Health</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="dateAchieved" className="block text-sm font-medium text-gray-700 mb-2">
                Date Achieved *
              </label>
              <input
                type="date"
                id="dateAchieved"
                name="dateAchieved"
                value={formData.dateAchieved}
                onChange={handleChange}
                max={format(new Date(), 'yyyy-MM-dd')}
                min={child?.dateOfBirth}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent transition-colors ${
                  errors.dateAchieved ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              />
              {errors.dateAchieved && (
                <p className="mt-1 text-sm text-red-600">{errors.dateAchieved}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Tell the story of this special moment..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent transition-colors resize-none"
            />
          </div>

          {/* Location and Witnesses Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Home, Park, Grandma's house"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label htmlFor="witnesses" className="block text-sm font-medium text-gray-700 mb-2">
                Witnesses
              </label>
              <input
                type="text"
                id="witnesses"
                name="witnesses"
                value={formData.witnesses}
                onChange={handleChange}
                placeholder="e.g., Mom, Dad, Grandpa"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              placeholder="Any other details or memories..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent transition-colors resize-none"
            />
          </div>

          {/* Mark as Important */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isImportant"
              name="isImportant"
              checked={formData.isImportant}
              onChange={handleChange}
              className="w-4 h-4 text-mint-600 border-gray-300 rounded focus:ring-mint-500"
            />
            <label htmlFor="isImportant" className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              Mark as important milestone
            </label>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-mint-500 to-mint-600 text-white rounded-lg font-medium hover:from-mint-600 hover:to-mint-700 transition-all shadow-sm hover:shadow"
            >
              {editingMilestone ? 'Update Milestone' : 'Add Milestone'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMilestoneModal;
