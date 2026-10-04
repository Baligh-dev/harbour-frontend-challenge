export interface RichText {
  type: string;
  data: string;
}

export interface ListData {
  type: string;
  data: string[];
}

export interface Location {
  id: number;
  name: string;
  longitude: number;
  latitude: number;
  description: string;
  country_id: number;
  acronym: string;
}

export interface FAQItem {
  type: string;
  question: string;
  answer: RichText[];
}

export interface FAQs {
  items: FAQItem[];
  categories: string[];
}

export interface WhatYouWillLearnItem {
  title: string;
  data: string;
}

export interface ApplicationProcessStep {
  title: string;
  description: RichText[];
}

export interface CompanyLogo {
  src: string;
  title: string;
}

export interface Company {
  id: number;
  name: string;
  type: string;
  color: string;
  website: string | null;
  rank: number;
  description: RichText[];
  logo_light: CompanyLogo;
  logo_dark: CompanyLogo;
}

export interface Picture {
  src: string;
  title: string;
}

export interface Country {
  id: number;
  country_name: string;
  display_name: string;
  country_code: string;
  country_flag: string;
  country_phone_code: string;
}

export interface Person {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  slug: string;
  category: string;
  small_picture: Picture;
  profile_picture: Picture;
  current_position: string;
  country: Country;
}

export interface ProgramPhoto {
  src: string;
  title: string;
}

export interface Program {
  id: number;
  name: string;
  about: string;
  discipline: string;
  snippet: string;
  description: RichText[];
  focus: string;
  link: string;
  available: boolean;
  application_process: ApplicationProcessStep[];
  photos: ProgramPhoto[];
  program_logo: string;
  // json_logo is intentionally omitted here as it's a massive Lottie string
}

export interface Scholarship {
  id: number;
  name: string;
  description: RichText[];
  location: Location;
  scholarship_start_date: string;
  application_end_date: string;
  duration: number;
  position: string;
  about: RichText[];
  tuition: number;
  total_value: number;
  stipend_per_month: number;
  stipend_per_year: number;
  remaining: number;
  study_commitment: number;
  internship_commitment: number;
  study_commitment_text: string;
  internship_commitment_text: string;
  work_commitment: number;
  work_commitment_duration: string;
  work_commitment_type: string;
  credits: number;
  courses: number;
  degree: string;
  what_you_will_learn: WhatYouWillLearnItem[];
  internship_description: RichText[];
  internship_expectation: ListData;
  internship_potential_roles: ListData;
  program_director_ids: number[];
  program_instructor_ids: number[];
  who_should_apply_text: RichText[];
  university_requirements: ListData;
  internship_requirements: ListData;
  encourage_text: RichText[];
  faqs: FAQs;
  program: Program;
  company: Company;
  directors: Person[];
  instructors: Person[];
  mentors: Person[];
}

export interface Meta {
  id: number;
  title: string;
  description: string;
  abstract: string;
  keywords: string;
  meta_image: string | null;
}

export interface OGMeta {
  id: number;
  page_url: string;
  title: string;
  desc: string;
  image_url: string;
}

export interface Testimonial {
  id: number | string;      // number for real data, string for clones
  name: string;
  role: string;
  quote: string;
  education: string;
  avatar: string;
}

// --- Root Interface ---

export interface ScholarshipData {
  id: number;
  scope: string;
  slug: string;
  is_published: boolean;
  scholarship: Scholarship;
  meta: Meta;
  og_meta: OGMeta;
  testimonials: Testimonial[];
}

export const fetchScholarshipData = async (): Promise<ScholarshipData> => {
  const response = await fetch('/api/scholarship_pages/data-science-apprenticeship-zeptolab');
  if (!response.ok) {
    throw new Error('Failed to fetch scholarship data');
  }
  return response.json();
};