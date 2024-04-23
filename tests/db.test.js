const mongoose = require("mongoose");
const { setJobSchemaID, insertJob, insertAllJobs } = require("../db/InsertJob");
const JobSchema = require("../schema/JobSchema");
require("dotenv").config();

let job_example = {
  id: "QSxpLHUsdCxvLCAsYyx1LG8sYyxvLCAscCxlLHIsICxyLGkscyx0LG8scixhLG4sdCxlLFIsRSxTLFQ=",
  title: "Aiuto cuoco per ristorante",
  company: "RESTWORLD S.R.L.",
  description:
    "Roberto Restaurant, rinomato ristorante a Barlassina cerca un Aiuto Cuoco appassionato e talentuoso per unirsi al suo team.\n\nCon almeno 2 anni di esperienza nel ruolo di aiuto cuoco, il candidato ideale dovrÃ dimostrare competenze in taglio, conservazione delle materie prime, pulizia dell'area di lavoro e autonomia nella gestione dei compiti assegnati.\n\nIl locale si distingue per una proposta culinaria semplice e autentica, che valorizza la stagionalitÃ degli ingredienti e la qualitÃ delle materie prime locali. Il menÃ¹, curato con maestria dallo chef, soddisfa i palati piÃ¹ esigenti con un tocco creativo unico. Per accompagnare le prelibatezze, un'accurata selezione di vini che completa l'esperienza gastronomica.\n\nSe sei appassionato di cucina, attento ai dettagli e desideri far parte di un team dinamico e creativo, invia il tuo curriculum per unirsi a questa avventura culinaria unica a Barlassina. Contratto a tempo determinato con prospettive di assunzione. Tempo pieno.\n\nÃˆ offerto... un contratto a tempo determinato con finalitÃ di assunzione a tempo indeterminato con turni spezzati per 5 giorni su 7. Sono garantiti due giorni di riposo fissi: il lunedÃ¬ e il martedÃ¬. Lo stipendio mensile si aggira intorno ai 1500-1700â‚¬.\n\nCategoria\n\nTurismo, ristorazione - Ristorazione\n\nLivello\n\nImpiegato\n\nNumero di posti vacanti\n\n1\n\nStipendio\n\nStipendio: 1.500€ - 1.800€ Netti/mese\n\nTitolo di studio minimo\n\nSenza studi\n\nEsperienza minima\n\n1 anno",
  image: "",
  location: "Barlassina MB, Italia",
  employmentType: "Full-time e Temporaneo",
  datePosted: "27 giorni fa",
  salaryRange: "1500 €–1800 € al mese",
  jobProviders: [
    {
      jobProvider: "InfoJobs",
      url: "https://www.infojobs.it/barlassina/aiuto-cuoco-per-ristorante/of-i730c3dcc584343a7472ec94ac24f77?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic",
    },
    {
      jobProvider: "Lavoro Trabajo.org",
      url: "https://it.trabajo.org/offerta-2194-dc7484a795b8d8c227fd91da2fe72de0?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic",
    },
  ],
  searchDate: Date.now(),
};

const response_example_2 = {
  jobs: [
    {
      id: "UyxvLGYsdCx3LGEscixlLCAsRSxuLGcsaSxuLGUsZSxyLCwsICxKLHUsbixpLG8scixCLG8sbyx6LCA=",
      title: "Software Engineer, Junior",
      company: "Booz Allen Hamilton",
      description:
        "Software Engineer, Junior\n\nThe Opportunity:\n\nAs a back-end developer, you know that a good site or system needs the right combination of clean code, APIs, analytics, and infrastructure to develop a user-focused solution. We're looking for an experienced back-end developer with the software engineering skills it takes to identify potential risks, contribute to solution development, and create efficient and effective systems for our clients.\n\nAs a back-end developer at Booz Allen, you'll use the latest architectural approaches and open-source frameworks and tools to deliver solutions. Using your software engineering experience, you'll work with the development team to create custom tools, systems, and sites with consistent performance and scalability. In this role, you'll make a mission-forward impact as you further your skillset and career. Work with us as we shape systems for the better.\n\nJoin us. The world can't wait.\n\nYou Have:\n• Experience with programming languages, including... Java, Python, or C or C++\n• Knowledge of Object Oriented Programming (OOP) concepts\n• Ability to work with Linux or Windows\n• Ability to work in an Agile, team-based environment\n• Ability to obtain a security clearance\n• HS diploma or GED\n\nNice If You Have:\n• Experience with deploying software in a Cloud environment\n• Experience with frontend and backend development\n• Experience with Build Automation, DevOps, and DevSecOps\n• Experience with Software and System Architecture\n• Experience with physical or virtual networking\n• Experience with XML and JSON processing\n• Experience with image processing\n• Secret clearance\n• Bachelor's degree in a Science, Technology, Engineering, or Mathematics (STEM) field\n\nClearance:\n\nApplicants selected will be subject to a security investigation and may need to meet eligibility requirements for access to classified information.\n\nCreate Your Career:\n\nGrow With Us\n\nYour growth matters to us-that's why we offer a variety of ways for you to develop your career. With professional and leadership development opportunities like upskilling programs, tuition reimbursement, mentoring, and firm-sponsored networking, you can chart a unique and fulfilling career path on your own terms.\n\nA Place Where You Belong\n\nDiverse perspectives cultivate collective ingenuity. Booz Allen's culture of respect, equity, and opportunity means that, here, you are free to bring your whole self to work. With an array of business resource groups and other opportunities for connection, you'll develop your community in no time.\n\nSupport Your Well-Being\n\nOur comprehensive benefits package includes wellness programs with HSA contributions, paid holidays, paid parental leave, a generous 401(k) match, and more. With these benefits, plus the option for flexible schedules and remote and hybrid locations, we'll support you as you pursue a balanced, fulfilling life-at work and at home.\n\nYour Candidate Journey\n\nAt Booz Allen, we know our people are what propel us forward, and we value relationships most of all. Here, we've compiled a list of resources so you'll know what to expect as we forge a connection with you during your journey as a candidate with us.\n\nCompensation\n\nAt Booz Allen, we celebrate your contributions, provide you with opportunities and choices, and support your total well-being. Our offerings include health, life, disability, financial, and retirement benefits, as well as paid leave, professional development, tuition assistance, work-life programs, and dependent care. Our recognition awards program acknowledges employees for exceptional performance and superior demonstration of our values. Full-time and part-time employees working at least 20 hours a week on a regular basis are eligible to participate in Booz Allen's benefit programs. Individuals that do not meet the threshold are only eligible for select offerings, not inclusive of health benefits. We encourage you to learn more about our total benefits by visiting the Resource page on our Careers site and reviewing Our Employee Benefits page.\n\nSalary at Booz Allen is determined by various factors, including but not limited to location, the individual's particular combination of education, knowledge, skills, competencies, and experience, as well as contract-specific affordability and organizational requirements. The projected compensation range for this position is $51,600.00 to $105,000.00 (annualized USD). The estimate displayed represents the typical salary range for this position and is just one component of Booz Allen's total compensation package for employees. This posting will close within 90 days from the Posting Date.\n\nWork Model\n\nOur people-first culture prioritizes the benefits of flexibility and collaboration, whether that happens in person or remotely.\n• If this position is listed as remote or hybrid, you'll periodically work from a Booz Allen or client site facility.\n• If this position is listed as onsite, you'll work with colleagues and clients in person, as needed for the specific role.\n\nEEO Commitment\n\nWe're an equal employment opportunity/affirmative action employer that empowers our people to fearlessly drive change - no matter their race, color, ethnicity, religion, sex (including pregnancy, childbirth, lactation, or related medical conditions), national origin, ancestry, age, marital status, sexual orientation, gender identity and expression, disability, veteran status, military or uniformed service member status, genetic information, or any other status protected by applicable federal, state, local, or international law",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0OK8VqK5Je_n-QComZ0V5AzZYHfqOTimnH6He&s=0",
      location: "Roma RM, Italia",
      employmentType: "Full-time e Part-time",
      datePosted: "2 giorni fa",
      salaryRange: "51.600–105.000 all'anno",
      jobProviders: [
        {
          jobProvider: "Built In",
          url: "https://builtin.com/job/software-engineer-junior/2456751?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic",
        },
      ],
    },
    {
      id: "UyxvLGYsdCx3LGEscixlLCAsRSxuLGcsaSxuLGUsZSxyLFAscixvLGEsYyx0LGksdixlLCAsRyxsLG8=",
      title: "Software Engineer",
      company: "Proactive Global",
      description:
        "One of the world's largest providers of modular warehouse and logistics systems is looking for Software Engineer to join their team. It's a great opportunity to join company which has long-term vision strategy and values stability and sustainable growth.\n\nResponsibilities:\n• Developing software customisation based on provided technical specifications.\n• Testing the developed software to verify correct functionality and compliance with requested specifications.\n• Creating technical documentation for software operation.\n• Installing software remotely and/or at client sites.\n• Training user personnel from the client company.\n• Providing second-level assistance to clients after software installation.\n\nRequirements:\n• Software development for business process management (Knowledge of MICROSOFT .NET is a plus).\n• Relational databases (MS SQL SERVER / Oracle, even at a basic level).\n• Italian (native)\n• English language proficiency (B2 level).\n• Proficiency in the Microsoft Office... suite.\n\nReasons why you should apply:\n• Opportunity to join future-oriented workplace\n• Opportunity to develop state-of-the-art technologies\n• Familiar working environment\n• Attractive benefits\n\nHow to Apply:\n\nFor more information on the role, or an informal discussion regarding opportunities we have available, please contact Ligia Serwinowska: lserwinowska@proactiveglobal.com\n\nWhy work with Proactive?\n\nProactive Global is an industry leading, specialist engineering recruitment agency focused on the automation, manufacturing and robotics sectors. We offer specialist recruitment services to a niche customer base, vetting that our clients offer the best opportunities for your career. Proactive encourages and promotes equality and diversity within the workforce. We act with honesty, integrity and impartiality, ensuring your application is considered on its own merits and without bias.\n\nWhen registering with Proactive you will have the opportunity to apply for some of the most interesting, specialist, opportunities in the marketplace, with the biggest companies in the sector. Follow us on Linkedin and Facebook for industry news and download our app for live notifications about newly listed vacancies. We look forward to helping you find your next role!\n\nProactive Global is committed to equality in the workplace and is an equal opportunity employer.\nProactive Global is acting as an Employment Business in relation to this vacancy",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5GNvy0q42BlpLL_FqP0OaIMDqHk-mjgnV6FKe&s=0",
      location: "Italia",
      employmentType: "Full-time",
      datePosted: "5 giorni fa",
      salaryRange: "",
      jobProviders: [
        {
          jobProvider: "Proactive Global",
          url: "https://www.proactiveglobal.com/job-search/25271-software-engineer/software-controls/italy/job?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic",
        },
        {
          jobProvider: "Indeed",
          url: "https://it.indeed.com/viewjob?jk=dec80eb83e840adf&utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic",
        },
      ],
    },
  ],
  index: 0,
  jobCount: 2,
  hasError: false,
  errors: [],
};

describe("insert a job details to db", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL_TEST);
    console.log("connected");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) await collection.drop();
  });

  it("should insert a job to the db", async () => {
    const job = setJobSchemaID(job_example);
    await JobSchema.create(job);
    const jobRes = await JobSchema.findOne({ id: job.id });

    expect(jobRes.id).toEqual(job.id);
  });

  it("should insert a job record to db via insertJob function", async () => {
    const id = job_example.id;
    const createdJob = await insertJob(job_example, "Cuoco");
    const db_result = await JobSchema.findById(createdJob._id);

    expect(db_result.id).toEqual(id);
  });

  it("should not change original job obj", async () => {
    const id = job_example.id;
    const createdJob = await insertJob(job_example, "Cuoco");

    expect(job_example.id).toEqual(id);
    expect(createdJob.id).toEqual(id);
  });

  it.skip("should not contain duplicates ", async () => {
    const createdJob_1 = await insertJob(job_example, "Cuoco");
    const createdJob_2 = await insertJob(job_example, "Cuoco");
    const db_result = await JobSchema.find({ _id: createdJob_1._id });

    expect(createdJob_2).toEqual(null);
    expect(db_result[0].id).toEqual(job_example.id);
  });

  it("should contain additionalDetails such as searchDate, searchJobType, searchLocation and searchLanguage", async () => {
    const time = new Date(Date.now());

    const additionalDetails = {
      searchJobType: "Cuoco",
      searchLocation: "Italia",
      searchLanguage: "it_IT",
      searchDate: time,
    };

    const createdJob = await insertJob(job_example, additionalDetails);

    const db_result = await JobSchema.findById(createdJob._id);

    expect(createdJob._id).toBe(db_result._id);
    expect(db_result.searchJobType).toBe(additionalDetails.searchJobType);
    expect(db_result.searchLocation).toBe(additionalDetails.searchLocation);
    expect(db_result.searchLanguage).toBe(additionalDetails.searchLanguage);
    expect(db_result.searchDate).toEqual(additionalDetails.searchDate);
  });

  it("should contains array of job providers of length 2", async () => {
    const time = new Date(Date.now());

    const additionalDetails = {
      searchJobType: "Cuoco",
      searchLocation: "Italia",
      searchLanguage: "it_IT",
      searchDate: time,
    };

    const createdJob = await insertJob(job_example, additionalDetails);

    const db_result = await JobSchema.find({ id: job_example.id });
    expect(db_result[0].jobProviders.length).toBe(2);
  });

  it("should add 2 jobs to db", async () => {
    const time = new Date(Date.now());

    response_example_2.jobType = "Cuoco";
    response_example_2.location = "Italia";
    response_example_2.language = "it_IT";
    response_example_2.searchDate = time;

    const res = await insertAllJobs(response_example_2);
    expect(res).toEqual(2);
  });
});
