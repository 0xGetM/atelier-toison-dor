import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const json = await request.json().catch(() => null);

  if (!json) {
    return new Response(JSON.stringify({ error: 'Corps de requête invalide.' }), { status: 400 });
  }

  const { name, email, phone, service, slot, message, pageUrl, company } = json as Record<string, string>;

  if (!name?.trim() || !email?.trim() || !service?.trim() || !slot?.trim()) {
    return new Response(JSON.stringify({ error: 'Champs obligatoires manquants.' }), { status: 400 });
  }

  // Honeypot: bots fill the company field, humans leave it empty
  if (company?.trim()) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  const endpoint  = import.meta.env.NEXT_PUBLIC_MAILER_ENDPOINT;
  const siteToken = import.meta.env.NEXT_PUBLIC_MAILER_SITE_TOKEN;

  if (!endpoint || !siteToken) {
    console.error('Missing NEXT_PUBLIC_MAILER_ENDPOINT or NEXT_PUBLIC_MAILER_SITE_TOKEN env vars');
    return new Response(JSON.stringify({ error: 'Configuration serveur manquante.' }), { status: 500 });
  }

  const subject = `Rendez-vous — ${service.trim()} · ${slot.trim()} (${name.trim()})`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Site-Token': siteToken,
    },
    body: JSON.stringify({
      name,
      email,
      phone:   phone ?? '',
      subject,
      message: message ?? '',
      pageUrl: pageUrl ?? '',
      company: '',
    }),
  });

  if (!res.ok) {
    console.error('Mailer error:', res.status, await res.text().catch(() => ''));
    return new Response(JSON.stringify({ error: 'Échec de l\'envoi. Réessayez.' }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
