// src/config/sidebarRoutes.ts
import { getImageSrc } from "../utils/imageUtils";

export interface SidebarRoute {
  name: string;
  path: string;
  icon: string; // Default icon
  activeIcon: string; // Icon for active state
  children?: SidebarRoute[]; // Optional nested routes
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
      children: [
        {
          name: "Users",
          path: "/dashboard/pharmacy/staffs",
          icon: getImageSrc("usericon.svg"),
          activeIcon: getImageSrc("usersWhite.svg"),
        },
        {
          name: "Info",
          path: "/dashboard/pharmacy/info",
          icon: getImageSrc("patientsicon.svg"),
          activeIcon: getImageSrc("patienticonsLight.svg"),
        },
      ],
    },
    {
      name: "Inventory",
      path: "/dashboard/Inventory",
      icon: getImageSrc("inventory-active.svg"),
      activeIcon: getImageSrc("inventory-default.svg"),
    },
    {
      name: "Laboratory",
      path: "/dashboard/laboratory",
      icon: getImageSrc("labicon.svg"),
      activeIcon: getImageSrc("labWhite.svg"),
      children: [
        {
          name: "Staffs",
          path: "/dashboard/laboratory/staffs",
          icon: getImageSrc("staffs.svg"),
          activeIcon: getImageSrc("usersWhite.svg"),
        },
        {
          name: "Info",
          path: "/dashboard/laboratory/info",
          icon: getImageSrc("patientsicon.svg"),
          activeIcon: getImageSrc("patienticonsLight.svg"),
        },
      ],
    },
    {
      name: "Finance",
      path: "/dashboard/finance",
      icon: getImageSrc("financeicon.svg"),
      activeIcon: getImageSrc("financeWhite.svg"),
      children: [
        {
          name: "Users",
          path: "/dashboard/finance/staffs",
          icon: getImageSrc("staffs.svg"),
          activeIcon: getImageSrc("usersWhite.svg"),
        },
        {
          name: "Info",
          path: "/dashboard/finance/info",
          icon: getImageSrc("patientsicon.svg"),
          activeIcon: getImageSrc("patienticonsLight.svg"),
        },
      ],
    },
    {
      name: "Users",
      path: "/dashboard/users",
      icon: getImageSrc("usericon.svg"),
      activeIcon: getImageSrc("usersWhite.svg"),
    },
    {
      name: "Payment",
      path: "/dashboard/payment",
      icon: getImageSrc("usericon.svg"),
      activeIcon: getImageSrc("usersWhite.svg"),
    },
    {
      name: "Profile",
      path: "/dashboard/profile",
      icon: getImageSrc("profile.svg"),
      activeIcon: getImageSrc("profile.svg"),
    },
    {
      name: "Branch",
      path: "/dashboard/branch",
      icon: getImageSrc("branch-default.svg"),
      activeIcon: getImageSrc("branch-active.svg"),
    },
    {
      name: "Clinical Dept",
      path: "/dashboard/clinical-department",
      icon: getImageSrc("clinical-defualt.svg"),
      activeIcon: getImageSrc("clinical-active.svg"),
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
  "front-desk-manager": [
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
  pharmacist: [
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
  nurse: [
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
