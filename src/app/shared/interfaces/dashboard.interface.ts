export interface DashboardResponse {
  todayBookings: number;
  monthBookings: number;
  newCustomersThisMonth: number;
  recentBookings: RecentBooking[];
  recentCustomers: RecentCustomer[];
}

export interface RecentBooking {
  id: number;
  date: string;
  serviceName: string;
  instructorFirstName: string;
  instructorLastName: string;
  status: string;
}

export interface RecentCustomer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}
