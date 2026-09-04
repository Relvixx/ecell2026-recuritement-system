'use client';

import { useState } from 'react';

const TEAM_OPTIONS = [
  { value: 'technical', label: 'Technical' },
  { value: 'design', label: 'Design' },
  { value: 'documentation', label: 'Documentation' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'pr', label: 'PR' },
  { value: 'event', label: 'Event' },
  { value: 'research', label: 'Research' }
];

const YEAR_OPTIONS = [
  { value: 'first_year', label: 'First Year' },
  { value: 'second_year', label: 'Second Year' },
  { value: 'third_year', label: 'Third Year' }
];

const STATUS_OPTIONS = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interview', label: 'Interview' },
  { value: 'selected', label: 'Selected' },
  { value: 'rejected', label: 'Rejected' }
];

const AVAILABILITY_OPTIONS = [
  { value: '2_3_hours', label: '2-3 hours' },
  { value: '4_5_hours', label: '4-5 hours' },
  { value: '6_8_hours', label: '6-8 hours' },
  { value: '8_plus_hours', label: '8+ hours' },
  { value: 'depends_on_event_schedule', label: 'Depends on the event schedule' }
];

export default function EditApplicationModal({ application, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    fullName: application.fullName || '',
    email: application.email || '',
    whatsappNumber: application.whatsappNumber || '',
    branch: application.branch || '',
    yearOfStudy: application.yearOfStudy || '',
    primaryTeam: application.primaryTeam || '',
    secondaryTeam: application.secondaryTeam || '',
    hasOtherClubs: application.hasOtherClubs === true,
    otherClubDetails: application.otherClubDetails || '',
    secondaryTeamReason: application.secondaryTeamReason || '',
    whyEcell: application.whyEcell || '',
    whyPrimaryTeam: application.whyPrimaryTeam || '',
    experience: application.experience || '',
    availability: application.availability || '',
    status: application.status || 'submitted',
    internalNotes: application.internalNotes || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(application._id, formData);
      onClose();
    } catch (error) {
      console.error('Error updating application:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Edit Application</h2>
              <p className="text-sm text-gray-600">{application.applicationCode}</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
              x
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">WhatsApp Number</label>
                <input type="tel" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Branch</label>
                <input type="text" name="branch" value={formData.branch} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Year of Study</label>
                <select name="yearOfStudy" value={formData.yearOfStudy} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">Select Year</option>
                  {YEAR_OPTIONS.map(year => (
                    <option key={year.value} value={year.value}>{year.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Primary Team</label>
                <select name="primaryTeam" value={formData.primaryTeam} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">Select Primary Team</option>
                  {TEAM_OPTIONS.map(team => (
                    <option key={team.value} value={team.value}>{team.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Secondary Team</label>
                <select name="secondaryTeam" value={formData.secondaryTeam} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">None</option>
                  {TEAM_OPTIONS.map(team => (
                    <option key={team.value} value={team.value}>{team.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Availability</label>
                <select name="availability" value={formData.availability} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">Select Availability</option>
                  {AVAILABILITY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" name="hasOtherClubs" checked={formData.hasOtherClubs} onChange={handleChange} />
                Part of another club
              </label>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  {STATUS_OPTIONS.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Other Club Details</label>
              <textarea name="otherClubDetails" value={formData.otherClubDetails} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Secondary Team Reason</label>
              <textarea name="secondaryTeamReason" value={formData.secondaryTeamReason} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Why E-CELL</label>
              <textarea name="whyEcell" value={formData.whyEcell} onChange={handleChange} rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Why Primary Team</label>
              <textarea name="whyPrimaryTeam" value={formData.whyPrimaryTeam} onChange={handleChange} rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Experience</label>
              <textarea name="experience" value={formData.experience} onChange={handleChange} rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Internal Notes</label>
              <textarea name="internalNotes" value={formData.internalNotes} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>

            <div className="flex justify-end gap-4">
              <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {loading ? 'Updating...' : 'Update Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}