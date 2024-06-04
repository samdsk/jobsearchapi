const JobPostService = require("../../lib/Services/JobPostService");
const AnnotationService = require("../../lib/Services/AnnotationService");
const { JobPost } = require("../../schemas/JobPost");
const TransactionWrapper = require("../../lib/TransactionWrapper");

const opts = { runValidators: true };

describe("JobPost Service:", () => {
  beforeEach(() => jest.restoreAllMocks());
  it("create jobpost", async () => {
    const spy = jest
      .spyOn(JobPost, "create")
      .mockImplementation(async () => Promise.resolve());

    const jobpost = {
      title: "title",
      company: "company",
      location: "location",
    };

    await JobPostService.create(jobpost);

    expect(spy).toHaveBeenCalled();
  });

  it("jobpost update job_type", async () => {
    const spy = jest
      .spyOn(JobPost, "updateOne")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";
    const job_type = "job_type";
    await JobPostService.updateJobType(id, job_type);

    expect(spy).toHaveBeenCalledWith({ _id: id }, { job_type: job_type }, opts);
  });
  it("jobpost update title", async () => {
    const spy = jest
      .spyOn(JobPost, "updateOne")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";
    const title = "title";
    await JobPostService.updateTitle(id, title);

    expect(spy).toHaveBeenCalledWith({ _id: id }, { title: title }, opts);
  });
  it("jobpost update company", async () => {
    const spy = jest
      .spyOn(JobPost, "updateOne")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";
    const company = "company";
    await JobPostService.updateCompany(id, company);

    expect(spy).toHaveBeenCalledWith({ _id: id }, { company: company }, opts);
  });
  it("jobpost update location", async () => {
    const spy = jest
      .spyOn(JobPost, "updateOne")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";
    const location = "location";
    await JobPostService.updateLocation(id, location);

    expect(spy).toHaveBeenCalledWith({ _id: id }, { location: location }, opts);
  });
  it("jobpost update employment_type", async () => {
    const spy = jest
      .spyOn(JobPost, "updateOne")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";
    const employment_type = "employment_type";
    await JobPostService.updateEmploymentType(id, employment_type);

    expect(spy).toHaveBeenCalledWith(
      { _id: id },
      { employment_type: employment_type },
      opts
    );
  });
  it("jobpost update description", async () => {
    const spy = jest
      .spyOn(JobPost, "updateOne")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";
    const description = "description";
    await JobPostService.updateDescription(id, description);

    expect(spy).toHaveBeenCalledWith(
      { _id: id },
      { description: description },
      opts
    );
  });
  it("jobpost update links", async () => {
    const spy = jest
      .spyOn(JobPost, "updateOne")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";
    const links = "links";
    await JobPostService.updateLinks(id, links);

    expect(spy).toHaveBeenCalledWith({ _id: id }, { links: links }, opts);
  });
  it("jobpost add link", async () => {
    const spy = jest
      .spyOn(JobPost, "updateOne")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";
    const link = "link";
    await JobPostService.addLink(id, link);

    expect(spy).toHaveBeenCalledWith(
      { _id: id },
      { $push: { links: link } },
      opts
    );
  });
  it("jobpost remove link by source", async () => {
    const spy = jest
      .spyOn(JobPost, "updateOne")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";
    const link_source = "link source";
    await JobPostService.removeLinkBySource(id, link_source);

    expect(spy).toHaveBeenCalledWith(
      { _id: id },
      { $pull: { links: { source: link_source } } },
      opts
    );
  });
  it("jobpost remove link by url", async () => {
    const spy = jest
      .spyOn(JobPost, "updateOne")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";
    const link_url = "link_url";
    await JobPostService.removeLinkByURL(id, link_url);

    expect(spy).toHaveBeenCalledWith(
      { _id: id },
      { $pull: { links: { url: link_url } } },
      opts
    );
  });

  it("delete jobpost with session", async () => {
    const spyJobPost = jest
      .spyOn(JobPost, "deleteOne")
      .mockImplementation(async () => Promise.resolve());

    const spyAnnotationService = jest
      .spyOn(AnnotationService, "deleteAnnotations")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";
    const session = "session";

    await JobPostService.deleteJobPost(id, session);

    expect(spyJobPost).toHaveBeenCalledWith({ _id: id }, { session: session });
    expect(spyAnnotationService).toHaveBeenCalledWith(
      { job_post: id },
      session
    );
  });

  it("delete jobpost without session", async () => {
    const spyJobPost = jest
      .spyOn(JobPost, "deleteOne")
      .mockImplementation(async () => Promise.resolve());

    const spyTransactionWrapper = jest
      .spyOn(TransactionWrapper, "transactionWrapper")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";

    await JobPostService.deleteJobPost(id);

    expect(spyTransactionWrapper).toHaveBeenCalled();
  });
});
