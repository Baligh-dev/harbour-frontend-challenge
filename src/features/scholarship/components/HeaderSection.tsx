import { useScholarshipStore } from "../../../app/store";
import styles from "./HeaderSection.module.scss";
import menuIcon from "../../../assets/images/harbour-menu-icon.png";

export const HeaderSection = () => {
  const { data } = useScholarshipStore();

  if (!data) return null;

  return (
    <header className={styles.header}>
      <div className={styles.titleContainer}>
        <h1 className={styles.brand}>HARBOUR.SPACE</h1>
        <span className={styles.subtitle}>/{data.scholarship.name}</span>
      </div>

      <div className={styles.actions}>
        <button className={styles.applyButton}>
          APPLY
          <br />
          NOW
        </button>

        <button className={styles.menuButton} aria-label="Open menu">
          <img src={menuIcon} alt="Open menu" className={styles.menuIcon} />
        </button>
      </div>
    </header>
  );
};
