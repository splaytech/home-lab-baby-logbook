import { Trash2, Edit, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getShortAge, formatDate, getRelativeTime } from '../utils/age';

const ChildrenTable = ({ children, onEdit, onDelete }) => {
  const navigate = useNavigate();

  if (!children || children.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <div className="text-6xl mb-4">👶</div>
        <p className="text-gray-600 text-lg">No children added yet</p>
        <p className="text-gray-500 text-sm mt-2">Click "Add Child" to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-mint-50 border-b border-mint-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Child Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Age
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Date of Birth
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Next Appointment
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {children.map((child) => (
              <tr
                key={child.id}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Child Name */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {child.photoUrl ? (
                      <img
                        src={child.photoUrl}
                        alt={child.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-mint-200 flex items-center justify-center text-mint-700 font-semibold">
                        {child.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <button
                        onClick={() => navigate(`/child/${child.id}`)}
                        className="font-medium text-mint-600 hover:text-mint-700 hover:underline transition-colors text-left"
                      >
                        {child.name}
                      </button>
                      {child.gender && (
                        <div className="text-xs text-gray-500 capitalize">
                          {child.gender}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Age */}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {child.formattedAge || getShortAge(child.dateOfBirth)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {child.ageInDays} days old
                  </div>
                </td>

                {/* Date of Birth */}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {formatDate(child.dateOfBirth)}
                  </div>
                </td>

                {/* Next Appointment */}
                <td className="px-6 py-4">
                  {child.nextAppointment ? (
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-mint-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {child.nextAppointment.title}
                        </div>
                        <div className="text-xs text-gray-600">
                          {formatDate(child.nextAppointment.appointmentDate, 'MMM dd, yyyy h:mm a')}
                        </div>
                        <div className="text-xs text-mint-600 font-medium mt-1">
                          {getRelativeTime(child.nextAppointment.appointmentDate)}
                        </div>
                        {child.nextAppointment.description && (
                          <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {child.nextAppointment.description}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 italic">No upcoming appointments</div>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(child)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(child)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChildrenTable;
