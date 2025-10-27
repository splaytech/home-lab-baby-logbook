import React, { useState, useEffect } from 'react';
import { X, TrendingUp } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

const AddGrowthModal = ({ isOpen, onClose, onSubmit, children, editingRecord }) => {
  const [formData, setFormData] = useState({
    babyId: '',
    recordDate: format(new Date(), 'yyyy-MM-dd'),
    weight: '',
    height: '',
    headCircumference: '',
    comments: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        babyId: editingRecord.babyId,
        recordDate: editingRecord.recordDate,
        weight: editingRecord.weight || '',
        height: editingRecord.height || '',
        headCircumference: editingRecord.headCircumference || '',
        comments: editingRecord.comments || '',
      });
    } else if (children && children.length > 0) {
      setFormData((prev) => ({
        ...prev,
        babyId: children[0].id,
      }));
    }
  }, [editingRecord, children]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.babyId) {
      newErrors.babyId = 'Please select a child';
    }

    if (!formData.recordDate) {
      newErrors.recordDate = 'Record date is required';
    }

    // At least one measurement is required
    if (!formData.weight && !formData.height && !formData.headCircumference) {
      newErrors.measurements = 'At least one measurement (weight, height, or head circumference) is required';
    }

    // Validate numeric values
    if (formData.weight && (isNaN(formData.weight) || parseFloat(formData.weight) <= 0)) {
      newErrors.weight = 'Weight must be a positive number';
    }

    if (formData.height && (isNaN(formData.height) || parseFloat(formData.height) <= 0)) {
      newErrors.height = 'Height must be a positive number';
    }

    if (formData.headCircumference && (isNaN(formData.headCircumference) || parseFloat(formData.headCircumference) <= 0)) {
      newErrors.headCircumference = 'Head circumference must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Find the selected baby to calculate age
    const selectedBaby = children.find((child) => child.id === formData.babyId);
    if (!selectedBaby) {
      setErrors({ babyId: 'Selected child not found' });
      return;
    }

    // Calculate age in days
    const ageInDays = differenceInDays(new Date(formData.recordDate), new Date(selectedBaby.dateOfBirth));

    if (ageInDays < 0) {
      setErrors({ recordDate: 'Record date cannot be before birth date' });
      return;
    }

    // Prepare data for submission
    const dataToSave = {
      babyId: formData.babyId,
      recordDate: formData.recordDate,
      ageInDays,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      height: formData.height ? parseFloat(formData.height) : null,
      headCircumference: formData.headCircumference ? parseFloat(formData.headCircumference) : null,
      comments: formData.comments || null,
    };

    try {
      await onSubmit(dataToSave);
      handleClose();
    } catch (error) {
      console.error('Failed to save growth record:', error);
      setErrors({ submit: 'Failed to save growth record. Please try again.' });
    }
  };

  const handleClose = () => {
    setFormData({
      babyId: children && children.length > 0 ? children[0].id : '',
      recordDate: format(new Date(), 'yyyy-MM-dd'),
      weight: '',
      height: '',
      headCircumference: '',
      comments: '',
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-mint-500 to-mint-600 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6" />
            <h2 className="text-xl font-bold">
              {editingRecord ? 'Edit Growth Record' : 'Add Growth Record'}
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
          {/* Child Selection */}
          <div>
            <label htmlFor="babyId" className="block text-sm font-medium text-gray-700 mb-2">
              Child *
            </label>
            <select
              id="babyId"
              name="babyId"
              value={formData.babyId}
              onChange={handleChange}
              disabled={editingRecord}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent transition-colors ${
                errors.babyId ? 'border-red-300' : 'border-gray-300'
              } ${editingRecord ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              required
            >
              <option value="">Select a child</option>
              {children &&
                children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.name}
                  </option>
                ))}
            </select>
            {errors.babyId && <p className="mt-1 text-sm text-red-600">{errors.babyId}</p>}
          </div>

          {/* Record Date */}
          <div>
            <label htmlFor="recordDate" className="block text-sm font-medium text-gray-700 mb-2">
              Record Date *
            </label>
            <input
              type="date"
              id="recordDate"
              name="recordDate"
              value={formData.recordDate}
              onChange={handleChange}
              max={format(new Date(), 'yyyy-MM-dd')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent transition-colors ${
                errors.recordDate ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            />
            {errors.recordDate && <p className="mt-1 text-sm text-red-600">{errors.recordDate}</p>}
          </div>

          {/* Measurements Section */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Measurements
            </h3>
            {errors.measurements && (
              <p className="text-sm text-red-600">{errors.measurements}</p>
            )}

            {/* Weight */}
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="e.g., 3.5"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent transition-colors ${
                  errors.weight ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
            </div>

            {/* Height */}
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                Height/Length (cm)
              </label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="e.g., 50.5"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent transition-colors ${
                  errors.height ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.height && <p className="mt-1 text-sm text-red-600">{errors.height}</p>}
            </div>

            {/* Head Circumference */}
            <div>
              <label htmlFor="headCircumference" className="block text-sm font-medium text-gray-700 mb-2">
                Head Circumference (cm)
              </label>
              <input
                type="number"
                id="headCircumference"
                name="headCircumference"
                value={formData.headCircumference}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="e.g., 35.2"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent transition-colors ${
                  errors.headCircumference ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.headCircumference && (
                <p className="mt-1 text-sm text-red-600">{errors.headCircumference}</p>
              )}
            </div>
          </div>

          {/* Comments */}
          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
              Comments
            </label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              rows={3}
              placeholder="Any observations or notes..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent transition-colors resize-none"
            />
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
              {editingRecord ? 'Update Record' : 'Add Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGrowthModal;
