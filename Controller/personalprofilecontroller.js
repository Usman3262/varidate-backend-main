import uploadToCloudinary from "../Middleware/Cloudinaryuploader.js";
import ProfileModel from "../Model/profilesubmission.js";


export const createProfile = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['name', 'email', 'cnic', 'fatherName'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // File validation
 if (!req.files?.resume?.[0] || !req.files?.profilePicture?.[0]) {
  return res.status(400).json({
    success: false,
    message: 'Both resume and profile picture are required'
  });
}

    // Process main files (resume, CNIC)
  const [resumeUrl, profilePictureUrl] = await Promise.all([
  uploadToCloudinary(req.files.resume[0].buffer, "resumes"),
  uploadToCloudinary(req.files.profilePicture[0].buffer, "profile_pictures")
]);

    // Process education files with error handling
    const education = await Promise.all(
      req.body.education?.map(async (edu, index) => {
        try {
          const file = req.files.degreeFiles?.[index];
          const degreeFile = file ? await uploadToCloudinary(file.buffer, "education_files") : null;
          
          return {
            degreeTitle: edu.degreeTitle,
            degreeTitleVisibility: edu.degreeTitleVisibility || "Private",
            institute: edu.institute,
            instituteVisibility: edu.instituteVisibility || "Private",
            startDate: edu.startDate,
            startDateVisibility: edu.startDateVisibility || "Private",
            endDate: edu.endDate,
            endDateVisibility: edu.endDateVisibility || "Private",
            website: edu.website,
            websiteVisibility: edu.websiteVisibility || "Private",
            degreeFile,
            degreeFileVisibility: edu.degreeFileVisibility || "Private",
            verificationLevel: "None"
          };
        } catch (error) {
          console.error(`Error processing education file ${index}:`, error);
          return {
            ...edu,
            degreeFile: null,
            uploadError: 'Failed to upload document'
          };
        }
      }) || []
    );

    // Process experience files with error handling
    const experience = await Promise.all(
      req.body.experience?.map(async (exp, index) => {
        try {
          const file = req.files.experienceFiles?.[index];
          const fileUrl = file ? await uploadToCloudinary(file.buffer, "experience_files") : null;
          
          return {
            jobTitle: exp.jobTitle,
            jobTitleVisibility: exp.jobTitleVisibility || "Private",
            company: exp.company,
            companyVisibility: exp.companyVisibility || "Private",
            startDate: exp.startDate,
            startDateVisibility: exp.startDateVisibility || "Private",
            endDate: exp.endDate,
            endDateVisibility: exp.endDateVisibility || "Private",
            jobFunctions: exp.jobFunctions,
            jobFunctionsVisibility: exp.jobFunctionsVisibility || "Private",
            industry: exp.industry,
            industryVisibility: exp.industryVisibility || "Private",
            website: exp.website,
            websiteVisibility: exp.websiteVisibility || "Private",
            fileUrl,
            fileUrlVisibility: exp.fileUrlVisibility || "Private",
            verificationLevel: exp.verificationLevel || "None"
          };
        } catch (error) {
          console.error(`Error processing experience file ${index}:`, error);
          return {
            ...exp,
            fileUrl: null,
            uploadError: 'Failed to upload document'
          };
        }
      }) || []
    );

    // Create and save profile
    const newProfile = new ProfileModel({
      name: req.body.name,
      nameVisibility: req.body.nameVisibility,
      fatherName: req.body.fatherName,
      fatherNameVisibility: req.body.fatherNameVisibility,
      gender: req.body.gender,
      genderVisibility: req.body.genderVisibility,
      dob: req.body.dob,
      dobVisibility: req.body.dobVisibility,
      cnic: req.body.cnic,
      cnicVisibility: req.body.cnicVisibility,
      mobile: req.body.mobile,
      mobileVisibility: req.body.mobileVisibility,
      email: req.body.email,
      emailVisibility: req.body.emailVisibility,
      city: req.body.city,
      cityVisibility: req.body.cityVisibility,
      country: req.body.country,
      countryVisibility: req.body.countryVisibility,
      nationality: req.body.nationality,
      nationalityVisibility: req.body.nationalityVisibility,
      residentStatus: req.body.residentStatus,
      residentStatusVisibility: req.body.residentStatusVisibility,
      shiftPreferences: req.body.shiftPreferences,
      shiftPreferencesVisibility: req.body.shiftPreferencesVisibility,
      workAuthorization: req.body.workAuthorization,
      workAuthorizationVisibility: req.body.workAuthorizationVisibility,
      profilePicture: profilePictureUrl,
  profilePictureVisibility: req.body.profilePictureVisibility || "Private",
      resumeUrl,
      education,
      experience
    });

    await newProfile.save();
    return res.status(201).json({
      success: true,
      data: newProfile,
      message: 'Profile created successfully'
    });
  } catch (error) {
    console.error("Error creating profile:", error);

    if (error.name === 'ValidationError') {
      // Create human-readable error messages
      const errorMessages = [];
      Object.keys(error.errors).forEach(key => {
        const err = error.errors[key];
        if (err.kind === 'required') {
          errorMessages.push(`${key} is required`);
        } else if (err.kind === 'enum') {
          errorMessages.push(`Invalid value for ${key}. Allowed values: ${err.properties.enum.join(', ')}`);
        } else {
          errorMessages.push(err.message);
        }
      });
      
      return res.status(400).json({
        success: false,
        message: errorMessages.join('. '),
        errors: error.errors
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


export const getPublicProfiles = async (req, res) => {
  try {
    const allProfiles = await ProfileModel.find({});
    
    const publicProfiles = allProfiles.map(profile => {
      const publicProfile = { _id: profile._id };
      
      // Process top-level fields
      const fields = Object.keys(profile.toObject());
      fields.forEach(field => {
        if (field.endsWith('Visibility') || field.endsWith('Badge') || field.startsWith('_')) return;
        
        const visibilityField = `${field}Visibility`;
        if (profile[visibilityField] === 'Public') {
          publicProfile[field] = profile[field];
        }
      });

      // Process education array - modified to be less aggressive
      if (profile.education && profile.education.length > 0) {
        publicProfile.education = profile.education.map(edu => {
          const publicEdu = {};
          let hasPublicFields = false;
          
          Object.keys(edu).forEach(key => {
            if (!key.endsWith('Visibility') && !key.endsWith('Badge') && key !== '_id') {
              const visibility = edu[`${key}Visibility`];
              // If visibility is undefined or Public, include the field
              if (!visibility || visibility === 'Public') {
                publicEdu[key] = edu[key];
                hasPublicFields = true;
              }
            }
          });
          
          return hasPublicFields ? publicEdu : null;
        }).filter(edu => edu !== null); 
      }

      // Process experience array - modified to be less aggressive
      if (profile.experience && profile.experience.length > 0) {
        publicProfile.experience = profile.experience.map(exp => {
          const publicExp = {};
          let hasPublicFields = false;
          
          Object.keys(exp).forEach(key => {
            if (!key.endsWith('Visibility') && !key.endsWith('Badge') && key !== '_id') {
              const visibility = exp[`${key}Visibility`];
              // If visibility is undefined or Public, include the field
              if (!visibility || visibility === 'Public') {
                publicExp[key] = exp[key];
                hasPublicFields = true;
              }
            }
          });
          
          return hasPublicFields ? publicExp : null;
        }).filter(exp => exp !== null);
      }

      return publicProfile;
    }).filter(profile => {
      // Keep profile if it has at least one public field besides _id
      return Object.keys(profile).length > 1 || 
             (profile.education && profile.education.length > 0) ||
             (profile.experience && profile.experience.length > 0);
    });

    return res.status(200).json({
      success: true,
      profiles: publicProfiles
    });
  } catch (error) {
    console.error("Error getting public profiles:", error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


export const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await ProfileModel.findById(id).lean();

    if (!profile) {
      return res.status(404).json({ 
        success: false,
        message: 'Profile not found' 
      });
    }

    const filterByVisibility = (obj) => {
      const filtered = {};

      for (const key in obj) {
        if (
          key === '_id' || 
          key === '__v' || 
          key.endsWith('Visibility') || 
          key.endsWith('Badge')
        ) continue;

        const visibilityKey = `${key}Visibility`;

        // Handle education and experience arrays separately
        if (key === 'education' && Array.isArray(obj[key])) {
          filtered.education = obj.education.map(item => {
            const filteredEdu = {};
            for (const field in item) {
              const visibility = item[`${field}Visibility`];
              if (
                !field.endsWith('Visibility') &&
                !field.endsWith('Badge') &&
                (visibility === 'Public' || visibility === undefined)
              ) {
                filteredEdu[field] = item[field];
              }
            }
            return Object.keys(filteredEdu).length ? filteredEdu : null;
          }).filter(item => item !== null);
        } else if (key === 'experience' && Array.isArray(obj[key])) {
          filtered.experience = obj.experience.map(item => {
            const filteredExp = {};
            for (const field in item) {
              const visibility = item[`${field}Visibility`];
              if (
                !field.endsWith('Visibility') &&
                !field.endsWith('Badge') &&
                (visibility === 'Public' || visibility === undefined)
              ) {
                filteredExp[field] = item[field];
              }
            }
            return Object.keys(filteredExp).length ? filteredExp : null;
          }).filter(item => item !== null);
        } 
        
        // Handle top-level fields
        else if (obj[visibilityKey] === 'Public') {
          filtered[key] = obj[key];
        }
      }

      return filtered;
    };

    const publicProfile = filterByVisibility(profile);

    res.status(200).json({
      success: true,
      profile: publicProfile,
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Helper function to filter out private fields


// Helper function to filter out private fields
