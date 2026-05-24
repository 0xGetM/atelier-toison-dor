import 'resend';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  const json = await request.json().catch(() => null);
  if (!json) {
    return new Response(JSON.stringify({ error: "Corps de requête invalide." }), { status: 400 });
  }
  const { name, email, phone, service, slot, message } = json;
  if (!name?.trim() || !email?.trim() || !service?.trim() || !slot?.trim()) {
    return new Response(JSON.stringify({ error: "Champs obligatoires manquants." }), { status: 400 });
  }
  {
    console.error("Missing RESEND_API_KEY or CONTACT_EMAIL env vars");
    return new Response(JSON.stringify({ error: "Configuration serveur manquante." }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
