import { useScholarshipStore } from "../../../app/store";
import styles from "./AboutSection.module.scss";
import studentPortrait from "../../../assets/images/student.jpg";
import buildingImage from "../../../assets/images/building.png";

export const AboutSection = () => {
  const { data } = useScholarshipStore();

  if (!data) return null;

  const { scholarship } = data;

  return (
    <section className={styles.aboutSection}>
      <div className={styles.topPart}>
        <div className={styles.patternRing}></div>

        <div className={styles.imageWrapper}>
          <picture>
            <source media="(max-width: 1024px)" srcSet={buildingImage} />
            <img
              src={studentPortrait}
              alt="Apprenticeship program"
              className={styles.profileImage}
            />
          </picture>
        </div>

        <div className={styles.textContent}>
          <h2 className={styles.title}>
            About the
            <br />
            apprenticeship
          </h2>
          <p className={styles.description}>
            {scholarship.about?.[0]?.data || "No description available."}
          </p>
        </div>
      </div>

      <div className={styles.bottomPart}>
        <div className={`${styles.card} ${styles.cardScholarship}`}>
          <div className={styles.cardLabel}>Scholarship value</div>
          <div className={styles.cardValue}>
            €{scholarship.total_value?.toLocaleString()}
          </div>

          <div className={styles.scholarshipDetails}>
            <div className={styles.detailItem}>
              <span className={styles.label}>Tuition covered</span>
              <span className={styles.value}>
                €{scholarship.tuition?.toLocaleString()}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Remaining</span>
              <span className={styles.value}>
                €{scholarship.remaining?.toLocaleString()}
              </span>
            </div>
            <div
              className={styles.detailItem}
              style={{ gridColumn: "1 / span 2" }}
            >
              <span className={styles.label}>Living stipend</span>
              <span className={styles.value}>
                €{scholarship.stipend_per_year?.toLocaleString()} (€
                {scholarship.stipend_per_month}/month)
              </span>
            </div>
          </div>
        </div>

        <div className={`${styles.card} ${styles.cardStudy}`}>
          <div className={styles.cardLabel}>Study commitment</div>
          <div className={styles.cardValue}>
            {scholarship.study_commitment} hours / day
          </div>
          <p className={styles.cardDescription}>
            {scholarship.study_commitment_text}
          </p>
        </div>

        <div className={`${styles.card} ${styles.cardWork}`}>
          <div className={styles.cardLabel}>Work commitment</div>
          <div className={styles.cardValue}>
            {scholarship.internship_commitment} hours / day
          </div>
          <p className={styles.cardDescription}>
            {scholarship.internship_commitment_text}
          </p>
        </div>

        <div className={styles.graduationDivider}>
          <div className={styles.line}></div>
          <div className={styles.text}>GRADUATION</div>
          <div className={styles.line}></div>
        </div>

        <div className={`${styles.card} ${styles.cardContract}`}>
          <div className={styles.cardLabel}>A full-time contract</div>
          <div className={styles.cardValue}>1 Year / Full-Time</div>
          <p className={styles.cardDescription}>
            You'll be guaranteed a 1-year contract with the company upon
            graduation.
          </p>
        </div>
      </div>
    </section>
  );
};
