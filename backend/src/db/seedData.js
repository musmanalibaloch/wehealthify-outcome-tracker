/**
 * Single source of truth for seed data (2 clinics, sample users and outcomes).
 */
export const clinics = [
  { name: 'Sunrise Physical Therapy', slug: 'sunrise-pt' },
  { name: 'Downtown Wellness Clinic', slug: 'downtown-wellness' },
];

export const usersByClinic = {
  'sunrise-pt': [
    { username: 'sarah@sunrise', password: 'sunrise123' },
    { username: 'mike@sunrise', password: 'sunrise123' },
  ],
  'downtown-wellness': [
    { username: 'jane@downtown', password: 'downtown123' },
    { username: 'david@downtown', password: 'downtown123' },
  ],
};

export function getTestCredentials() {
  return clinics.map((c) => ({
    clinicName: c.name,
    users: usersByClinic[c.slug].map((u) => ({ username: u.username, password: u.password })),
  }));
}

function daysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

export function getOutcomeDocs(createdClinics) {
  const sunrise = createdClinics['sunrise-pt'];
  const downtown = createdClinics['downtown-wellness'];
  return [
    { clinicId: sunrise._id, patientIdentifier: 'John Doe', painScore: 4, mobilityScore: 6, dateRecorded: daysAgo(2) },
    { clinicId: sunrise._id, patientIdentifier: 'Jane Smith', painScore: 7, mobilityScore: 3, dateRecorded: daysAgo(1) },
    { clinicId: sunrise._id, patientIdentifier: 'Bob Wilson', painScore: 2, mobilityScore: 8, dateRecorded: new Date() },
    { clinicId: downtown._id, patientIdentifier: 'Alice Brown', painScore: 5, mobilityScore: 5, dateRecorded: daysAgo(3) },
    { clinicId: downtown._id, patientIdentifier: 'Charlie Lee', painScore: 8, mobilityScore: 2, dateRecorded: daysAgo(1) },
    { clinicId: downtown._id, patientIdentifier: 'Diana Ross', painScore: 3, mobilityScore: 7, dateRecorded: new Date() },
  ];
}
