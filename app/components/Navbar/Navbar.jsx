"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Navbar.module.css";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
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
          <li className={styles.link}>
            <Link href="/">Home</Link>
          </li>
          <li className={styles.link}>
            <Link href="/jobs">Jobs</Link>
          </li>
          <li className={styles.link}>
            <Link href="/freelancers">Freelancers</Link>
          </li>
          <li className={styles.link}>
            <Link href="/about">About Us</Link>
          </li>
        </ul>
      </div>
      <div className={styles.actionButtonsContainer}>
        {isLoggedIn ? (
          <>
            <div className={styles.userContainer}>
              <i className="fa-solid fa-user"></i>
              <p>Thinal</p>
            </div>
          </>
        ) : (
          <>
            <Link href="/login">
              <button className={`${styles.actionButton} ${styles.login}`}>Login</button>
            </Link>
            <Link href="/register">
              <button className={`${styles.actionButton} ${styles.register}`}>Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
