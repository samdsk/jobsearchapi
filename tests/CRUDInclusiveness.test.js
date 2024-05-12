require("dotenv").config();
const mongoose = require("mongoose");
const CRUDInclusiveness = require("../lib/CRUDInclusiveness");
const CRUDJobPost = require("../lib/CRUDJobPost");
const { RapidApiJobPost } = require("../lib/ConvertToJobPost");
const JobPost = require("../schema/JobPost");
const Inclusiveness = require("../schema/Inclusiveness");

const example_jobpost = {
  id: "QSxkLGQsZSx0LHQsbywgLEMsYSx0LGUscixpLG4sZywgLEEsZSxyLG8scCxvLHIsdCxvLCAsRixpLHU=",
  title: "Addetto Catering Aeroporto Fiumicino (697941)",
  company: "Manpower CORE Volume",
  description:
    "Manpower, per importante azienda leader nella fornitura di servizi catering, cerca:\n\nADDETTI ED ADDETTE AL CATERING AEREO\n\nLa figura richiesta dovrà occuparsi di:\n• predisposizione degli alimenti in conformità con le normative sanitarie e di sicurezza\n• caricamento dei pasti su appositi carrelli aerei\n• pulizia e lavaggio delle attrezzature e delle aree di lavoro\n• gestione degli inventari\n\nRequisiti:\n\nAutomuniti\n\nDisponibilità al lavoro su turni\n\nDisponibilità a lavorare nel weekend\n\nCapacità di lavorare in un ambiente dinamico e veloce\n\nOrario di lavoro: lavoro su 2 turni (6-14 e 14-22)\n\nLuogo di Lavoro: FIUMICINO (RM)\n\nTipo di contratto: previsto contratto di somministrazione FULL TIME a tempo determinato con possibilità di proroga\n\n\"Manpower e le altre Società di ManpowerGroup garantiscono (ai sensi del D.Lgs 198/2006, D.Lgs.215/2003 e D.Lgs.216/2003) pari opportunità di accesso al lavoro a tutt* i/le candidat* e sono impegnate nel favorire il rispetto delle diversità e... l'inclusione sul posto di lavoro. Il servizio è gratuito. I/Le candidat* sono invitati a leggere l'informativa Privacy disponibile su www.Manpower.it - Aut. Min. Prot. N. 1116 - SG - del 26/11/04. Il titolare della registrazione e/o candidatura dichiara di essere a conoscenza delle sanzioni penali previste in caso di dichiarazioni mendaci ai sensi e per gli effetti dell'art.46 del D.P.R. 445/2000\"\nby helplavoro.it",
  image: "",
  location: "Fiumicino RM, Italia",
  employmentType: "Full-time e Temporaneo",
  datePosted: "10 ore fa",
  salaryRange: "",
  jobProviders: [
    {
      jobProvider: "Indeed",
      url: "https://it.indeed.com/viewjob?jk=2031bf99cfc5cf64&utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic",
    },
  ],
};

const example_inclusiveness = {
  job_post_id: null,
  is_inclusive: true,
  type: "gender",
  score: 4,
};

const job_type = "Example Job Type";

beforeAll(async () => {
  await mongoose.connect(process.env.DB_URL_TEST);
  console.log("[DB] connected");
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) await collection.drop();
});

afterAll(async () => {
  await mongoose.connection.close();
});

test("insert a Inclusiveness to db", async () => {
  const job = RapidApiJobPost(example_jobpost, job_type);
  const job_post_res = await CRUDJobPost.insertJobPost(job);

  const expected_job_post = await JobPost.findById(job_post_res._id);
  expect(expected_job_post._id).toEqual(job_post_res._id);

  example_inclusiveness.job_post_id = expected_job_post._id;
  const inclusiveness_res = await CRUDInclusiveness.insertInclusiveness(
    example_inclusiveness
  );

  const expected_inclusiveness = await CRUDInclusiveness.findInclusiveness({
    _id: inclusiveness_res._id,
  });

  expect(expected_inclusiveness._id).toEqual(inclusiveness_res._id);
  expect(expected_inclusiveness.job_post_id).toEqual(expected_job_post._id);
});

test("undefined job_post_id", async () => {
  delete example_inclusiveness.job_post_id;

  await expect(
    CRUDInclusiveness.insertInclusiveness(example_inclusiveness)
  ).rejects.toThrow("job_post_id is required!");
});

test("null job_post_id", async () => {
  await expect(
    CRUDInclusiveness.insertInclusiveness(example_inclusiveness)
  ).rejects.toThrow("job_post_id is required!");
});

test("invalid job_post_id", async () => {
  example_inclusiveness.job_post_id = 123456;
  await expect(
    CRUDInclusiveness.insertInclusiveness(example_inclusiveness)
  ).rejects.toThrow("Invalid job_post_id!");
});

test("not existing job_post_id", async () => {
  example_inclusiveness.job_post_id = "123456";
  await expect(
    CRUDInclusiveness.insertInclusiveness(example_inclusiveness)
  ).rejects.toThrow("Invalid job_post_id!");
});

test("already existing inclusiveness", async () => {
  const job = RapidApiJobPost(example_jobpost, job_type);
  const job_post_res = await CRUDJobPost.insertJobPost(job);

  const expected_job_post = await JobPost.findById(job_post_res._id);
  expect(expected_job_post._id).toEqual(job_post_res._id);

  example_inclusiveness.job_post_id = expected_job_post._id;

  await CRUDInclusiveness.insertInclusiveness(example_inclusiveness);

  await expect(
    CRUDInclusiveness.insertInclusiveness(example_inclusiveness)
  ).rejects.toThrow(
    "Already exists an inclusiveness record for this job post!"
  );
});
