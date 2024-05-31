module.exports = [
  {
    $lookup: {
      from: "jobposts",
      localField: "source",
      foreignField: "_id",
      as: "jobpost",
    },
  },
  {
    $lookup: {
      from: "labels",
      localField: "label",
      foreignField: "_id",
      as: "label",
    },
  },
  {
    $lookup: {
      from: "domains",
      localField: "domain",
      foreignField: "_id",
      as: "domain",
    },
  },
  {
    $unwind: "$jobpost",
  },
  {
    $unwind: "$domain",
  },
  {
    $unwind: "$label",
  },
  {
    $group: {
      _id: "$_id",
      source: { $first: "$source" },
      label: { $first: "$label.label" },
      domain: { $first: "$domain.domain" },
      description: { $first: "$jobpost.description" },
      reason: { $first: "$reason" },
      tokens: { $first: "$tokens" },
      createdAt: { $first: "$createdAt" },
      updatedAt: { $first: "$updatedAt" },
    },
  },
];
