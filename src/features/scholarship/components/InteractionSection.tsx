import { useState, useEffect } from "react";
import { useScholarshipStore } from "../../../app/store";
import styles from "./InteractionSection.module.scss";
import zeptolabLogo from "../../../assets/images/zeptolab.png";
import interactionDesign from "../../../assets/images/interaction-design.png";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const InteractionSection = () => {
  const { data } = useScholarshipStore();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!data?.scholarship?.application_end_date) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance =
        new Date(data.scholarship.application_end_date).getTime() - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [data?.scholarship?.application_end_date]);

  if (!data) return null;

  const { scholarship } = data;

  return (
<section className={styles.wrapper}>
  <div className={styles.backgroundPattern}></div>
  <div className={styles.container}>

    <div className={styles.titleWrapper}>
      <img
        src={interactionDesign}
        alt=""
        aria-hidden="true"
        className={styles.titleBadge}
      />
      <h1 className={styles.title}>{scholarship.name}</h1>
    </div>

    <div className={styles.detailsColumn}>
      {scholarship.company && (
        <div className={styles.poweredBy}>
          <img src={zeptolabLogo} alt={scholarship.company.name} className={styles.logo} />
          <div className={styles.text}>
            Powered by:
            <strong>{scholarship.company.name}</strong>
          </div>
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.countdownLabel}>Application closes in</div>
        <div className={styles.countdownTimer}>
          <span>{timeLeft.days} Day</span> :
          <span>{timeLeft.hours} Hrs</span> :
          <span>{timeLeft.minutes} Min</span> :
          <span>{timeLeft.seconds} Sec</span>
        </div>
      </div>

      <div className={`${styles.card} ${styles.detailsGrid}`}>
        <div className={styles.gridItem}>
          <span className={styles.label}>Location</span>
          <span className={styles.value}>{scholarship.location?.name || "N/A"}</span>
        </div>
        <div className={styles.gridItem}>
          <span className={styles.label}>Duration</span>
          <span className={styles.value}>
            {scholarship.duration} Year{scholarship.duration > 1 ? "s" : ""}
          </span>
        </div>
        <div className={styles.gridItem}>
          <span className={styles.label}>Start date</span>
          <span className={styles.value}>{formatDate(scholarship.scholarship_start_date)}</span>
        </div>
        <div className={styles.gridItem}>
          <span className={styles.label}>End date</span>
          <span className={styles.value}>{formatDate(scholarship.application_end_date)}</span>
        </div>
      </div>
    </div>

    <div className={styles.infoColumn}>
      <p className={styles.subtitle}>
        A fully funded work-study program to launch your tech career
      </p>
      <p className={styles.description}>
        {scholarship.description?.[0]?.data || "No description available."}
      </p>
      <p className={styles.position}>
        <span>Position:</span> {scholarship.position || "Various"}
      </p>
      <button className={styles.applyButton}>Apply Now</button>
    </div>

  </div>
</section>
  );
};
