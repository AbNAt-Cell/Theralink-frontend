export type User = {
  id: string;
  status: string;
  balance: number;
  firstName: string;
  lastName: string;
  dob: string
  assignedStaff: string[];
  gender: "M" | "F" | "Other";
  primaryInsurance: string;
  startDate: string;
  lastSeenDate: string;
  nextAppointment: string;
  site: string;
  lastEligibilityCheck: {
    status: string;
    date: string;
  };
  createdAt: string;
  updatedAt: string;
}