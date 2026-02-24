import mongoose, { Schema } from "mongoose";

const badgeEnum = ["Silver", "Gold", "Platinum"];
const visibilityEnum = ["Public", "Private", "Hide"];

const ProfessionalProfileSchema = new Schema({
  // Personal Info
  name: { type: String, required: true },
  nameVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  nameBadge: { type: String, enum: badgeEnum, default: "Silver" },

  fatherName: { type: String, required: true },
  fatherNameVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  fatherNameBadge: { type: String, enum: badgeEnum, default: "Silver" },

  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  genderVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  genderBadge: { type: String, enum: badgeEnum, default: "Silver" },

  dob: { type: Date, required: true },
  dobVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  dobBadge: { type: String, enum: badgeEnum, default: "Silver" },

cnic: { type: String, required: true },
cnicVisibility: { type: String, enum: visibilityEnum, default: "Private" },
cnicBadge: { type: String, enum: badgeEnum, default: "Silver" },


  profilePicture: { type: String },
profilePictureVisibility: { type: String, enum: visibilityEnum, default: "Private" },
profilePictureBadge: { type: String, enum: badgeEnum, default: "Silver" },

  // Contact Info
  mobile: { type: String },
  mobileVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  mobileBadge: { type: String, enum: badgeEnum, default: "Silver" },

  email: { type: String, required: true },
  emailVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  emailBadge: { type: String, enum: badgeEnum, default: "Silver" },

  address: { type: String },
  addressVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  addressBadge: { type: String, enum: badgeEnum, default: "Silver" },

  city: { type: String },
  cityVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  cityBadge: { type: String, enum: badgeEnum, default: "Silver" },

  country: { type: String },
  countryVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  countryBadge: { type: String, enum: badgeEnum, default: "Silver" },

  // Nationality & Resident
  nationality: { type: String },
  nationalityVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  nationalityBadge: { type: String, enum: badgeEnum, default: "Silver" },

  residentStatus: {
    type: String,
    enum: ["Citizen", "Permanent Resident", "Work Visa", "Student Visa", "Other"],
  },
  residentStatusVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  residentStatusBadge: { type: String, enum: badgeEnum, default: "Silver" },

  shiftPreferences: [{ type: String }],
  shiftPreferencesVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  shiftPreferencesBadge: { type: String, enum: badgeEnum, default: "Silver" },

  workAuthorization: [{ type: String }],
  workAuthorizationVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  workAuthorizationBadge: { type: String, enum: badgeEnum, default: "Silver" },

  // Education
  education: [
    {
      degreeTitle: { type: String },
      degreeTitleVisibility: { type: String, enum: visibilityEnum, default: "Private" },
      degreeTitleBadge: { type: String, enum: badgeEnum, default: "Silver" },

      institute: { type: String },
      instituteVisibility: { type: String, enum: visibilityEnum, default: "Private" },
      instituteBadge: { type: String, enum: badgeEnum, default: "Silver" },

      startDate: { type: Date },
      startDateVisibility: { type: String, enum: visibilityEnum, default: "Private" },
      startDateBadge: { type: String, enum: badgeEnum, default: "Silver" },

      endDate: { type: Date },
      endDateVisibility: { type: String, enum: visibilityEnum, default: "Private" },
      endDateBadge: { type: String, enum: badgeEnum, default: "Silver" },

      verificationLevel: {
        type: String,
        enum: ["None", "Verified", "Rejected", "Silver"],
        default: "Silver",
      },

      degreeFile: { type: String },
      degreeFileVisibility: { type: String, enum: visibilityEnum, default: "Private" },
      degreeFileBadge: { type: String, enum: badgeEnum, default: "Silver" },

      website: { type: String },
      websiteVisibility: { type: String, enum: visibilityEnum, default: "Private" },
      websiteBadge: { type: String, enum: badgeEnum, default: "Silver" },
    },
  ],

  // Experience
  experience: [
    {
      jobTitle: { type: String },
      jobTitleVisibility: { type: String, enum: visibilityEnum, default: "Private" },
      jobTitleBadge: { type: String, enum: badgeEnum, default: "Silver" },

      company: { type: String },
      companyVisibility: { type: String, enum: visibilityEnum, default: "Private" },
      companyBadge: { type: String, enum: badgeEnum, default: "Silver" },

      startDate: { type: Date },
      startDateVisibility: { type: String, enum: visibilityEnum, default: "Private" },
      startDateBadge: { type: String, enum: badgeEnum, default: "Silver" },

      endDate: { type: Date },
      endDateVisibility: { type: String, enum: visibilityEnum, default: "Private" },
      endDateBadge: { type: String, enum: badgeEnum, default: "Silver" },

      verificationLevel: {
        type: String,
        enum: ["None", "Verified", "Rejected", "Silver"],
        default: "Silver",
      },

      fileUrl: { type: String },
      fileUrlVisibility: { type: String, enum: visibilityEnum, default: "Private" },
      fileUrlBadge: { type: String, enum: badgeEnum, default: "Silver" },

      jobFunctions: [{ type: String }],
      jobFunctionsVisibility: { type: String, enum: visibilityEnum, default: "Private" },
      jobFunctionsBadge: { type: String, enum: badgeEnum, default: "Silver" },

      industry: { type: String },
      industryVisibility: { type: String, enum: visibilityEnum, default: "Private" },
      industryBadge: { type: String, enum: badgeEnum, default: "Silver" },

      website: { type: String },
      websiteVisibility: { type: String, enum: visibilityEnum, default: "Private" },
      websiteBadge: { type: String, enum: badgeEnum, default: "Silver" },
    },
  ],

  // Images & Documents
  profileImageUrl: { type: String },
  profileImageUrlVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  profileImageUrlBadge: { type: String, enum: badgeEnum, default: "Silver" },

  pdfUrl: { type: String },
  pdfUrlVisibility: { type: String, enum: visibilityEnum, default: "Private" },
  pdfUrlBadge: { type: String, enum: badgeEnum, default: "Silver" },

  createdAt: { type: Date, default: Date.now },
});
ProfessionalProfileSchema.index({ cnic: 1 });


const ProfileModel = mongoose.model("ProfileSubmission", ProfessionalProfileSchema);
export default ProfileModel;
