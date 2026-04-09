import { expect, test } from '@playwright/test';

function rnd(n = 8) {
  return Math.random().toString(36).slice(2, 2 + n);
}

test.describe('users api', () => {
  test('contact list: register, list, profile, patch, delete', async ({ request }) => {
    const password = 'Secret123!';
    const email = `tc_${Date.now()}_${rnd(6)}@fake.com`;

    const reg = await request.post('/users', {
      data: {
        firstName: 'Test',
        lastName: 'Camp',
        email,
        password,
      },
    });
    expect(reg.status()).toBe(201);
    const regBody = (await reg.json()) as {
      token: string;
      user: { firstName: string; lastName: string; email: string; _id: string };
    };
    expect(regBody.token).toBeTruthy();
    expect(regBody.user.email).toBe(email);
    expect(regBody.user.firstName).toBe('Test');
    expect(regBody.user.lastName).toBe('Camp');

    const token = regBody.token;
    const auth = { Authorization: `Bearer ${token}` };

    const contactsRes = await request.get('/contacts', { headers: auth });
    expect(contactsRes.status()).toBe(200);
    const contacts = await contactsRes.json();
    expect(Array.isArray(contacts)).toBeTruthy();

    const me1 = await request.get('/users/me', { headers: auth });
    expect(me1.status()).toBe(200);
    const u1 = (await me1.json()) as { firstName: string; lastName: string; email: string };
    expect(u1.firstName).toBe('Test');
    expect(u1.lastName).toBe('Camp');
    expect(u1.email).toBe(email);

    const newFirst = `Fn_${rnd(10)}`;
    const newLast = `Ln_${rnd(10)}`;
    const emailV2 = `test_v2_${Date.now()}@fake.com`;

    const patch = await request.patch('/users/me', {
      headers: auth,
      data: {
        firstName: newFirst,
        lastName: newLast,
        email: emailV2,
        password,
      },
    });
    expect(patch.status()).toBe(200);
    const patched = (await patch.json()) as { firstName: string; lastName: string; email: string };
    expect(patched.firstName).toBe(newFirst);
    expect(patched.lastName).toBe(newLast);
    expect(patched.email).toBe(emailV2);

    const me2 = await request.get('/users/me', { headers: auth });
    expect(me2.status()).toBe(200);
    const u2 = await me2.json() as { firstName: string; lastName: string; email: string };
    expect(u2.firstName).toBe(newFirst);
    expect(u2.lastName).toBe(newLast);
    expect(u2.email).toBe(emailV2);

    const del = await request.delete('/users/me', { headers: auth });
    expect(del.status()).toBe(200);

    const me3 = await request.get('/users/me', { headers: auth });
    expect(me3.status()).toBe(401);
  });
});
