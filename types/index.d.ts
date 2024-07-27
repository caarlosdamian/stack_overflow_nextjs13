import { BADGE_CRITERIA } from "@/constants";

export interface SidebarLink {
  imgURL: string;
  route: string;
  label: string;
}

export interface Job {
  id?: string;
  employer_name?: string;
  employer_logo?: string | undefined;
  employer_website?: string;
  job_employment_type?: string;
  job_title?: string;
  job_description?: string;
  job_apply_link?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
}

export interface Country {
  name: {
    common: string;
  };
}

export interface ParamsProps {
  params: { id: string };
}

export interface SearchParamsProps {
  searchParams: { [key: string]: string | undefined };
}

export interface URLProps {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}

export interface BadgeCounts {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}

export type BadgeCriteriaType = keyof typeof BADGE_CRITERIA;



interface Jobhighlights {
}

interface Jobrequirededucation {
  postgraduate_degree: boolean;
  professional_certification: boolean;
  high_school: boolean;
  associates_degree: boolean;
  bachelors_degree: boolean;
  degree_mentioned: string;
  degree_preferred: string;
  professional_certification_mentioned: string;
}

interface Jobrequiredexperience {
  no_experience_required: string;
  required_experience_in_months: null;
  experience_mentioned: string;
  experience_preferred: string;
}

interface Applyoption {
  publisher: string;
  apply_link: string;
  is_direct: boolean;
}

export interface JobI {
  job_id: string;
  employer_name: string;
  employer_logo: string;
  employer_website: string;
  employer_company_type: null;
  employer_linkedin: string;
  job_publisher: string;
  job_employment_type: string;
  job_title: string;
  job_apply_link: string;
  job_apply_is_direct: boolean;
  job_apply_quality_score: number;
  apply_options: Applyoption[];
  job_description: string;
  job_is_remote: boolean;
  job_posted_at_timestamp: number;
  job_posted_at_datetime_utc: string;
  job_city: string;
  job_state: string;
  job_country: string;
  job_latitude: number;
  job_longitude: number;
  job_benefits: null;
  job_google_link: string;
  job_offer_expiration_datetime_utc: null;
  job_offer_expiration_timestamp: null;
  job_required_experience: Jobrequiredexperience;
  job_required_skills: null;
  job_required_education: Jobrequirededucation;
  job_experience_in_place_of_education: boolean;
  job_min_salary: null;
  job_max_salary: null;
  job_salary_currency: null;
  job_salary_period: null;
  job_highlights: Jobhighlights;
  job_job_title: string;
  job_posting_language: string;
  job_onet_soc: string;
  job_onet_job_zone: null;
  job_occupational_categories: null;
  job_naics_code: string;
  job_naics_name: string;
}
