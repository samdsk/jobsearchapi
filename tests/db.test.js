const mongoose = require("mongoose");
const { setJobSchemaID, insertJob } = require("../db/InsertJob");
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

describe("Change id field to _id", () => {
  it("should change key id to _id", () => {
    const id = "1234567890";
    const job = {
      id: id,
    };

    expect(setJobSchemaID(job)._id).toEqual(id);
  });
});

describe("insert a job details to db", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
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
    const jobRes = await JobSchema.findById(job._id);

    expect(jobRes._id).toEqual(job._id);
  });

  it("should insert a job record to db via insertJob function", async () => {
    const id = job_example.id;
    const createdJob = await insertJob(job_example, "Cuoco");
    const db_result = await JobSchema.findById(createdJob._id);

    expect(db_result._id).toEqual(id);
  });

  it("should not change original job obj", async () => {
    const id = job_example.id;
    const createdJob = await insertJob(job_example, "Cuoco");

    expect(job_example.id).toEqual(id);
    expect(createdJob._id).toEqual(id);
  });

  it("should not contain duplicates", async () => {
    const createdJob_1 = await insertJob(job_example, "Cuoco");
    const createdJob_2 = await insertJob(job_example, "Cuoco");
    const db_result = await JobSchema.find({ _id: createdJob_1._id });

    expect(createdJob_2).toEqual(null);
    expect(db_result[0]._id).toEqual(job_example.id);
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

    const db_result = await JobSchema.findById(job_example.id);

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

    const db_result = await JobSchema.findById(job_example.id);
    expect(db_result.jobProviders.length).toBe(2);
  });
});
