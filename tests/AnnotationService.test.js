const mongoose = require("mongoose");
const { RapidApiJobPost } = require("../lib/ConvertToJobPost");

const JobPostService = require("../lib/JobPostService");
const AnnotationService = require("../lib/AnnotationService");
const Annotation = require("../schemas/Annotation");

require("dotenv").config();

// TODO: not working

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

const example_annotation = {
  job_post_id: null,
  type: "type1",
  text: "Test Annotation",
  source: "Test human",
  reliability_score: 4,
  index_start: 0,
  index_end: 10,
};

const example_annotation_2 = {
  job_post_id: null,
  type: "type2",
  text: "Test Annotation 2",
  source: "Test human 2",
  reliability_score: 4,
  index_start: 0,
  index_end: 10,
};

const job_type = "Example Job Type";

describe("Annotation Service:", () => {
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

  const JOB = RapidApiJobPost(example_jobpost, job_type);

  test("insert an Annotation to db", async () => {
    const job_post_res = await JobPostService.createJobPost(JOB);
    example_annotation.job_post_id = job_post_res._id;
    const annotation_res = await AnnotationService.createAnnotation(
      example_annotation
    );

    const expected_annotation = await AnnotationService.findAnnotationById(
      annotation_res._id
    );

    expect(expected_annotation._id).toEqual(annotation_res._id);
    expect(expected_annotation.job_post_id).toEqual(job_post_res._id);
  });
  test("not existing job_post_id ", async () => {
    example_annotation.job_post_id = "1234";

    await expect(
      AnnotationService.createAnnotation(example_annotation)
    ).rejects.toThrow("Invalid job_post_id!");
  });

  test("delete annotation by id", async () => {
    const job_post_res = await JobPostService.createJobPost(JOB);
    example_annotation.job_post_id = job_post_res._id;
    const annotation_res = await AnnotationService.createAnnotation(
      example_annotation
    );

    await AnnotationService.deleteAnnotationByID(annotation_res._id);

    expect(await AnnotationService.findAnnotationById(annotation_res._id)).toBe(
      null
    );
  });

  test("delete multiple annotations by job_post_id", async () => {
    const job_post_res = await JobPostService.createJobPost(JOB);

    example_annotation.job_post_id = job_post_res._id;
    example_annotation_2.job_post_id = job_post_res._id;

    const annotation_res_1 = await AnnotationService.createAnnotation(
      example_annotation
    );

    const annotation_res_2 = await AnnotationService.createAnnotation(
      example_annotation_2
    );

    await AnnotationService.deleteAnnotationsByJobPostID(
      annotation_res_1.job_post_id
    );

    expect(
      (
        await AnnotationService.findAnnotationByJobPostID(
          annotation_res_1.job_post_id
        )
      ).length
    ).toBe(0);
  });

  test("update annotation", async () => {
    const job_post_res = await JobPostService.createJobPost(JOB);

    example_annotation.job_post_id = job_post_res._id;

    const annotation_res = await AnnotationService.createAnnotation(
      example_annotation
    );

    await AnnotationService.updateAnnotationByID(annotation_res._id, {
      type: "type2",
    });

    const annotation_update = await AnnotationService.findAnnotationById(
      annotation_res._id
    );

    expect(annotation_update.type).toBe("type2");
  });

  test("duplicate annotations", async () => {
    const job_post_res = await JobPostService.createJobPost(JOB);

    example_annotation.job_post_id = job_post_res._id;

    await AnnotationService.createAnnotation(example_annotation);
    await Annotation.syncIndexes();

    await expect(
      AnnotationService.createAnnotation(example_annotation)
    ).rejects.toThrow();
  });

  test("duplicate update annotation", async () => {
    const job_post_res = await JobPostService.createJobPost(JOB);

    example_annotation.job_post_id = job_post_res._id;

    const annotation_res = await AnnotationService.createAnnotation(
      example_annotation
    );

    example_annotation_2.job_post_id = job_post_res._id;
    const annotation_res_2 = await AnnotationService.createAnnotation(
      example_annotation_2
    );

    await Annotation.syncIndexes();

    await expect(
      AnnotationService.updateAnnotationByID(annotation_res_2._id, {
        type: "type1",
      })
    ).rejects.toThrow();
  });
});
