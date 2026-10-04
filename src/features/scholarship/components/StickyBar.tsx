import { useState, useEffect } from "react";
import { useScholarshipStore } from "../../../app/store";
import styles from "./StickyBar.module.scss";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const StickyBar = () => {
  const { data } = useScholarshipStore();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!data?.scholarship?.application_end_date) return;

    const update = () => {
      const now = new Date().getTime();
      const distance =
        new Date(data.scholarship.application_end_date).getTime() - now;

      if (distance < 0) {
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
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [data?.scholarship?.application_end_date]);

  if (!data) return null;

  const { scholarship } = data;

  return (
    <div className={styles.stickyBar}>
      <div className={styles.inner}>
        <div className={styles.item}>
          <span className={styles.label}>
            {scholarship.company?.name || "Company"}
          </span>
          <span className={styles.value}>
            {scholarship.position || scholarship.name}
          </span>
        </div>

        <div className={styles.item}>
          <span className={styles.label}>Location</span>
          <span className={styles.value}>
            {scholarship.location?.name || "N/A"}
          </span>
        </div>

        <div className={styles.item}>
          <span className={styles.label}>Duration</span>
          <span className={styles.value}>
            {scholarship.duration} Year{scholarship.duration > 1 ? "s" : ""}{" "}
            Full-Time
          </span>
        </div>

        <div className={styles.item}>
          <span className={styles.label}>Start date</span>
          <span className={styles.value}>
            {formatDate(scholarship.scholarship_start_date)}
          </span>
        </div>

        <div className={styles.item}>
          <span className={styles.label}>Application deadline</span>
          <span className={styles.value}>
            {formatDate(scholarship.application_end_date)}
          </span>
        </div>

        <div className={styles.item}>
          <span className={styles.label}>Application closes in</span>
          <span className={styles.countdownValue}>
            <span>{timeLeft.days} Day</span>
            <span className={styles.separator}>:</span>
            <span>{timeLeft.hours} Hrs</span>
            <span className={styles.separator}>:</span>
            <span>{timeLeft.minutes} Min</span>
            <span className={styles.separator}>:</span>
            <span>{timeLeft.seconds} Sec</span>
          </span>
        </div>
      </div>
    </div>
  );
};
