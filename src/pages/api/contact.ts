import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

// Escape HTML to prevent injection in the email body
function esc(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const POST: APIRoute = async ({ request }) => {
  const json = await request.json().catch(() => null);

  if (!json) {
    return new Response(JSON.stringify({ error: 'Corps de requête invalide.' }), { status: 400 });
  }

  const { name, email, phone, service, slot, message } = json as Record<string, string>;

  if (!name?.trim() || !email?.trim() || !service?.trim() || !slot?.trim()) {
    return new Response(JSON.stringify({ error: 'Champs obligatoires manquants.' }), { status: 400 });
  }

  const apiKey  = import.meta.env.RESEND_API_KEY;
  const to      = import.meta.env.CONTACT_EMAIL;   // business owner's inbox
  // FROM: use your agency verified domain in production.
  // During dev / before domain verified, use the Resend sandbox address.
  const from    = import.meta.env.RESEND_FROM ?? 'Toison d\'Or <onboarding@resend.dev>';

  if (!apiKey || !to) {
    console.error('Missing RESEND_API_KEY or CONTACT_EMAIL env vars');
    return new Response(JSON.stringify({ error: 'Configuration serveur manquante.' }), { status: 500 });
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to:      [to],
    replyTo: email,   // owner hits Reply → goes straight to the visitor
    subject: `Rendez-vous — ${service.trim()} (${name.trim()})`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#2D2D2D">
        <div style="background:#C27044;padding:24px 32px">
          <h1 style="margin:0;font-size:22px;color:#FAFAF7">Nouvelle demande de rendez-vous</h1>
          <p style="margin:4px 0 0;font-size:13px;color:#E8DFD0;font-family:sans-serif">Atelier La Toison d'Or</p>
        </div>
        <div style="padding:32px;background:#FAFAF7">
          <table style="width:100%;border-collapse:collapse;font-family:sans-serif;font-size:14px">
            <tr><td style="padding:8px 0;color:#888;width:160px">Nom</td>
                <td style="padding:8px 0;font-weight:600">${esc(name)}</td></tr>
            <tr><td style="padding:8px 0;color:#888">Email</td>
                <td style="padding:8px 0"><a href="mailto:${esc(email)}" style="color:#C27044">${esc(email)}</a></td></tr>
            <tr><td style="padding:8px 0;color:#888">Téléphone</td>
                <td style="padding:8px 0">${esc(phone?.trim() || '—')}</td></tr>
            <tr><td colspan="2" style="border-top:1px solid #E8DFD0;padding-top:16px"></td></tr>
            <tr><td style="padding:8px 0;color:#888">Prestation</td>
                <td style="padding:8px 0;font-weight:600">${esc(service)}</td></tr>
            <tr><td style="padding:8px 0;color:#888">Créneau souhaité</td>
                <td style="padding:8px 0">${esc(slot)}</td></tr>
            ${message?.trim() ? `
            <tr><td colspan="2" style="border-top:1px solid #E8DFD0;padding-top:16px"></td></tr>
            <tr><td style="padding:8px 0;color:#888;vertical-align:top">Message</td>
                <td style="padding:8px 0;white-space:pre-wrap">${esc(message.trim())}</td></tr>` : ''}
          </table>
        </div>
        <div style="padding:16px 32px;background:#E8DFD0;font-family:sans-serif;font-size:12px;color:#888;text-align:center">
          Répondez directement à cet email pour contacter ${esc(name)}.
        </div>
      </div>
    `,
  });

  if (error) {
    console.error('Resend error:', error);
    return new Response(JSON.stringify({ error: 'Échec de l\'envoi. Réessayez.' }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
