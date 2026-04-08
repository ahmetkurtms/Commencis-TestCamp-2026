import { expect, test } from '@playwright/test';

function randomToken(len = 10) {
  return Math.random().toString(36).slice(2, 2 + len);
}

test.describe('users api', () => {
  test('crud flow', async ({ request }) => {
    const listRes = await request.get('users');
    expect(listRes.ok()).toBeTruthy();
    const listJson = (await listRes.json()) as {
      data: Array<{ id: number; firstName: string; lastName: string; email: string }>;
    };
    expect(Array.isArray(listJson.data)).toBeTruthy();
    expect(listJson.data.length).toBeGreaterThan(0);

    const email = `auto_${randomToken()}@test.dev`;
    const createRes = await request.post('users', {
      data: {
        firstName: 'Added',
        lastName: 'ByTest',
        email,
      },
    });
    expect(createRes.status()).toBe(201);
    const created = (await createRes.json()) as {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
    };
    expect(created.id).toBeGreaterThan(0);
    expect(created.firstName).toBe('Added');
    expect(created.lastName).toBe('ByTest');
    expect(created.email).toBe(email);

    const id = created.id;

    const getAfterCreate = await request.get(`users/${id}`);
    expect(getAfterCreate.ok()).toBeTruthy();
    const bodyAfterCreate = (await getAfterCreate.json()) as {
      data: { firstName: string; lastName: string; email: string };
    };
    expect(bodyAfterCreate.data.firstName).toBe('Added');
    expect(bodyAfterCreate.data.lastName).toBe('ByTest');
    expect(bodyAfterCreate.data.email).toBe(email);

    const newFirst = `Rand_${randomToken()}`;
    const newLast = `Str_${randomToken()}`;
    const updateRes = await request.put(`users/${id}`, {
      data: { firstName: newFirst, lastName: newLast },
    });
    expect(updateRes.ok()).toBeTruthy();
    const updated = (await updateRes.json()) as { firstName: string; lastName: string };
    expect(updated.firstName).toBe(newFirst);
    expect(updated.lastName).toBe(newLast);

    const getAfterUpdate = await request.get(`users/${id}`);
    expect(getAfterUpdate.ok()).toBeTruthy();
    const bodyAfterUpdate = (await getAfterUpdate.json()) as {
      data: { firstName: string; lastName: string };
    };
    expect(bodyAfterUpdate.data.firstName).toBe(newFirst);
    expect(bodyAfterUpdate.data.lastName).toBe(newLast);

    const deleteRes = await request.delete(`users/${id}`);
    expect(deleteRes.status()).toBe(204);

    const getAfterDelete = await request.get(`users/${id}`);
    expect(getAfterDelete.status()).toBe(404);
  });
});
