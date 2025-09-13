import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
} from "@heroui/react";
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];

  return (
    <Navbar 
      onMenuOpenChange={setIsMenuOpen} 
      maxWidth="full"
      className="bg-gray-900/95 backdrop-blur-lg border-b border-red-500/20"
      classNames={{
        wrapper: "px-6",
        item: "text-gray-300 hover:text-red-400 transition-colors duration-200",
        brand: "text-white font-bold text-xl",
      }}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-red-400"
        />
        <NavbarBrand>
          <Link className="font-bold text-transparent bg-gradient-to-r from-red-400 to-red-600 bg-clip-text cursor-pointer text-2xl" to="/">
            InfoBase
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-8" justify="center">
        <NavbarItem>
          <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <p
                disableRipple
                className="bg-transparent data-[hover=true]:bg-transparent
                text-gray-300 hover:text-red-400 transition-colors duration-200 cursor-pointer font-medium"
                radius="sm"
                variant="light"
              >
                Problems
              </p>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            itemClasses={{
              base: "gap-4",
            }}
          >
            <DropdownItem
              key="autoscaling"
              description="ACME scales apps based on demand and load"
            >
              Autoscaling
            </DropdownItem>
            <DropdownItem
              key="usage_metrics"
              description="Real-time metrics to debug issues"
            >
              Usage Metrics
            </DropdownItem>
            <DropdownItem
              key="production_ready"
              description="ACME runs on ACME, join us at web scale"
            >
              Production Ready
            </DropdownItem>
            <DropdownItem
              key="99_uptime"
              description="High availability and uptime guarantees"
            >
              +99% Uptime
            </DropdownItem>
            <DropdownItem
              key="supreme_support"
              description="Support team ready to respond"
            >
              +Supreme Support
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        </NavbarItem>
        <NavbarItem>
          <p className="text-gray-300 hover:text-red-400 transition-colors duration-200 cursor-pointer font-medium">
            Compete
          </p>
        </NavbarItem>
        <NavbarItem>
          <p className="text-gray-300 hover:text-red-400 transition-colors duration-200 cursor-pointer font-medium">
            Contests
          </p>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
            <Link className="text-gray-300 hover:text-red-400 transition-colors duration-200 cursor-pointer font-medium" to="/signin">
                Login
            </Link>
        </NavbarItem>
        <NavbarItem>
            <Link to="/signup">
                <Button 
                    color="primary" 
                    variant="solid"
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold px-6 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg"
                >
                    Sign Up
                </Button>
            </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu className="bg-gray-900/98 backdrop-blur-lg border-r border-red-500/20">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <p
              className={`w-full text-lg font-medium cursor-pointer transition-colors duration-200 ${
                index === 2 
                  ? "text-red-400" 
                  : index === menuItems.length - 1 
                    ? "text-red-300 hover:text-red-400" 
                    : "text-gray-300 hover:text-red-400"
              }`}
            >
              {item}
            </p>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

export default NavBar;