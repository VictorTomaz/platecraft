import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';
import { createSign } from 'node:crypto';

function base64url(input: string | Buffer) {
  return Buffer.from(input as string).toString('base64url');
}

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const keyId = secrets.get('ASC_KEY_ID');
    const issuerId = secrets.get('ASC_ISSUER_ID');
    const privateKeyPem = secrets.get('ASC_PRIVATE_KEY');
    if (!keyId || !issuerId || !privateKeyPem) {
      return Response.json(
        { error: 'Missing App Store Connect credentials (ASC_KEY_ID, ASC_ISSUER_ID, ASC_PRIVATE_KEY).' },
        { status: 500 }
      );
    }

    const header = { alg: 'ES256', kid: keyId, typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: issuerId,
      iat: now,
      exp: now + 1200, // 20 minutes, App Store Connect max
      aud: 'appstoreconnect-v1',
    };

    const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;

    const signer = createSign('SHA256');
    signer.update(signingInput);
    const signature = signer.sign({ key: privateKeyPem, dsaEncoding: 'ieee-p1363' });

    const token = `${signingInput}.${signature.toString('base64url')}`;

    return Response.json({ token, expires_at: new Date((now + 1200) * 1000).toISOString() });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}