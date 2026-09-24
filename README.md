# RoleRadar

RoleRadar is a browser-based job search assistant that helps a candidate:

- enter a target job role and current skills
- discover similar job titles
- open global and remote job searches across major job boards
- generate an ATS-friendly resume draft tailored to the selected role

## How to run

Open `index.html` in a browser, or serve the folder with any static server.

```bash
npx serve .
```

## Notes

The app does not require API keys. It builds targeted search links for live job boards instead of scraping job listings. This keeps the project lightweight, deployable, and usable without backend credentials.

Future upgrades could add authenticated integrations with job APIs such as Adzuna, Arbeitnow, Greenhouse, Lever, or LinkedIn-approved partner feeds.
