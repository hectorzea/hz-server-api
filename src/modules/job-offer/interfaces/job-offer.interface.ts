export interface JobOffer {
  allowRelocation: boolean;
  yearsOfExperience: string;
  salaryRange: null;
  recruitmentProcessSteps: string[];
  jobLink: string;
  companyName: string;
  considerations: string[];
  hardSkills: HardSkills;
  jobDescription: string;
  jobTitle: string;
  location: string;
  softSkills: string[];
  teamSize: null;
  workEnvironment: string;
  matchPercentage: number;
  matchReasoningKeyPoints: string[];
}

export interface HardSkills {
  frontend: string[];
  backend: string[];
  cicd: string[];
  testing: string[];
  extras: string[];
}

export interface JobOfferRequestBody {
  linkedinJobUrl: string;
}
