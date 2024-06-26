class JobPostConverter {
  static convert(job, data_provider, icu_locale) {
    return {
      _id: job._id,
      job_type: job.job_type,
      title: job.title,
      company: job.company,
      location: job.location,
      text: job.description,
      links: job.links,
      icu_locale_language_tag: icu_locale,
      data_provider: data_provider,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }
}

module.exports = JobPostConverter;
