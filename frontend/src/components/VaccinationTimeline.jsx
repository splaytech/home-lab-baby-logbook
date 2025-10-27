import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, AlertCircle, Calendar, Syringe, Plus } from 'lucide-react';
import { formatDate, getFormattedAge } from '../utils/age';
import { differenceInDays } from 'date-fns';

const VaccinationTimeline = ({ timeline, onAddRecord, onViewRecord }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <Syringe className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No vaccination schedule</h3>
          <p className="mt-1 text-sm text-gray-500">
            Select a child to view their vaccination timeline.
          </p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'due_now':
        return <Clock className="h-5 w-5 text-orange-600" />;
      case 'due_soon':
        return <Calendar className="h-5 w-5 text-yellow-600" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      due_now: 'bg-orange-100 text-orange-800',
      due_soon: 'bg-yellow-100 text-yellow-800',
      upcoming: 'bg-gray-100 text-gray-600',
    };
    const labels = {
      completed: 'Completed',
      overdue: 'Overdue',
      due_now: 'Due Now',
      due_soon: 'Due Soon',
      upcoming: 'Upcoming',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  // Group by age label
  const groupedTimeline = timeline.reduce((groups, item) => {
    const { ageLabel } = item;
    if (!groups[ageLabel]) {
      groups[ageLabel] = [];
    }
    groups[ageLabel].push(item);
    return groups;
  }, {});

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 space-y-6">
        {Object.entries(groupedTimeline).map(([ageLabel, items]) => {
          const allCompleted = items.every((item) => item.status === 'completed');
          const hasOverdue = items.some((item) => item.status === 'overdue');
          const hasDueNow = items.some((item) => item.status === 'due_now');

          return (
            <div key={ageLabel} className="relative">
              {/* Age Label Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  allCompleted
                    ? 'bg-green-100'
                    : hasOverdue
                    ? 'bg-red-100'
                    : hasDueNow
                    ? 'bg-orange-100'
                    : 'bg-gray-100'
                }`}>
                  {allCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : hasOverdue ? (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  ) : (
                    <Syringe className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{ageLabel}</h3>
                  <p className="text-sm text-gray-500">
                    {items.length} vaccine{items.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Vaccines in this age group */}
              <div className="ml-14 space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border transition-all ${
                      item.status === 'completed'
                        ? 'bg-green-50 border-green-200'
                        : item.status === 'overdue'
                        ? 'bg-red-50 border-red-200'
                        : item.status === 'due_now'
                        ? 'bg-orange-50 border-orange-200'
                        : item.status === 'due_soon'
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(item.status)}
                          <h4 className="font-medium text-gray-900">
                            {item.vaccineName}
                            {item.shortName && (
                              <span className="text-sm text-gray-500 ml-1">({item.shortName})</span>
                            )}
                          </h4>
                          {item.doseNumber && (
                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                              Dose {item.doseNumber}
                            </span>
                          )}
                        </div>

                        {item.description && (
                          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            {item.status === 'completed' ? (
                              <span>Given: {formatDate(item.givenDate)}</span>
                            ) : (
                              <span>Due: {formatDate(item.dueDate)}</span>
                            )}
                          </div>
                          {item.route && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              {item.route.replace('injection_', '').toUpperCase()}
                            </span>
                          )}
                          {item.isForAtsiOnly && (
                            <span className="text-xs text-purple-700 bg-purple-100 px-2 py-0.5 rounded font-medium">
                              ATSI
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {getStatusBadge(item.status)}
                        {item.status !== 'completed' && item.isAvailable && (
                          <button
                            onClick={() => onAddRecord(item)}
                            className="p-1.5 rounded-lg hover:bg-white transition-colors"
                            title="Record vaccination"
                          >
                            <Plus className="h-4 w-4 text-gray-600" />
                          </button>
                        )}
                        {item.status === 'completed' && (
                          <button
                            onClick={() => onViewRecord(item.recordId)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            View
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VaccinationTimeline;
