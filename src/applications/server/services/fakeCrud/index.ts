import { Router } from 'express';
import { existsSync, writeFileSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { v4 } from 'uuid';

const dataJSONPath = './data.json';

const isDataJSONExists = existsSync(dataJSONPath);

if (!isDataJSONExists) {
  writeFileSync(dataJSONPath, JSON.stringify({ users: [] }));
}

/**
 * This service is made to demonstrate useMutation/invalidate queries with react-query
 * You can delete it at any time
 */
export const fakeCRUDRouter = Router();

fakeCRUDRouter.get('/users', async (req, res) => {
  const parsedLimit = parseInt(req.query['limit']?.toString() || '0', 10);
  const limit = Number.isNaN(parsedLimit) ? 10 : parsedLimit;
  const parsedOffset = parseInt(req.query['offset']?.toString() || '0', 10);
  const offset = Number.isNaN(parsedOffset) ? 0 : parsedOffset;
  const statusFilter = req.query['status']?.toString();

  const users = await readUsers();
  const filteredUsers = statusFilter ? users.filter((u) => u.status === statusFilter) : users;

  if (!filteredUsers.length) {
    return res.status(404).json(renderError(404, 'No users'));
  }

  return res.status(200).json({
    data: {
      users: filteredUsers.slice(offset, limit),
      total: filteredUsers.length,
    },
  });
});

fakeCRUDRouter.get('/users/:id', async (req, res) => {
  const userIdToGet = req.params.id;

  const users = await readUsers();

  const neededUser = users.find((u) => u.id === userIdToGet);

  if (!neededUser) {
    return res.status(404).json(renderError(404, `No user with id: ${userIdToGet}`));
  }

  return res.status(200).json({
    data: { user: neededUser },
  });
});

fakeCRUDRouter.post('/users', async (req, res) => {
  const users = await readUsers();
  const newUserId = v4();

  await writeUsers(
    users.concat({
      ...req.body,
      id: newUserId,
    }),
  );

  return res.status(200).json({
    data: { id: newUserId },
  });
});

fakeCRUDRouter.patch('/users/:id', async (req, res) => {
  const userIdToUpdate = req.params.id;
  const paramsToUpdate = req.body;
  const users = await readUsers();
  const userToUpdateIndex = users.findIndex((u) => u.id === userIdToUpdate);
  const mutableUserToUpdate = users[userToUpdateIndex];

  if (!mutableUserToUpdate) {
    return res.status(400).json(renderError(400, `No user with id: ${userIdToUpdate}`));
  }

  if (paramsToUpdate.name) {
    mutableUserToUpdate.name = paramsToUpdate.name;
  }

  if (paramsToUpdate.status) {
    mutableUserToUpdate.status = paramsToUpdate.status;
  }

  await writeUsers(users);

  return res.status(200).json({
    data: { user: mutableUserToUpdate },
  });
});

fakeCRUDRouter.delete('/users/:id', async (req, res) => {
  const userIdToDelete = req.params.id;
  const users = await readUsers();

  if (!users.length || !users.find((u) => u.id === userIdToDelete)) {
    return res.status(400).json(renderError(400, `No user with id: ${userIdToDelete}`));
  }

  const filteredUsers = users.filter((u) => u.id !== userIdToDelete);

  await writeUsers(filteredUsers);

  return res.status(200).json({
    data: { id: userIdToDelete },
  });
});

function writeUsers(users: any[]) {
  return writeFile(
    dataJSONPath,
    JSON.stringify({
      users,
    }),
  );
}

function readUsers(): Promise<any[]> {
  return readFile(dataJSONPath).then((data) => {
    return JSON.parse(data.toString()).users;
  });
}

function renderError(code: number, message?: string) {
  return {
    error: {
      code,
      message,
    },
  };
}
