import { useState, useRef, useEffect, useMemo } from "react";
import { useScholarshipStore } from "../../../app/store";
import styles from "./FAQSection.module.scss";

export const FAQSection = () => {
  const { data } = useScholarshipStore();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [filter, setFilter] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const faqs = useMemo(
    () => data?.scholarship?.faqs?.items || [],
    [data?.scholarship?.faqs?.items],
  );

  const categories = useMemo(
    () => data?.scholarship?.faqs?.categories || [],
    [data?.scholarship?.faqs?.categories],
  );

  const filterOptions = useMemo(() => ["All", ...categories], [categories]);

  const filteredFaqs = useMemo(() => {
    if (filter === "All") return faqs;
    return faqs.filter((faq) => faq.type === filter);
  }, [faqs, filter]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleItem = (index: number) => {
    if (!hasInteracted) setHasInteracted(true);
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!faqs.length) return null;

  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.topRow}>
        <h2 className={styles.title}>
          Frequently asked
          <br />
          questions
        </h2>

        <div className={styles.filterWrapper} ref={filterRef}>
          <span className={styles.filterLabel}>Filter by:</span>
          <button
            className={styles.filterTrigger}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            aria-haspopup="listbox"
            aria-expanded={isFilterOpen}
          >
            {filter}
            <svg
              className={`${styles.filterArrow} ${isFilterOpen ? styles.filterArrowOpen : ""}`}
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {isFilterOpen && (
            <ul className={styles.filterMenu} role="listbox">
              {filterOptions.map((option) => (
                <li
                  key={option}
                  role="option"
                  aria-selected={filter === option}
                  className={`${styles.filterItem} ${filter === option ? styles.filterItemActive : ""}`}
                  onClick={() => {
                    setFilter(option);
                    setIsFilterOpen(false);
                    setOpenIndex(null);
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className={styles.faqList}>
        {filteredFaqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={index} className={styles.faqItem}>
              <div className={styles.faqCategory}>{faq.type}</div>

              <div className={styles.faqContent}>
                <p
                  className={styles.faqQuestion}
                  onClick={() => toggleItem(index)}
                >
                  {faq.question}
                </p>

                <div
                  className={`${styles.faqAnswer} ${isOpen ? styles.faqAnswerOpen : ""}`}
                >
                  <div className={styles.faqAnswerInner}>
                    {faq.answer.map((block, i) => (
                      <p key={i} className={styles.faqAnswerText}>
                        {block.data}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <button
                className={`
    ${styles.toggleButton} 
    ${isOpen ? styles.toggleButtonOpen : ""} 
    ${hasInteracted ? styles.toggleButtonAnimated : ""}
  `}
                onClick={() => toggleItem(index)}
                aria-label={isOpen ? "Collapse answer" : "Expand answer"}
                aria-expanded={isOpen}
              >
                <svg viewBox="0 0 40 40" className={styles.toggleSvg}>
                  <circle cx="20" cy="20" r="17" className={styles.toggleBg} />

                  <circle
                    cx="20"
                    cy="20"
                    r="17"
                    className={styles.borderGrey}
                  />

                  <circle
                    cx="20"
                    cy="20"
                    r="17"
                    className={styles.borderPurple}
                  />

                  <g className={styles.iconGroup}>
                    <line
                      x1="13"
                      y1="20"
                      x2="27"
                      y2="20"
                      className={styles.iconLine}
                    />
                    <line
                      x1="20"
                      y1="13"
                      x2="20"
                      y2="27"
                      className={`${styles.iconLine} ${styles.iconLineVertical}`}
                    />
                  </g>
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
