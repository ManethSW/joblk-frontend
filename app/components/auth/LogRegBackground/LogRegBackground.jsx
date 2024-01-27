import React from "react";
import Image from "next/image";
import styles from "./LogRegBackground.module.css";

const LoginRegisterBackground = () => {
  return (
    <div>
      <div className={styles.characterone}>
        <Image
          src="/characterone.svg"
          alt="Logo"
          width={400}
          height={400}
          layout="responsive"
        />
      </div>
      <div className={styles.codingicons}>
        <Image
          src="/codingicons.svg"
          alt="Logo"
          width={300}
          height={600}
          layout="responsive"
        />
      </div>
    </div>
  );
};

export default LoginRegisterBackground;
