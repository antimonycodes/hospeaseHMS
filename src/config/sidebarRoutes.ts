// src/config/sidebarRoutes.ts
import { getImageSrc } from "../utils/imageUtils";

export interface SidebarRoute {
  name: string;
  path: string;
  icon: string; // Default icon
  activeIcon: string; // Icon for active state
}

export const sidebarRoutes: Record<string, SidebarRoute[]> = {
  superadmin: [
    {
      name: "Overview",
      path: "/dashboard/overview",
      icon: getImageSrc("overviewicon.svg"),
      activeIcon: getImageSrc("overviewicon-active.svg"),
    },
    {
      name: "Patients",
      path: "/dashboard/patients",
      icon: getImageSrc("patientsicon.svg"),
      activeIcon: getImageSrc("patientsicon-active.svg"),
    },
    {
      name: "Doctors",
      path: "/dashboard/doctors",
      icon: getImageSrc("doctoricon.svg"),
      activeIcon: getImageSrc("doctoricon-active.svg"),
    },
    {
      name: "Consultants",
      path: "/dashboard/consultants",
      icon: getImageSrc("consultanticon.svg"),
      activeIcon: getImageSrc("consultanticon-active.svg"),
    },
    {
      name: "Nurses",
      path: "/dashboard/nurses",
      icon: getImageSrc("nursesicon.svg"),
      activeIcon: getImageSrc("nursesicon-active.svg"),
    },
    {
      name: "Pharmacy",
      path: "/dashboard/pharmacy",
      icon: getImageSrc("pharmacyicon.svg"),
      activeIcon: getImageSrc("pharmacyicon-active.svg"),
    },
    {
      name: "Laboratory",
      path: "/dashboard/laboratory",
      icon: getImageSrc("labicon.svg"),
      activeIcon: getImageSrc("labicon-active.svg"),
    },
    {
      name: "Finance",
      path: "/dashboard/finance",
      icon: getImageSrc("financeicon.svg"),
      activeIcon: getImageSrc("financeicon-active.svg"),
    },
    {
      name: "Users",
      path: "/dashboard/users",
      icon: getImageSrc("usericon.svg"),
      activeIcon: getImageSrc("usericon-active.svg"),
    },
  ],
  doctor: [
    {
      name: "Overview",
      path: "/dashboard/overview",
      icon: getImageSrc("overviewicon.svg"),
      activeIcon: getImageSrc("overviewicon-active.svg"),
    },
    {
      name: "Appointments",
      path: "/dashboard/appointments",
      icon: getImageSrc("doctoricon.svg"),
      activeIcon: getImageSrc("doctoricon-active.svg"),
    },
    {
      name: "Patients",
      path: "/dashboard/patients",
      icon: getImageSrc("patientsicon.svg"),
      activeIcon: getImageSrc("patientsicon-active.svg"),
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
};