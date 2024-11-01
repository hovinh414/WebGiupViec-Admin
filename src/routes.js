import React from "react";
import { Icon } from "@chakra-ui/react";
import {
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdCategory,
  MdOutlineReceiptLong,
  MdOutlineLocalOffer,
  MdOutlinePeopleAlt,
  MdOutlinePhotoSizeSelectLarge,
  MdSchedule,
  MdEventNote,
  MdAttachMoney, // Icon mới cho Doanh thu cá nhân
} from "react-icons/md";

import MainDashboard from "views/admin/default";
import Profile from "views/admin/profile";
import Category from "views/admin/categories";
import Order from "views/admin/orders";
import User from "views/admin/user";
import Product from "views/admin/products";
import ProfileApproval from "views/admin/profileapproval";
import StaffOrders from "views/admin/stafforder";
import WorkSchedule from "views/admin/workSchedule";
import WorkScheduleManagement from "views/admin/workScheduleAdmin";
import PersonalRevenue from "views/admin/personalRevenue"; // Component mới cho Doanh thu cá nhân

import SignInCentered from "views/auth/signIn";

const user = JSON.parse(localStorage.getItem("user"));

const routes = [
  {
    name: "Trang chủ",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: MainDashboard,
  },
  {
    name: "Đặt lịch",
    layout: "/admin",
    path: "/booking",
    icon: (
      <Icon
        as={MdOutlineReceiptLong}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: Order,
    secondary: true,
  },
  {
    name: "Danh mục",
    layout: "/admin",
    icon: <Icon as={MdCategory} width="20px" height="20px" color="inherit" />,
    path: "/category",
    component: Category,
  },
  {
    name: "Dịch vụ",
    layout: "/admin",
    icon: (
      <Icon
        as={MdOutlineShoppingCart}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    path: "/service",
    component: Product,
  },
  {
    name: "Duyệt hồ sơ",
    layout: "/admin",
    path: "/approvel",
    icon: (
      <Icon
        as={MdOutlinePhotoSizeSelectLarge}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: ProfileApproval,
  },
  {
    name: "Người dùng",
    layout: "/admin",
    icon: (
      <Icon
        as={MdOutlinePeopleAlt}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    path: "/user",
    component: User,
  },
  {
    name: "Quản lý lịch làm việc",
    layout: "/admin",
    path: "/work-schedule-management",
    icon: <Icon as={MdEventNote} width="20px" height="20px" color="inherit" />,
    component: WorkScheduleManagement,
  },

  {
    name: "Đăng nhập",
    layout: "/auth",
    path: "/sign-in",
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: SignInCentered,
  },
  {
    name: "Lịch hẹn của tôi",
    layout: "/admin",
    path: "/staff-order",
    icon: (
      <Icon
        as={MdOutlineReceiptLong}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: StaffOrders,
  },
  {
    name: "Lịch làm việc",
    layout: "/admin",
    path: "/work-schedule",
    icon: <Icon as={MdSchedule} width="20px" height="20px" color="inherit" />,
    component: WorkSchedule,
  },
  {
    name: "Doanh thu cá nhân", // Tab mới cho Doanh thu cá nhân
    layout: "/admin",
    path: "/personal-revenue",
    icon: (
      <Icon as={MdAttachMoney} width="20px" height="20px" color="inherit" />
    ),
    component: PersonalRevenue,
  },
  {
    name: "Hồ sơ",
    layout: "/admin",
    path: "/profile",
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: Profile,
  },
];

export default routes;
