const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const fileIndex = args.indexOf('--file');
const isDryRun = args.includes('--dry-run');
const filePath = fileIndex !== -1 ? args[fileIndex + 1] : null;

if (!filePath) {
  console.error('Missing --file argument.');
  process.exit(1);
}

const absolutePath = path.resolve(process.cwd(), filePath);
if (!fs.existsSync(absolutePath)) {
  console.error(`File not found: ${absolutePath}`);
  process.exit(1);
}

const html = fs.readFileSync(absolutePath, 'utf-8');

const stripHtml = (value) =>
  value
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const getMatch = (regex) => {
  const match = html.match(regex);
  return match ? match[1].trim() : '';
};

const titleFromH1 = getMatch(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
const titleFromHead = getMatch(/<title[^>]*>([\s\S]*?)<\/title>/i);
const title = stripHtml(titleFromH1 || titleFromHead || '');

const contentHtml = getMatch(/<div class="article-content">([\s\S]*?)<\/div>/i);
const author = stripHtml(getMatch(/<div class="article-author">([\s\S]*?)<\/div>/i));
const publishedLabel = stripHtml(getMatch(/<div class="article-detail-meta"[^>]*>([\s\S]*?)<\/div>/i));

const baseUrl = (process.env.SITE_BASE_URL || 'https://legalhavenfoundation.org').replace(/\/$/, '');
const sourceUrl = baseUrl ? `${baseUrl}/${path.basename(filePath)}` : '';

const payload = {
  title,
  body_html: contentHtml,
  author,
  published_label: publishedLabel,
  source_url: sourceUrl,
  article_path: filePath
};

if (!payload.title || !payload.body_html) {
  console.error('Unable to extract article title or content.');
  process.exit(1);
}

const webhookUrl = process.env.SUBSTACK_WEBHOOK_URL;
if (!webhookUrl) {
  console.error('Missing SUBSTACK_WEBHOOK_URL environment variable.');
  process.exit(1);
}

if (isDryRun) {
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

const postPayload = async () => {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Webhook request failed: ${response.status} ${errorText}`);
  }

  console.log(`Sent ${path.basename(filePath)} to Substack webhook.`);
};

postPayload().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
