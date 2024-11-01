import { mode } from "@chakra-ui/theme-tools";

export const globalStyles = {
  colors: {
    brand: {
      100: "#FFE5D0", // Cam nhạt
      200: "#FFAD80", // Cam sáng
      300: "#FF9E60",
      400: "#FF8F40",
      500: "#FF8000", // Màu cam chủ đạo
      600: "#DB6E00",
      700: "#B75C00",
      800: "#934A00",
      900: "#7A3E00",
    },
    brandScheme: {
      100: "#FFE5D0",
      200: "#FFAD80",
      300: "#FF9E60",
      400: "#FF8F40",
      500: "#FF8000",
      600: "#DB6E00",
      700: "#B75C00",
      800: "#934A00",
      900: "#7A3E00",
    },
    brandTabs: {
      100: "#FFE5D0",
      200: "#FFAD80",
      300: "#FF9E60",
      400: "#FF8F40",
      500: "#FF8000",
      600: "#DB6E00",
      700: "#B75C00",
      800: "#934A00",
      900: "#7A3E00",
    },
    secondaryGray: {
      100: "#E0E5F2",
      200: "#E1E9F8",
      300: "#F4F7FE",
      400: "#E9EDF7",
      500: "#8F9BBA",
      600: "#A3AED0",
      700: "#707EAE",
      800: "#707EAE",
      900: "#1B2559",
    },
    red: {
      100: "#FEEFEE",
      500: "#EE5D50",
      600: "#E31A1A",
    },
    blue: {
      50: "#EFF4FB",
      500: "#3965FF",
    },
    orange: {
      100: "#FFF6DA",
      500: "#FFB547",
    },
    green: {
      100: "#E6FAF5",
      500: "#01B574",
    },
    navy: {
      50: "#d0dcfb",
      100: "#aac0fe",
      200: "#a3b9f8",
      300: "#728fea",
      400: "#3652ba",
      500: "#1b3bbb",
      600: "#24388a",
      700: "#1B254B",
      800: "#111c44",
      900: "#0b1437",
    },
    gray: {
      100: "#FAFCFE",
    },
  },
  styles: {
    global: (props) => ({
      body: {
        overflowX: "hidden",
        bg: mode("secondaryGray.300", "navy.900")(props),
        fontFamily: "Roboto", // Sử dụng font Roboto
        letterSpacing: "-0.5px",
      },
      input: {
        color: "gray.700",
      },
      html: {
        fontFamily: "Roboto", // Sử dụng font Roboto
      },
    }),
  },
};
