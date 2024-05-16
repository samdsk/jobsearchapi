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

const example_jobpost_2 = {
  id: "QSxELEQsRSxULFQsSSwgLEMsQSxULEUsUixJLE4sRywgLFAsRSxSLCAsRSxWLEUsTixULEksTSxhLG4=",
  title: "ADDETTI CATERING PER EVENTI",
  company: "Manpower S.r.l.",
  description:
    "Manpower filiale di Mondovì è alla ricerca di ADDETTI CATERING per EVENTI in tutta la provincia di Cuneo.\n\nLuogo di lavoro: Cherasco, Bra, Alba, Fossano, Cuneo\n\nRequisiti:\n- disponibilità a lavorare nel weekend e in orario serale\n- gradita esperienza pregressa maturata in bar e/o ristoranti, ma non indispensabile\n\nOrario: monte ore variabile da 20 a 36 ore settimanali, in base alla disponibilità del/la candidato/a\n\nTipologia inserimento: in somministrazione\n\nInformazioni sull’azienda:\nManpower S.r.l.\n\nManpowerGroup è leader nella creazione di soluzioni integrate per l’incontro tra domanda e offerta di lavoro e lo sviluppo della carriera. Nato a Milwaukee (USA) nel 1948, conta su un network mondiale di 2.800 uffici in 80 paesi. Presente in Italia dal 1994, il Gruppo opera sull’intero territorio attraverso 3 brand: Manpower Experis Talent Solutions ed è specializzato in: Ricerca, selezione e valutazione di personale in tutte le posizioni professionali, anche di middle e top management... Somministrazione di lavoro a tempo determinato e indeterminato Progettazione e realizzazione di corsi di formazione Pianificazione e realizzazione di progetti di formazione dei lavoratori temporanei finanziati attraverso i fondi del \"Forma.Temp\" Servizi di consulenza per l'organizzazione aziendale, lo sviluppo di carriere e l'outplacement Per il decimo anno ManpowerGroup è stata inclusa nella classifica \"World’s Most Ethical Companies\" (2020) #crediamoneltalento Crediamo che il talento sia l'elemento cruciale di differenziazione delle aziende nel mondo del business. Lavoriamo per generare spirito e passione, e coinvolgere le nostre persone, con un approccio attento e sensibile all'individuo.\n\nDimensioni dell’azienda:\nOltre 10.000 dipendenti\n\nSettore:\nAgenzie di ricerca personale/Staffing/Agenzie per l'impiego\n\nFondata:\n0\n\nSito web:\nhttps://www.manpower.it",
  image: "",
  location: "Fossano CN, Italia",
  employmentType: "Full-time",
  datePosted: "1 giorno fa",
  salaryRange: "",
  jobProviders: [
    {
      jobProvider: "Monster.it",
      url: "https://www.monster.it/offerte-di-lavoro/addetti-catering-per-eventi-fossano-12--23f2d32d-859a-469e-aba3-ff61974309b4?mstr_dist=true&utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic",
    },
    {
      jobProvider: "SimplyHired",
      url: "https://www.simplyhired.it/job/3MTJFS3yEHVTN-5ltH8KcLx0XS6ZpyoAAbOm3uIXyMunOJK5pw6v6Q?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic",
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

describe("CRUDInclusiveness", () => {
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
    const job_post_res = await CRUDJobPost.createJobPost(job);

    example_inclusiveness.job_post_id = job_post_res._id;

    const inclusiveness_res = await CRUDInclusiveness.createInclusiveness(
      example_inclusiveness
    );

    const expected_inclusiveness =
      await CRUDInclusiveness.findInclusivenessByJobPostID(
        inclusiveness_res.job_post_id
      );

    expect(expected_inclusiveness._id).toEqual(inclusiveness_res._id);
  });

  test("undefined job_post_id", async () => {
    delete example_inclusiveness.job_post_id;

    await expect(
      CRUDInclusiveness.createInclusiveness(example_inclusiveness)
    ).rejects.toThrow("job_post_id is required!");
  });

  test("null job_post_id", async () => {
    await expect(
      CRUDInclusiveness.createInclusiveness(example_inclusiveness)
    ).rejects.toThrow("job_post_id is required!");
  });

  test("invalid job_post_id", async () => {
    example_inclusiveness.job_post_id = 123456;
    await expect(
      CRUDInclusiveness.createInclusiveness(example_inclusiveness)
    ).rejects.toThrow("Invalid job_post_id!");
  });

  test("not existing job_post_id", async () => {
    example_inclusiveness.job_post_id = "123456";
    await expect(
      CRUDInclusiveness.createInclusiveness(example_inclusiveness)
    ).rejects.toThrow("Invalid job_post_id!");
  });

  test("already existing inclusiveness", async () => {
    const job = RapidApiJobPost(example_jobpost, job_type);
    const job_post_res = await CRUDJobPost.createJobPost(job);

    example_inclusiveness.job_post_id = job_post_res._id;

    await CRUDInclusiveness.createInclusiveness(example_inclusiveness);
    await Inclusiveness.syncIndexes();

    await expect(
      CRUDInclusiveness.createInclusiveness(example_inclusiveness)
    ).rejects.toThrow();

    const count = (
      await Inclusiveness.find({
        job_post_id: job_post_res._id,
      })
    ).length;

    expect(count).toBe(1);
  });

  test("check index consistency after an update", async () => {
    const job = RapidApiJobPost(example_jobpost, job_type);
    const job_2 = RapidApiJobPost(example_jobpost_2, job_type);
    const job_post_res = await CRUDJobPost.createJobPost(job);
    const job_post_res_2 = await CRUDJobPost.createJobPost(job_2);

    example_inclusiveness.job_post_id = job_post_res._id;

    await CRUDInclusiveness.createInclusiveness(example_inclusiveness);
    await Inclusiveness.syncIndexes();

    example_inclusiveness.job_post_id = job_post_res_2._id;
    await CRUDInclusiveness.createInclusiveness(example_inclusiveness);

    await expect(
      CRUDInclusiveness.updateInclusivenessByJobPostID(job_post_res_2._id, {
        job_post_id: job_post_res._id,
      })
    ).rejects.toThrow();
  });

  test("delete an inclusiveness by job_post_id", async () => {
    const job = RapidApiJobPost(example_jobpost, job_type);
    const job_post_res = await CRUDJobPost.createJobPost(job);

    example_inclusiveness.job_post_id = job_post_res._id;

    const inclusiveness_res = await CRUDInclusiveness.createInclusiveness(
      example_inclusiveness
    );

    await CRUDInclusiveness.deleteInclusivenessByJobPostId(
      inclusiveness_res.job_post_id
    );

    const count = (
      await Inclusiveness.find({
        job_post_id: inclusiveness_res.job_post_id,
      })
    ).length;

    expect(count).toBe(0);
  });
});
