import { Trash2, Edit, Calendar, MapPin, User } from 'lucide-react';
import { formatDate, getRelativeTime } from '../utils/age';

const AppointmentTypeLabels = {
  checkup: 'Checkup',
  vaccination: 'Vaccination',
  sick_visit: 'Sick Visit',
  specialist: 'Specialist',
  other: 'Other',
};

const AppointmentTypeColors = {
  checkup: 'bg-blue-100 text-blue-800',
  vaccination: 'bg-green-100 text-green-800',
  sick_visit: 'bg-red-100 text-red-800',
  specialist: 'bg-purple-100 text-purple-800',
  other: 'bg-gray-100 text-gray-800',
};

const AppointmentsTable = ({ appointments, onEdit, onDelete }) => {
  if (!appointments || appointments.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <div className="text-6xl mb-4">📅</div>
        <p className="text-gray-600 text-lg">No appointments scheduled</p>
        <p className="text-gray-500 text-sm mt-2">Click "Add Appointment" to schedule one</p>
      </div>
    );
  }

  // Sort appointments by date (upcoming first)
  const sortedAppointments = [...appointments].sort((a, b) => {
    return new Date(a.appointmentDate) - new Date(b.appointmentDate);
  });

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-sky-50 border-b border-sky-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Appointment
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Child
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Date & Time
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Details
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedAppointments.map((appointment) => {
              const isUpcoming = new Date(appointment.appointmentDate) > new Date();
              const isPast = new Date(appointment.appointmentDate) < new Date();

              return (
                <tr
                  key={appointment.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    isPast ? 'opacity-60' : ''
                  }`}
                >
                  {/* Appointment Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-sky-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{appointment.title}</div>
                        {appointment.description && (
                          <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {appointment.description}
                          </div>
                        )}
                        <div className="mt-2">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              AppointmentTypeColors[appointment.appointmentType] || AppointmentTypeColors.other
                            }`}
                          >
                            {AppointmentTypeLabels[appointment.appointmentType] || 'Other'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Child Name */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {appointment.baby?.name || 'N/A'}
                    </div>
                  </td>

                  {/* Date & Time */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {formatDate(appointment.appointmentDate, 'MMM dd, yyyy')}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(appointment.appointmentDate, 'h:mm a')}
                    </div>
                    <div
                      className={`text-xs font-medium mt-1 ${
                        isUpcoming ? 'text-mint-600' : 'text-gray-500'
                      }`}
                    >
                      {getRelativeTime(appointment.appointmentDate)}
                    </div>
                  </td>

                  {/* Details */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {appointment.doctorName && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4 text-gray-400" />
                          <span>{appointment.doctorName}</span>
                        </div>
                      )}
                      {appointment.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="line-clamp-1">{appointment.location}</span>
                        </div>
                      )}
                      {!appointment.doctorName && !appointment.location && (
                        <span className="text-sm text-gray-400 italic">No details</span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(appointment)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(appointment)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentsTable;
