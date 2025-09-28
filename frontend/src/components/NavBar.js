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
  Avatar,
  DropdownSection,
} from "@heroui/react";
import { Link } from 'react-router-dom';
import { useAuthContext } from "../Hooks/useAuthContext";
import { useLogout } from "../Hooks/useLogout";
import { useNavigate } from "react-router-dom";
import { FaCode } from "react-icons/fa";

const NavBar = ({userInfo}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const navigate = useNavigate();

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
            <DropdownSection showDivider title = "Solve">
              <DropdownItem
                onClick={(() => navigate('/problems/list'))}
                key="CommunityProblems"
              >
                Community Problems
              </DropdownItem>
            </DropdownSection>
            <DropdownSection title = "Special">
              <DropdownItem
                onClick={() => navigate('/problems/dailyChallenge')}
                key="Oficial problems"
              >
                Daily Challenge
              </DropdownItem>
              <DropdownItem
                onClick={() => navigate('/problems/codeBattles')}
                key="99_uptime"
              >
                1v1 Battle
              </DropdownItem>
            </DropdownSection>
            <DropdownSection title = "Posting">
              <DropdownItem
                onClick={() => user ? navigate('/problems/createProblem') : navigate('/signin')}
                key="Oficial problems"
              >
                Create Problem
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
        </NavbarItem>
        <NavbarItem>
          <p className="text-gray-300 hover:text-red-400 transition-colors duration-200 cursor-pointer font-medium">
            Prizes
          </p>
        </NavbarItem>
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
                  Features
                </p>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              itemClasses={{
                base: "gap-4",
              }}
            >
              <DropdownItem
                onClick={() => navigate('/leaderboard')}
                key="leaderboard"
              >
                Leaderboard
              </DropdownItem>
              <DropdownItem 
                onClick={() => navigate('/compiler')}
                key="compiler"
              >
                Compiler
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
      {user ?  (
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
              <Dropdown>
                <DropdownTrigger>
                  <Avatar
                      showFallback
                      name = {user.username.charAt(0).toUpperCase()}
                      as="button"
                      size="md"
                      className="transition-transform border-2 border-red-700 hover:border-red-500 rounded-full duration-300"
                      src={userInfo?.profilePictureUrl || ""}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Dropdown menu with description" variant="faded">
                  <DropdownSection showDivider>
                    <DropdownItem
                      onClick={() => navigate(`profile/${user.username}`)}
                      key="new"
                    >
                      Profile
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => navigate(`profile/${user.username}`)}
                      key="copy"
                    >
                      Settings
                    </DropdownItem>
                  </DropdownSection>
                  <DropdownSection>
                    <DropdownItem
                      key="delete"
                      className="text-danger"
                      color="danger"
                      onClick={() => logout()}
                    >
                      Log Out
                    </DropdownItem>
                  </DropdownSection>
                </DropdownMenu>
              </Dropdown>
          </NavbarItem>
        </NavbarContent>
      ) : (
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
      )}
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