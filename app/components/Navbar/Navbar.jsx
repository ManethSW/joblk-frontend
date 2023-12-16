"use client";
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import UserContext from "../../context/UserContext";
import SessionContext from "@/app/context/SessionContext";
import styles from "./Navbar.module.css";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMode, setUserMode] = useState("client"); // ["freelancer", "employer"]
  const { user, setUser } = useContext(UserContext);
  const { session, setSession } = useContext(SessionContext);

  const router = useRouter();

  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    if (session) {
      setUserMode(session.user_mode);
    }
      
  }, [user, session]);

  const handleLogout = async () => {
    const logoutUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_AUTH_LOGOUT}`;
    const headers = {
      auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN,
    };
    try {
      const logoutResponse = await axios.post(
        logoutUrl,
        {},
        { headers, withCredentials: true }
      );
      if (logoutResponse.data.code === "SUCCESS") {
        sessionStorage.removeItem("user");
        setUser(null);
        setIsLoggedIn(false);
        router.replace("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const switchMode = async () => {
    if (userMode === "freelancer") {
      setSession({ user_mode: "client" });
    } else {
      setSession({ user_mode: "freelancer" });
    }
  }

  return (
    <div>
      <nav className={styles.navbar}>
        <div className={styles.logoLinksContainer}>
          <div className={styles.logo}>
            <Image
              src="/logo.svg"
              alt="Logo"
              width={2}
              height={1}
              layout="responsive"
            />
          </div>
          <ul className={`${styles.linksContainer}`}>
            { !isLoggedIn ? (
              <>
                <li className={styles.link}>
                  <Link href="/">Home</Link>
                </li>
                <li className={styles.link}>
                  <Link href="/">Jobs</Link>
                </li>
                <li className={styles.link}>
                  <Link href="/">Freelancers</Link>
                </li>
                <li className={styles.link}>
                  <Link href="/">About Us</Link>
                </li>
              </>
            ) : (
              <>
                <li className={styles.link}>
                  <Link href="/dashboard">Dashboard</Link>
                </li>
                <li className={styles.link}>
                  <Link href="/my_jobs">My Jobs</Link>
                </li>
                <li className={styles.link}>
                  <Link href="/">Settings</Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <div className={styles.actionButtonsContainer}>
          {isLoggedIn ? (
            <>
              <div className="dropdown dropdown-bottom dropdown-end">
                <label tabIndex={0} className="">
                  <div className={styles.userContainer}>
                    <i className="fa-solid fa-user"></i>
                    <p>{user.username}</p>
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  {userMode === "freelancer" ? (
                    <li onClick={switchMode}>
                      <a>Switch to Client</a>
                    </li>
                  ) : (
                    <li onClick={switchMode}>
                      <a>Switch to Freelancer</a>
                    </li>
                  )}
                  <li onClick={handleLogout}>
                    <a>Logout</a>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className={`${styles.actionButton} ${styles.login}`}>
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className={`${styles.actionButton} ${styles.register}`}>
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </nav>
      <nav
        className={`${
          isOpen ? styles.navbarmobileopen : styles.navbarmobileclose
        } ${styles.navbarmobile}`}
      >
        <div className={styles.navbarmobileheader}>
          <div className={styles.logo}>
            <Image
              src="/logo.svg"
              alt="Logo"
              width={2}
              height={1}
              layout="responsive"
            />
          </div>
          <div className={styles.menuToggle}>
            <label className="menu swap swap-rotate">
              {/* this hidden checkbox controls the state */}
              <input
                type="checkbox"
                checked={isOpen}
                onChange={handleMenuToggle}
                className="hidden"
              />

              {/* hamburger icon */}
              <svg
                className="swap-off "
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
              </svg>

              {/* close icon */}
              <svg
                className="swap-on"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
              </svg>
            </label>
          </div>
        </div>
        <div
          className={`${styles.linksContainer} ${
            isOpen ? styles.open : styles.close
          }`}
        >
          <ul>
            <li className={styles.link}>
              <Link href="/" onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>
            <li className={styles.link}>
              <Link href="/" onClick={() => setIsOpen(false)}>
                Jobs
              </Link>
            </li>
            <li className={styles.link}>
              <Link href="/" onClick={() => setIsOpen(false)}>
                Freelancers
              </Link>
            </li>
            <li className={styles.link}>
              <Link href="/" onClick={() => setIsOpen(false)}>
                About Us
              </Link>
            </li>
            <li className={`${styles.action} ${styles.link}`}>
              <Link href="/login" onClick={() => setIsOpen(false)}>
                Login
              </Link>
            </li>
            <li className={`${styles.action} ${styles.link}`}>
              <Link href="/register" onClick={() => setIsOpen(false)}>
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className={`${isOpen ? styles.overlay : ""}`}></div>
    </div>
  );
};

export default NavBar;