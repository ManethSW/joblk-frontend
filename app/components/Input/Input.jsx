import Image from "next/image";
import styles from "./Input.module.css";

const RegisterInput = ({ id, type, placeholder, value, isValid, onChange }) => (
  <div className={styles.input}>
    <input
      type={type}
      id={id}
      name={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
    />
    <label htmlFor={id}>{placeholder}</label>
    <Image
      src={`/${isValid}.svg`}
      alt="Logo"
      width={25}
      height={25}
      className={styles.validcheck}
    />
  </div>
);

export default RegisterInput;