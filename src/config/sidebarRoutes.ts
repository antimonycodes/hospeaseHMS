// src/config/sidebarRoutes.ts
import { getImageSrc } from "../utils/imageUtils";

export interface SidebarRoute {
  name: string;
  path: string;
  icon: string; // Default icon
  activeIcon: string; // Icon for active state
}

export const sidebarRoutes: Record<string, SidebarRoute[]> = {
  admin: [
    {
      name: "Overview",
      path: "/dashboard/overview",
      icon: getImageSrc("darkdashboarddark.svg"),
      activeIcon: getImageSrc("overviewicon-active.svg"),
    },
    {
      name: "Patients",
      path: "/dashboard/patients",
      icon: getImageSrc("patientsicon.svg"),
      activeIcon: getImageSrc("patientsWhite.svg"),
    },
    {
      name: "Doctors",
      path: "/dashboard/doctors",
      icon: getImageSrc("doctoricon.svg"),
      activeIcon: getImageSrc("doctorsWhite.svg"),
    },
    {
      name: "Consultants",
      path: "/dashboard/consultants",
      icon: getImageSrc("consultanticon.svg"),
      activeIcon: getImageSrc("consultantWhite.svg"),
    },
    {
      name: "Nurses",
      path: "/dashboard/nurses",
      icon: getImageSrc("nursesicon.svg"),
      activeIcon: getImageSrc("nurseWhite.svg"),
    },
    {
      name: "Pharmacy",
      path: "/dashboard/pharmacy",
      icon: getImageSrc("pharmacyicon.svg"),
      activeIcon: getImageSrc("pharmacyWhite.svg"),
    },
    {
      name: "Laboratory",
      path: "/dashboard/laboratory",
      icon: getImageSrc("labicon.svg"),
      activeIcon: getImageSrc("labWhite.svg"),
    },
    {
      name: "Finance",
      path: "/dashboard/finance",
      icon: getImageSrc("financeicon.svg"),
      activeIcon: getImageSrc("financeWhite.svg"),
    },
    {
      name: "Users",
      path: "/dashboard/users",
      icon: getImageSrc("usericon.svg"),
      activeIcon: getImageSrc("usersWhite.svg"),
    },
    // {
    //   name: "Payment",
    //   path: "/dashboard/payment",
    //   icon: getImageSrc("usericon.svg"),
    //   activeIcon: getImageSrc("usersWhite.svg"),
    // },
    {
      name: "Profile",
      path: "/dashboard/profile",
      icon: getImageSrc("usericon.svg"),
      activeIcon: getImageSrc("usersWhite.svg"),
    },
  ],
  doctor: [
    {
      name: "Overview",
      path: "/dashboard/overview",
      icon: getImageSrc("darkdashboarddark.svg"),
      activeIcon: getImageSrc("overviewicon-active.svg"),
    },
    {
      name: "Patients",
      path: "/dashboard/patients",
      icon: getImageSrc("patientsicon.svg"),
      activeIcon: getImageSrc("patienticonsLight.svg"),
    },
    {
      name: "Appointments",
      path: "/dashboard/appointments",
      icon: getImageSrc("appointmentsdark.svg"),
      activeIcon: getImageSrc("appointmentLight.svg"),
    },
    {
      name: "Shifts",
      path: "/dashboard/shifts",
      icon: getImageSrc("appointmentsdark.svg"),
      activeIcon: getImageSrc("appointmentLight.svg"),
    },
  ],
  frontdesk: [
    {
      name: "Overview",
      path: "/dashboard/overview",
      icon: getImageSrc("darkdashboarddark.svg"),
      activeIcon: getImageSrc("overviewicon.svg"),
    },
    {
      name: "Patients",
      path: "/dashboard/patients",
      icon: getImageSrc("patientsicon.svg"),
      activeIcon: getImageSrc("patienticonsLight.svg"),
    },
    {
      name: "Appointments",
      path: "/dashboard/appointments",
      icon: getImageSrc("appointmentsdark.svg"),
      activeIcon: getImageSrc("appointmentLight.svg"),
    },
  ],
  laboratory: [
    {
      name: "Overview",
      path: "/dashboard/overview",
      icon: getImageSrc("darkdashboarddark.svg"),
      activeIcon: getImageSrc("overviewicon.svg"),
    },
    {
      name: "Patients",
      path: "/dashboard/patients",
      icon: getImageSrc("patientsicon.svg"),
      activeIcon: getImageSrc("patienticonsLight.svg"),
    },
  ],
  finance: [
    {
      name: "Overview",
      path: "/dashboard/overview",
      icon: getImageSrc("darkdashboarddark.svg"),
      activeIcon: getImageSrc("overviewicon.svg"),
    },
    {
      name: "Payments",
      path: "/dashboard/payment",
      icon: getImageSrc("patientsicon.svg"),
      activeIcon: getImageSrc("patienticonsLight.svg"),
    },
    {
      name: "Expenses",
      path: "/dashboard/expenses",
      icon: getImageSrc("patientsicon.svg"),
      activeIcon: getImageSrc("patienticonsLight.svg"),
    },
  ],
  pharmacy: [
    {
      name: "Overview",
      path: "/dashboard/overview",
      icon: getImageSrc("darkdashboarddark.svg"),
      activeIcon: getImageSrc("overviewicon.svg"),
    },
    {
      name: "Patients",
      path: "/dashboard/patients",
      icon: getImageSrc("patientsicon.svg"),
      activeIcon: getImageSrc("patienticonsLight.svg"),
    },
    {
      name: "Inventory",
      path: "/dashboard/inventory",
      icon: getImageSrc("pharmacyicon.svg"),
      activeIcon: getImageSrc("pharmacyWhite.svg"),
    },
  ],
  inventory: [
    {
      name: "Overview",
      path: "/dashboard/overview",
      icon: getImageSrc("darkdashboarddark.svg"),
      activeIcon: getImageSrc("overviewicon.svg"),
    },
    {
      name: "Stocks",
      path: "/dashboard/stocks",
      icon: getImageSrc("patientsicon.svg"),
      activeIcon: getImageSrc("patienticonsLight.svg"),
    },
    {
      name: "Request",
      path: "/dashboard/request",
      icon: getImageSrc("pharmacyicon.svg"),
      activeIcon: getImageSrc("pharmacyWhite.svg"),
    },
  ],
  nurses: [
    {
      name: "Overview",
      path: "/dashboard/overview",
      icon: getImageSrc("darkdashboarddark.svg"),
      activeIcon: getImageSrc("overviewicon.svg"),
    },
    {
      name: "Patients",
      path: "/dashboard/patients",
      icon: getImageSrc("patientsicon.svg"),
      activeIcon: getImageSrc("patienticonsLight.svg"),
    },
    {
      name: "Shifts",
      path: "/dashboard/shifts",
      icon: getImageSrc("pharmacyicon.svg"),
      activeIcon: getImageSrc("pharmacyWhite.svg"),
    },
  ],
  matron: [
    {
      name: "Overview",
      path: "/dashboard/overview",
      icon: getImageSrc("darkdashboarddark.svg"),
      activeIcon: getImageSrc("overviewicon.svg"),
    },
    {
      name: "Nurse",
      path: "/dashboard/nurses",
      icon: getImageSrc("pharmacyicon.svg"),
      activeIcon: getImageSrc("pharmacyWhite.svg"),
    },
    {
      name: "Patients",
      path: "/dashboard/patients",
      icon: getImageSrc("patientsicon.svg"),
      activeIcon: getImageSrc("patienticonsLight.svg"),
    },
  ],
  consultant: [
    {
      name: "Patients",
      path: "/dashboard/patients",
      icon: getImageSrc("patientsicon.svg"),
      activeIcon: getImageSrc("patienticonsLight.svg"),
    },
  ],
};
