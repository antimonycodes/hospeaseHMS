// src/config/sidebarRoutes.ts
import { getImageSrc } from "../utils/imageUtils";
import {
  RefreshCw,
  DollarSign,
  ReceiptText,
  BedDouble,
  BarChart2,
  Users2,
  Activity,
} from "lucide-react";

import type { ReactElement } from "react";

export interface SidebarRoute {
  name: string;
  path: string;
  icon: string | ReactElement;
  activeIcon: string | ReactElement;
  children?: SidebarRoute[];
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
      name: "Admissions",
      path: "/dashboard/admissions",
      icon: <BedDouble />,
      activeIcon: <BedDouble className=" text-white" />,
    },
    {
      name: "Front Desk",
      path: "/dashboard/front-desk",
      icon: getImageSrc("front-desk.svg"),
      activeIcon: getImageSrc("front-desk.svg"),
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
          name: "Staff",
          path: "/dashboard/pharmacy/staffs",
          icon: <Users2 />,
          activeIcon: <Users2 className="text-white" />,
        },
        {
          name: "Info",
          path: "/dashboard/pharmacy/info",
          icon: <Activity />,
          activeIcon: <Activity className="text-white" />,
        },
      ],
    },
    {
      name: "Inventory",
      path: "/dashboard/inventory",
      icon: getImageSrc("inventory-active.svg"),
      activeIcon: getImageSrc("inventory-default.svg"),
      children: [
        {
          name: "Staff",
          path: "/dashboard/inventory/staffs",
          icon: <Users2 />,
          activeIcon: <Users2 className="text-white" />,
        },
        {
          name: "Info",
          path: "/dashboard/inventory/info",
          icon: <Activity />,
          activeIcon: <Activity className="text-white" />,
        },
      ],
    },
    {
      name: "Laboratory",
      path: "/dashboard/laboratory",
      icon: getImageSrc("labicon.svg"),
      activeIcon: getImageSrc("labWhite.svg"),
      children: [
        {
          name: "Staff",
          path: "/dashboard/laboratory/staffs",
          icon: <Users2 />,
          activeIcon: <Users2 className="text-white" />,
        },
        // {
        //   name: "Info",
        //   path: "/dashboard/laboratory/info",
        //   icon: getImageSrc("patientsicon.svg"),
        //   activeIcon: getImageSrc("patienticonsLight.svg"),
        // },
      ],
    },
    {
      name: "Finance",
      path: "/dashboard/finance",
      icon: getImageSrc("financeicon.svg"),
      activeIcon: getImageSrc("financeWhite.svg"),
      children: [
        {
          name: "Staff",
          path: "/dashboard/finance/staffs",
          icon: <Users2 />,
          activeIcon: <Users2 className="text-white" />,
        },
        {
          name: "Info",
          path: "/dashboard/finance/info",
          icon: <Activity />,
          activeIcon: <Activity className="text-white" />,
        },
      ],
    },
    {
      name: "Department Heads",
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
      name: "Reports",
      path: "/dashboard/reports",
      icon: <BarChart2 />,
      activeIcon: <BarChart2 className="text-white" />,
    },

    {
      name: "Shifts",
      path: "/dashboard/shifts",
      icon: getImageSrc("pharmacyicon.svg"),
      activeIcon: getImageSrc("pharmacyWhite.svg"),
    },
    {
      name: "Service Charges",
      path: "/dashboard/service-charges",
      icon: <ReceiptText />,
      activeIcon: <ReceiptText className="text-white" />,
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
    {
      name: "Reset App",
      path: "/dashboard/reset",
      icon: <RefreshCw size={20} />,
      activeIcon: <RefreshCw size={20} className="text-white" />,
    },
  ],
  "platform-manager": [
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
      name: "Admission",
      path: "/dashboard/admission",
      icon: getImageSrc("patientsicon.svg"),
      activeIcon: getImageSrc("Adm-white.svg"),
    },
    {
      name: "Front Desk",
      path: "/dashboard/front-desk",
      icon: getImageSrc("front-desk.svg"),
      activeIcon: getImageSrc("front-desk.svg"),
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
          name: "Staff",
          path: "/dashboard/pharmacy/staffs",
          icon: getImageSrc("staffs.svg"),
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
      path: "/dashboard/inventory",
      icon: getImageSrc("inventory-active.svg"),
      activeIcon: getImageSrc("inventory-default.svg"),
      children: [
        {
          name: "Staff",
          path: "/dashboard/inventory/staffs",
          icon: getImageSrc("staffs.svg"),
          activeIcon: getImageSrc("usersWhite.svg"),
        },
        {
          name: "Info",
          path: "/dashboard/inventory/info",
          icon: getImageSrc("patientsicon.svg"),
          activeIcon: getImageSrc("patienticonsLight.svg"),
        },
      ],
    },
    {
      name: "Laboratory",
      path: "/dashboard/laboratory",
      icon: getImageSrc("labicon.svg"),
      activeIcon: getImageSrc("labWhite.svg"),
      children: [
        {
          name: "Staff",
          path: "/dashboard/laboratory/staffs",
          icon: getImageSrc("staffs.svg"),
          activeIcon: getImageSrc("usersWhite.svg"),
        },
        // {
        //   name: "Info",
        //   path: "/dashboard/laboratory/info",
        //   icon: getImageSrc("patientsicon.svg"),
        //   activeIcon: getImageSrc("patienticonsLight.svg"),
        // },
      ],
    },
    {
      name: "Finance",
      path: "/dashboard/finance",
      icon: getImageSrc("financeicon.svg"),
      activeIcon: getImageSrc("financeWhite.svg"),
      children: [
        {
          name: "Staff",
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
      name: "Department Heads",
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
      name: "Shifts",
      path: "/dashboard/shifts",
      icon: getImageSrc("pharmacyicon.svg"),
      activeIcon: getImageSrc("pharmacyWhite.svg"),
    },
    {
      name: "Service Charges",
      path: "/dashboard/service-charges",
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
      name: "Admission",
      path: "/dashboard/admission",
      icon: getImageSrc("patientsicon.svg"),
      activeIcon: getImageSrc("Adm-white.svg"),
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
    {
      name: "Bills",
      path: "/dashboard/bills",
      icon: getImageSrc("financeicon.svg"),
      activeIcon: getImageSrc("financeWhite.svg"),
    },
    {
      name: "Profile",
      path: "/dashboard/staffprofile",
      icon: getImageSrc("profile.svg"),
      activeIcon: getImageSrc("profile.svg"),
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
      name: "Admission",
      path: "/dashboard/admission",
      icon: getImageSrc("patientsicon.svg"),
      activeIcon: getImageSrc("Adm-white.svg"),
    },
    {
      name: "Appointments",
      path: "/dashboard/appointments",
      icon: getImageSrc("appointmentsdark.svg"),
      activeIcon: getImageSrc("appointmentLight.svg"),
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
    {
      name: "Shifts",
      path: "/dashboard/shifts",
      icon: getImageSrc("pharmacyicon.svg"),
      activeIcon: getImageSrc("pharmacyWhite.svg"),
    },
    {
      name: "Profile",
      path: "/dashboard/staffprofile",
      icon: getImageSrc("profile.svg"),
      activeIcon: getImageSrc("profile.svg"),
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
    {
      name: "Admission",
      path: "/dashboard/admission",
      icon: getImageSrc("patientsicon.svg"),
      activeIcon: getImageSrc("Adm-white.svg"),
    },
    {
      name: "payments",
      path: "/dashboard/payment",
      icon: getImageSrc("patientsicon.svg"),
      activeIcon: getImageSrc("patienticonsLight.svg"),
    },
    {
      name: "Shifts",
      path: "/dashboard/shifts",
      icon: getImageSrc("pharmacyicon.svg"),
      activeIcon: getImageSrc("pharmacyWhite.svg"),
    },
    {
      name: "Profile",
      path: "/dashboard/staffprofile",
      icon: getImageSrc("profile.svg"),
      activeIcon: getImageSrc("profile.svg"),
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
    {
      name: "Shifts",
      path: "/dashboard/shifts",
      icon: getImageSrc("pharmacyicon.svg"),
      activeIcon: getImageSrc("pharmacyWhite.svg"),
    },
    {
      name: "Profile",
      path: "/dashboard/staffprofile",
      icon: getImageSrc("profile.svg"),
      activeIcon: getImageSrc("profile.svg"),
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
      name: "Admission",
      path: "/dashboard/admission",
      icon: getImageSrc("patientsicon.svg"),
      activeIcon: getImageSrc("Adm-white.svg"),
    },
    {
      name: "Stocks",
      path: "/dashboard/stocks",
      icon: getImageSrc("patientsicon.svg"),
      activeIcon: getImageSrc("patienticonsLight.svg"),
    },
    {
      name: "Payments",
      path: "/dashboard/payment",
      icon: getImageSrc("patientsicon.svg"),
      activeIcon: getImageSrc("patienticonsLight.svg"),
    },
    {
      name: "Shifts",
      path: "/dashboard/shifts",
      icon: getImageSrc("appointmentsdark.svg"),
      activeIcon: getImageSrc("appointmentLight.svg"),
    },
    {
      name: "Profile",
      path: "/dashboard/staffprofile",
      icon: getImageSrc("profile.svg"),
      activeIcon: getImageSrc("profile.svg"),
    },
  ],
  "inventory-manager": [
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
    {
      name: "Category",
      path: "/dashboard/category",
      icon: getImageSrc("pharmacyicon.svg"),
      activeIcon: getImageSrc("pharmacyWhite.svg"),
    },
    {
      name: "Service Charges",
      path: "/dashboard/service-charges",
      icon: getImageSrc("usericon.svg"),
      activeIcon: getImageSrc("usersWhite.svg"),
    },
    {
      name: "Shifts",
      path: "/dashboard/shifts",
      icon: getImageSrc("pharmacyicon.svg"),
      activeIcon: getImageSrc("pharmacyWhite.svg"),
    },
    {
      name: "Profile",
      path: "/dashboard/staffprofile",
      icon: getImageSrc("profile.svg"),
      activeIcon: getImageSrc("profile.svg"),
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
      name: "Admission",
      path: "/dashboard/admission",
      icon: getImageSrc("patientsicon.svg"),
      activeIcon: getImageSrc("Adm-white.svg"),
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
      icon: getImageSrc("pharmacyicon.svg"),
      activeIcon: getImageSrc("pharmacyWhite.svg"),
    },

    {
      name: "Profile",
      path: "/dashboard/staffprofile",
      icon: getImageSrc("profile.svg"),
      activeIcon: getImageSrc("profile.svg"),
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
      icon: getImageSrc("nursesicon.svg"),
      activeIcon: getImageSrc("nurseWhite.svg"),
    },
    {
      name: "Patients",
      path: "/dashboard/patients",
      icon: getImageSrc("patientsicon.svg"),
      activeIcon: getImageSrc("patienticonsLight.svg"),
    },
    {
      name: "Admission",
      path: "/dashboard/admission",
      icon: getImageSrc("patientsicon.svg"),
      activeIcon: getImageSrc("Adm-white.svg"),
    },
    {
      name: "Shifts",
      path: "/dashboard/shifts",
      icon: getImageSrc("pharmacyicon.svg"),
      activeIcon: getImageSrc("pharmacyWhite.svg"),
    },
    {
      name: "Profile",
      path: "/dashboard/staffprofile",
      icon: getImageSrc("profile.svg"),
      activeIcon: getImageSrc("profile.svg"),
    },
  ],
  consultant: [
    {
      name: "Patients",
      path: "/dashboard/patients",
      icon: getImageSrc("patientsicon.svg"),
      activeIcon: getImageSrc("patienticonsLight.svg"),
    },
    {
      name: "Admission",
      path: "/dashboard/admission",
      icon: getImageSrc("patientsicon.svg"),
      activeIcon: getImageSrc("Adm-white.svg"),
    },

    {
      name: "Profile",
      path: "/dashboard/staffprofile",
      icon: getImageSrc("profile.svg"),
      activeIcon: getImageSrc("profile.svg"),
    },
  ],

  "medical-director": [
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
      name: "Admission",
      path: "/dashboard/admission",
      icon: getImageSrc("patientsicon.svg"),
      activeIcon: getImageSrc("Adm-white.svg"),
    },
    {
      name: "Appointments",
      path: "/dashboard/appointments",
      icon: getImageSrc("appointmentsdark.svg"),
      activeIcon: getImageSrc("appointmentLight.svg"),
    },
    {
      name: "Doctors",
      path: "/dashboard/doctors",
      icon: getImageSrc("doctoricon.svg"),
      activeIcon: getImageSrc("doctorsWhite.svg"),
    },
    {
      name: "Shifts",
      path: "/dashboard/shifts",
      icon: getImageSrc("appointmentsdark.svg"),
      activeIcon: getImageSrc("appointmentLight.svg"),
    },
    {
      name: "Profile",
      path: "/dashboard/staffprofile",
      icon: getImageSrc("profile.svg"),
      activeIcon: getImageSrc("profile.svg"),
    },
  ],
};
