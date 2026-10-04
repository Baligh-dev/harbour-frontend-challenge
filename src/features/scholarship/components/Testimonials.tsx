import { useRef, useState, useEffect, useCallback } from "react";
import { useScholarshipStore } from "../../../app/store";
import styles from "./Testimonials.module.scss";
import testimonialsAvatar from "../../../assets/images/testimonials-avatar.png";

const CAROUSEL_CONFIG = {
  autoPlay: true,
  autoPlayInterval: 5000,
  showArrowsOnDesktop: true,
  showArrowsOnMobile: false,
  showDragPillOnDesktop: true,
  showDragPillOnMobile: false,
};

const mockTestimonials = [
  {
    id: 1,
    name: "Irene Pereyra",
    role: "Interaction Design Fellow '19",
    quote:
      "This Fellowship was a turning point in my career. I wouldn't be where I am today without the financial support and experienced offered through the program.",
    education: "Education · B.A. Visual Design",
    avatar: testimonialsAvatar,
  },
  {
    id: 2,
    name: "John Doe",
    role: "Data Science Fellow '20",
    quote:
      "The apprenticeship gave me the practical skills and industry connections I needed to transition into a top-tier tech role.",
    education: "Education · M.S. Computer Science",
    avatar: testimonialsAvatar,
  },
  {
    id: 3,
    name: "Jane Smith",
    role: "Software Engineering Fellow '21",
    quote:
      "An incredible experience that bridges the gap between academic theory and real-world application.",
    education: "Education · B.S. Software Engineering",
    avatar: testimonialsAvatar,
  },
];

export const Testimonials = () => {
  const { data } = useScholarshipStore();
  const testimonials = data?.testimonials?.length
    ? data.testimonials
    : mockTestimonials;
  const totalItems = testimonials.length;

  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showDragPill, setShowDragPill] = useState(false);
  const [isDraggingPill, setIsDraggingPill] = useState(false);
  const scrollEndTimeoutRef = useRef<number | null>(null);

  const [pillOffset, setPillOffset] = useState({ x: 0, y: 0 });

  const extendedTestimonials =
    totalItems > 1
      ? [
          {
            ...testimonials[totalItems - 1],
            id: `clone-start-${testimonials[totalItems - 1].id}`,
          },
          ...testimonials,
          { ...testimonials[0], id: `clone-end-${testimonials[0].id}` },
        ]
      : testimonials;

  const getScrollAmount = () => {
    if (!trackRef.current || !trackRef.current.firstElementChild) return 500;
    const cardWidth = (trackRef.current.firstElementChild as HTMLElement)
      .offsetWidth;
    const gap = 32;
    return cardWidth + gap;
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track || totalItems <= 1) return;
    const itemWidth = getScrollAmount();
    track.scrollTo({ left: itemWidth, behavior: "instant" as ScrollBehavior });
  }, [totalItems]);

  const handleScroll = () => {
    if (scrollEndTimeoutRef.current) clearTimeout(scrollEndTimeoutRef.current);
    scrollEndTimeoutRef.current = window.setTimeout(() => {
      const track = trackRef.current;
      if (!track || totalItems <= 1) return;
      const itemWidth = getScrollAmount();
      const index = Math.round(track.scrollLeft / itemWidth);

      if (index === 0) {
        track.scrollTo({
          left: totalItems * itemWidth,
          behavior: "instant" as ScrollBehavior,
        });
      } else if (index === totalItems + 1) {
        track.scrollTo({
          left: itemWidth,
          behavior: "instant" as ScrollBehavior,
        });
      }
    }, 150);
  };

  const scroll = useCallback((direction: "left" | "right") => {
    const track = trackRef.current;
    if (!track) return;
    const itemWidth = getScrollAmount();
    track.scrollTo({
      left:
        direction === "right"
          ? track.scrollLeft + itemWidth
          : track.scrollLeft - itemWidth,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (!CAROUSEL_CONFIG.autoPlay || isPaused || totalItems <= 1) return;
    const interval = setInterval(
      () => scroll("right"),
      CAROUSEL_CONFIG.autoPlayInterval,
    );
    return () => clearInterval(interval);
  }, [isPaused, scroll, totalItems]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const track = trackRef.current;
    if (!track) return;
    setIsPaused(true);
    const startX = e.clientX;
    const scrollLeft = track.scrollLeft;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const walk = (e.clientX - startX) * 1.5;
      track.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      setTimeout(() => setIsPaused(false), 1500);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handlePillMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPaused(true);
    setIsDraggingPill(true);

    const track = trackRef.current;
    if (!track) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startScroll = track.scrollLeft;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      setPillOffset({ x: deltaX, y: deltaY });
      track.scrollLeft = startScroll - deltaX * 2;
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      setIsDraggingPill(false);
      setPillOffset({ x: 0, y: 0 });
      setTimeout(() => setIsPaused(false), 1500);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  if (!testimonials.length) return null;

  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.backgroundPattern}></div>

      <div className={styles.container}>
        <div
          className={styles.carouselWrapper}
          onMouseEnter={() => {
            setIsPaused(true);
            setShowDragPill(true);
          }}
          onMouseLeave={() => {
            setIsPaused(false);
            setShowDragPill(false);
          }}
        >
          {CAROUSEL_CONFIG.showArrowsOnDesktop && (
            <button
              className={`${styles.navButton} ${styles.navButtonLeft} ${showDragPill ? styles.navButtonVisible : ""}`}
              onClick={() => {
                setIsPaused(true);
                scroll("left");
                setTimeout(() => setIsPaused(false), 2000);
              }}
              aria-label="Previous testimonial"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          )}

          <div
            className={styles.carouselTrack}
            ref={trackRef}
            onMouseDown={handleMouseDown}
            onScroll={handleScroll}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setTimeout(() => setIsPaused(false), 1500)}
          >
            {extendedTestimonials.map((testimonial) => (
              <div key={testimonial.id} className={styles.card}>
                <div className={styles.linkedinIcon}>in</div>
                <div className={styles.header}>
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className={styles.avatar}
                  />
                  <div className={styles.userInfo}>
                    <h4 className={styles.name}>{testimonial.name}</h4>
                    <p className={styles.role}>{testimonial.role}</p>
                  </div>
                </div>
                <div className={styles.mainContent}>
                  <p className={styles.quote}>{testimonial.quote}</p>
                  <p className={styles.education}>{testimonial.education}</p>
                </div>
              </div>
            ))}
          </div>

          {CAROUSEL_CONFIG.showArrowsOnDesktop && (
            <button
              className={`${styles.navButton} ${styles.navButtonRight} ${showDragPill ? styles.navButtonVisible : ""}`}
              onClick={() => {
                setIsPaused(true);
                scroll("right");
                setTimeout(() => setIsPaused(false), 2000);
              }}
              aria-label="Next testimonial"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          )}
        </div>
      </div>

      {CAROUSEL_CONFIG.showDragPillOnDesktop && (
        <div
          className={`
      ${styles.dragIndicator} 
      ${showDragPill ? styles.dragIndicatorVisible : ""} 
      ${isDraggingPill ? styles.dragIndicatorDragging : ""}
    `}
          onMouseDown={handlePillMouseDown}
          style={{
            transform: `translate(calc(-50% + ${pillOffset.x}px), calc(-50% + ${pillOffset.y}px))`,
          }}
        >
          Drag
        </div>
      )}
    </section>
  );
};
