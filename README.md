# Job Search API client

## Usage

```
node index <job_types_list_filename.json> <key_list_filename.json>
```

```
// .env

API_KEY=your_key // not required

API_HOST=jobs-api14.p.rapidapi.com
API_URL=https://jobs-api14.p.rapidapi.com/list
API_LOCATION=Italia
API_LANGUAGE=it_IT

DB_URL=mongodb_url/database // required
```

```js
const config = {
    API_URL: "https://jobs-api14.p.rapidapi.com/list",
    API_HOST: "jobs-api14.p.rapidapi.com"
}

const automate = new Automate(keys_set, config)

const options = {
    location: "Italia",
    language: "it_IT",
    datePosted: "month",
    employmentTypes: "fulltime;parttime;intern;contractor"
}

await automate.collect(job_types_list, options)
```