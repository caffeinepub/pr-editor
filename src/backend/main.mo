import Time "mo:core/Time";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  
  include MixinStorage();

  module MediaType {
    public type MediaType = {
      #audio;
      #video;
      #image;
      #sticker;
      #filter;
      #effect;
      #template;
    };
  };

  module JobType {
    public type JobType = {
      #autoCut;
      #remover;
      #textToVideo;
      #imageToVideo;
      #captions;
      #tts;
    };
  };

  module JobStatus {
    public type JobStatus = {
      #pending;
      #processing;
      #complete;
      #failed;
    };
  };

  module Language {
    public type Language = {
      #en;
      #te;
      #hi;
    };
  };

  public type Project = {
    id : Text;
    name : Text;
    owner : Principal;
    createdAt : Time.Time;
    mediaFiles : [MediaEntry];
    captions : [Caption];
  };

  public type MediaEntry = {
    id : Text;
    mediaType : MediaType.MediaType;
    category : Text;
    file : Storage.ExternalBlob;
  };

  public type AIJob = {
    id : Text;
    owner : Principal;
    jobType : JobType.JobType;
    status : JobStatus.JobStatus;
    createdAt : Time.Time;
    inputData : ?Storage.ExternalBlob;
    resultData : ?Storage.ExternalBlob;
  };

  public type Caption = {
    text : Text;
    language : Language.Language;
    timestamp : Nat; // milliseconds
  };

  public type UserProfile = {
    name : Text;
  };

  module Project {
    public func compare(p1 : Project, p2 : Project) : Order.Order {
      Text.compare(p1.id, p2.id);
    };
  };

  let projects = Map.empty<Text, Project>();
  let jobs = Map.empty<Text, AIJob>();
  let mediaLibrary = Map.empty<Text, MediaEntry>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  public type CreateProjectArgs = {
    name : Text;
    mediaFiles : [MediaEntry];
    captions : [Caption];
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Project Management
  public shared ({ caller }) func createProject(args : CreateProjectArgs) : async Project {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create projects");
    };
    
    let projectId = args.name.concat(Time.now().toText());
    let project : Project = {
      id = projectId;
      name = args.name;
      owner = caller;
      createdAt = Time.now();
      mediaFiles = args.mediaFiles;
      captions = args.captions;
    };
    projects.add(projectId, project);
    project;
  };

  public query ({ caller }) func getProject(id : Text) : async ?Project {
    switch (projects.get(id)) {
      case (null) { null };
      case (?project) {
        // Users can only view their own projects unless they're admin
        if (project.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own projects");
        };
        ?project;
      };
    };
  };

  public query ({ caller }) func getAllProjects() : async [Project] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all projects");
    };
    projects.values().toArray().sort();
  };

  public shared ({ caller }) func updateProject(id : Text, args : CreateProjectArgs) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update projects");
    };
    
    switch (projects.get(id)) {
      case (null) {
        Runtime.trap("Project not found");
      };
      case (?existingProject) {
        // Only owner or admin can update
        if (existingProject.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the project owner can update this project");
        };
        
        let updatedProject : Project = {
          id = existingProject.id;
          name = args.name;
          owner = existingProject.owner;
          createdAt = existingProject.createdAt;
          mediaFiles = args.mediaFiles;
          captions = args.captions;
        };
        projects.add(id, updatedProject);
      };
    };
  };

  public shared ({ caller }) func deleteProject(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete projects");
    };
    
    switch (projects.get(id)) {
      case (null) {
        Runtime.trap("Project not found");
      };
      case (?project) {
        // Only owner or admin can delete
        if (project.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the project owner can delete this project");
        };
        projects.remove(id);
      };
    };
  };

  // Media Library Management
  public shared ({ caller }) func addMediaEntry(media : MediaEntry) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add media entries");
    };
    mediaLibrary.add(media.id, media);
  };

  public query ({ caller }) func getMediaEntry(id : Text) : async ?MediaEntry {
    // Any authenticated user can view media library
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access media library");
    };
    mediaLibrary.get(id);
  };

  public query ({ caller }) func getAllMediaByType(mediaType : MediaType.MediaType) : async [MediaEntry] {
    // Any authenticated user can browse media library
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access media library");
    };
    mediaLibrary.values().toArray().filter(
      func(entry) {
        entry.mediaType == mediaType;
      }
    );
  };

  public shared ({ caller }) func deleteMediaEntry(id : Text) : async () {
    // Only admins can delete from media library
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete media entries");
    };
    mediaLibrary.remove(id);
  };

  // AI Job Management
  public shared ({ caller }) func createAIJob(jobType : JobType.JobType, inputData : ?Storage.ExternalBlob) : async AIJob {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create AI jobs");
    };
    
    let jobId = Time.now().toText();
    let job : AIJob = {
      id = jobId;
      owner = caller;
      jobType;
      status = #pending;
      createdAt = Time.now();
      inputData;
      resultData = null;
    };
    jobs.add(jobId, job);
    job;
  };

  public shared ({ caller }) func updateJobStatus(jobId : Text, status : JobStatus.JobStatus, resultData : ?Storage.ExternalBlob) : async () {
    switch (jobs.get(jobId)) {
      case (null) {
        Runtime.trap("Job not found");
      };
      case (?existingJob) {
        // Only job owner or admin can update job status
        if (existingJob.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the job owner can update this job");
        };
        
        let updatedJob : AIJob = {
          id = existingJob.id;
          owner = existingJob.owner;
          jobType = existingJob.jobType;
          status;
          createdAt = existingJob.createdAt;
          inputData = existingJob.inputData;
          resultData;
        };
        jobs.add(jobId, updatedJob);
      };
    };
  };

  public query ({ caller }) func getJob(jobId : Text) : async ?AIJob {
    switch (jobs.get(jobId)) {
      case (null) { null };
      case (?job) {
        // Users can only view their own jobs unless they're admin
        if (job.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own jobs");
        };
        ?job;
      };
    };
  };

  public query ({ caller }) func getUserJobs() : async [AIJob] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access jobs");
    };
    
    jobs.values().toArray().filter(
      func(job) {
        job.owner == caller;
      }
    );
  };

  public query ({ caller }) func getAllJobs() : async [AIJob] {
    // Only admins can view all jobs
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all jobs");
    };
    jobs.values().toArray();
  };

  // Project queries
  public query ({ caller }) func getUserProjects(user : Principal) : async [Project] {
    // Users can only view their own projects, admins can view any user's projects
    if (user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own projects");
    };
    
    projects.values().toArray().filter(
      func(project) {
        project.owner == user;
      }
    );
  };

  public query ({ caller }) func getMyProjects() : async [Project] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access projects");
    };
    
    projects.values().toArray().filter(
      func(project) {
        project.owner == caller;
      }
    );
  };
};
